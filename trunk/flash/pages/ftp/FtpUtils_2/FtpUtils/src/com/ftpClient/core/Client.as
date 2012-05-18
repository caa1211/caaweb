package com.ftpClient.core
{
	import com.ftpClient.event.FTPEvent;
	import com.ftpClient.model.Command;
	import com.ftpClient.model.Config;
	import com.ftpClient.model.ControlSocket;
	import com.ftpClient.model.Response;
	import com.ftpClient.worker.CwdWorker;
	import com.ftpClient.worker.DeleWorker;
	import com.ftpClient.worker.DownloadWorker;
	import com.ftpClient.worker.ListWorker;
	import com.ftpClient.worker.LoginWorker;
	import com.ftpClient.worker.MkdWorker;
	import com.ftpClient.worker.UploadWorker;
	
	/**
	 * FTP客户端类
	 * 包含所有的操作流程
	 * 如需扩展,只需要添加方法,实际的流程操作类继承自IWorker接口
	 */
	public class Client
	{
		
		/**
		 * @private
		 * @default null
		 * 控制连接实例
		 */
		private var control:ControlSocket = null;
		/**
		 * @private
		 * 回调函数
		 */
		private var _responseCall:Function;
		
		/**
		 * 构造函数
		 */
		public function Client()
		{
			control = ControlSocket.getInstance();
		}
		
		/**
		 * 连接函数
		 * @param config
		 * Infomation of server and user
		 * @see com.elfish.ftp.model.Config
		 */
		public function connect(config:Config):void
		{
			ControlSocket.config = config;
			control.responseCall = connected;
			
			control.connect();
		}
		/**
		 * 返回是否已经连接
		 */
		public function isConnected():Boolean{
			return control.isConnected();
		}
		
		public function closeConn():void{
			control.closeConn();
		}
		
		/**
		 * 登录流程
		 * @param config
		 * Infomation of server and user
		 * @see com.elfish.ftp.model.Config
		 */
		public function login(config:Config):void
		{
			var worker:LoginWorker = new LoginWorker(control, config);
			worker.addEventListener(FTPEvent.FTP_WORLFINISH, finished);
			worker.executeCommand();
		}
		
		/**
		 * 上传流程
		 * @param name
		 * String uploaded fileName
		 * @param fileData
		 * Infomation of the File could be uploaded
		 */
		public function upload(name:String, fileData:*, fun:Function = null):void
		{
			var worker:UploadWorker = new UploadWorker(control, name, fileData);
			if(fun!=null)
			{
				worker.addEventListener(FTPEvent.FTP_WORLFINISH, fun);
			}
			worker.executeCommand();
		}
		
		/**
		 * 下载流程
		 * @param path
		 * String Path of the File could be download
		 */
		public function download(path:String):void
		{
			var worker:DownloadWorker = new DownloadWorker(control, path);
			worker.addEventListener(FTPEvent.FTP_WORLFINISH, finished);
			worker.executeCommand();
		}
		
		/**
		 * 设置目录流程
		 * @param name
		 * String Path to set
		 */
		public function setDirectory(name:String,fun:Function = null):void
		{
			var worker:CwdWorker = new CwdWorker(control, name);
			if(fun!=null)
			{
				worker.addEventListener(FTPEvent.FTP_WORLFINISH, fun);
			}
			worker.executeCommand();
		}
		
		/**
		 * 创建目录流程
		 * @param name
		 * String Name to create
		 */
		public function createDirectory(name:String, fun:Function = null):void
		{
			var worker:MkdWorker = new MkdWorker(control, name);
			if(fun!=null)
			{
				worker.addEventListener(FTPEvent.FTP_WORLFINISH, fun);
			}
			worker.executeCommand();
		}
		
		/**
		 * 删除目录流程
		 * @param name
		 * String Name to delete
		 * @param isFile
		 * Boolean Is File or Directory
		 */
		public function deleteDirectory(name:String, isFile:Boolean):void
		{
			var worker:DeleWorker = new DeleWorker(control, name, isFile);
			worker.addEventListener(FTPEvent.FTP_WORLFINISH, finished);
			worker.executeCommand();
		}
		
		/**
		 * 列表流程
		 * @param path
		 * String Want to list path
		 */
		public function list(path:String = ""):void
		{
			var worker:ListWorker = new ListWorker(control, path);
			worker.addEventListener(FTPEvent.FTP_WORLFINISH, finished);
			worker.executeCommand();
		}
		
		/**
		 * 默认帮助流程
		 * @param message
		 * String Help message
		 */
		public function help(message:String):void
		{
			if(Console.target) {
				Console.console(message, true);
			}
		}
		
		/**
		 * 连接成功的回调
		 * @param response
		 * Response Infomation from server
		 * @see com.elfish.ftp.model.Response
		 */
		public function connected(response:Response):void
		{
			if(response.code == 220) {
				login(ControlSocket.config);
			}
		}
		
		/**
		 * 发送命令
		 * @param comStr 命令字符串
		 */
		public function sendCommand(comStr:String):void
		{
			var cmd:Command = new Command(comStr);
			control.send(cmd);
		}
		
		/**
		 * 流程结束的回调
		 * @param event
		 * FTPEvent data from server
		 * @see com.elfish.ftp.event.FTPEvent
		 */
		public function finished(event:FTPEvent):void
		{
			var response:Response = event.param as Response;
			switch(response.code) {
				case 230:	// User logged
				case 250:	// Delete, cwd
				case 257:	// Mkd
				case 550:	// Mkd, error
				case 999:	// Upload end
				{
					list();
				}break;
				case 226:	// Transform end
				{
					if(responseCall != null)
					{
						responseCall.call(null, response);
					}
				}
			}
		}
		
		/**
		 * 设置回调函数
		 */
		public function set responseCall(call:Function):void
		{
			this._responseCall = call;
		}
		/**
		 * 获取回调函数
		 */
		public function get responseCall():Function
		{
			return this._responseCall;
		}
		
		
	}
}