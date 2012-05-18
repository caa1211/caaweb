package com.ftpClient.model
{
	import com.ftpClient.core.Console;
	import com.ftpClient.util.Parser;
	
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.net.Socket;
	import flash.system.Security;
	
	/**
	 * 控制连接
	 * 负责对FTP的长久连接
	 * 并且接收状态返回和发送控制命令
	 */
	public class ControlSocket extends EventDispatcher
	{
		
		/**
		 * 配置信息
		 */
		public static var config:Config = null;
		
		/**
		 * 控制连接实例
		 */
		public static var control:ControlSocket = null;
		
		/**
		 * 回调函数
		 */
		public var responseCall:Function = null;
		
		/**
		 * SOCKET连接
		 */
		private var socket:Socket = null;
		
		public function ControlSocket():void
		{
			socket = new Socket();
			socket.addEventListener(Event.CONNECT, response);
			socket.addEventListener(ProgressEvent.SOCKET_DATA, response);
			socket.addEventListener(IOErrorEvent.IO_ERROR, close);
			socket.addEventListener(Event.CLOSE, close);
		}
		
		/**
		 * 保证唯一控制连接实例
		 */
		public static function getInstance():ControlSocket
		{
			if(control == null) {
				control = new ControlSocket();
			}
			return control;
		}
		/**
		 * 返回是否已经连接
		 */
		public function isConnected():Boolean{
			return socket.connected;
		}
		
		/**
		 * 连接FTP
		 */
		public function connect():void
		{
//			Security.loadPolicyFile("xmlsocket://localhost:21");
			socket.connect(config.ip, int(config.port));
		}
		
		/**
		 * 发送命令
		 * @param comm
		 * Command Command instance
		 * @see com.elfish.ftp.model.Command
		 */
		public function send(comm:Command):void
		{
			if(Console.target)
			{
				Console.console(comm.toExecuteString());
			}
				
			socket.writeMultiByte(comm.toExecuteString(), "utf8");
			socket.flush();
		}
		
		
		public function closeConn():void{
			try{
				socket.close();
			}catch(e:Error){
				if(Console.target)
					Console.console("连接失败!");
			}
		}
		
		/**
		 * 关闭连接
		 * 监听连接失败
		 */
		public function close(event:* = null):void
		{
			if(event is IOErrorEvent) {
				if(Console.target)
					Console.console("连接失败!");
			}else
				socket.close();
		}
		
		/**
		 * 状态返回监听函数
		 * 处理返回的状态码以及所带的数据
		 * 使用Parser进行数据解析,提取有用数据
		 * @see com.elfish.ftp.util.Parser
		 */
		public function response(event:*):void
		{
			var message:String = socket.readMultiByte(socket.bytesAvailable, "utf8");
			var messageList:Array = message.split("\r\n");
				
			for(var i:Number=0;i<messageList.length;i++) {	
				if(messageList[i].length > 0) {
					if(Console.target)
						Console.console(messageList[i], true);
					
					var result:Response = Parser.standableParse(messageList[i]);
					if(result.code == 257)
						result = Parser.directoryParse(result);
					else if(result.code == 227)
						result = Parser.modelParse(result);
	
					responseCall.call(null, result);
				}
			}
		}

	}
}