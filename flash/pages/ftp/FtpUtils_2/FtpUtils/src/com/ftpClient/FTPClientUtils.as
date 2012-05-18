package com.ftpClient
{
	import com.ftpClient.core.Client;
	import com.ftpClient.model.Config;
	import com.ftpClient.model.FTPFile;
	import com.ftpClient.model.Response;
	
	import flash.events.Event;
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.net.FileReference;
	
	import mx.collections.ArrayCollection;
	import mx.controls.Alert;
	
	////////////////////////////////////////////////////////////////////////////////
	//
	//  Copyright (C) 2011-2012 mengssqn
	//  The following is Source Code about Client.as
	//	Bug and advice to mengssqn@gmail.com
	//
	////////////////////////////////////////////////////////////////////////////////
	
	/**
	 *ftp客户端工具文件类
	 * @author 子非竹
	 */
	public class FTPClientUtils
	{
		public function FTPClientUtils()
		{
		}
		
		public static var client:Client;
		private static var config:Config = null;
		
		/**
		 * 创建连接
		 * @param ip 服务器地址
		 * @param port 服务器端口号
		 * @param user 账号
		 * @param pass 密码
		 */
		public static function initConn(ip:String, port:String, user:String, pass:String):void
		{
			config = new Config(ip, port, user, pass);
			client = new Client();
			client.connect(config);
		}
		
		/**
		 * 上传文件
		 * @param file 要上传的文件
		 * @param dirName 文件所在目录
		 * @param fun 上传成功后的返回函数
		 */
		public static function upLoadFile(file:FileReference, dirName:String, backFun:Function = null):void
		{
			if(!client.isConnected())
			{
				client.connect(config);
			}
			
			file.addEventListener(Event.COMPLETE, function upLoad():void
			{
				client.upload(dirName + "/" + file.name, file.data, backFun);//开始上传
			});
			file.load();
		}
		
		/**
		 * 下载文件
		 * @param severPath 要下载的服务器文件路径
		 * @param dirName 下载路径
		 * @param fun 下载成功后的返回函数
		 */
		public static function downLoadFile(severPath:String, localPath:String, funCall:Function = null):void
		{
			if(!client.isConnected())
			{
				client.connect(config);
			}
			
			client.download(severPath);
			
			client.responseCall = fun;
			
			function fun(response:Response):void
			{
				var file:File = new File();
				file.url = localPath;
				
				try
				{
					var fs:FileStream = new FileStream();
					fs.open(file, FileMode.WRITE);
					fs.writeBytes(response.data);
					fs.close();
					
					if(funCall != null)
					{
						funCall.call();
					}
				}
				catch(e:Error)
				{
					Alert.show(e.message);
				}     
			}
		}
		
		/**
		 *获取目录列表
		 * @param listing ftp返回数据字符串
		 * @param dir ftp目录
		 * @return arr 返回的文件集合
		 */
		public static function getFTPList(dir:String, funCall:Function):void
		{
			if(!client.isConnected())
			{
				client.connect(config);
			}
			
			client.list(dir);
			
			client.responseCall = backFun;
			
			function backFun(response:Response):void
			{
				var arr:ArrayCollection = new ArrayCollection();
				
				var rawList:Array = response.data.toString().match(/^.+/gm);
				for (var i:int = 0; i < rawList.length; i++)
				{
					arr.addItem(FTPFile.getFtpFile(rawList[i], dir));
				}
				
				funCall.call(null, arr);
			}
		}
		
		/**
		 *发送命令
		 * @param command 发送命令
		 */
		public static function sendCommand(command:String):void
		{
			if(!client.isConnected())
			{
				client.connect(config);
			}
			client.sendCommand(command);
		}
		
	}
}