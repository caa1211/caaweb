package com.ftpClient.model
{
	import com.ftpClient.core.Console;
	import com.ftpClient.event.FTPEvent;
	import com.ftpClient.util.Parser;
	
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.net.FileReference;
	import flash.net.Socket;
	import flash.system.Security;
	import flash.utils.ByteArray;
	import flash.utils.clearInterval;
	import flash.utils.getTimer;
	import flash.utils.setInterval;
	
	import mx.controls.Alert;
	
	/**
	 * 数据连接
	 * 负责被动模式下与FTP的连接
	 * 传输数据
	 */
	public class DataSocket extends EventDispatcher
	{
		
		/**
		 * SOCKET连接
		 */
		private var socket:Socket = null;
		
		/**
		 * 回调函数
		 */
		private var responseCall:Function = null;
		
		/**
		 * 所接收到的数据
		 */
		private var bytes:ByteArray = new ByteArray();
		
		
		private var validateFileLength:Boolean = false;
		
		public function DataSocket()
		{
			socket = new Socket();
			socket.addEventListener(IOErrorEvent.IO_ERROR, close);
			socket.addEventListener(Event.CLOSE, close);
			socket.addEventListener(ProgressEvent.SOCKET_DATA, response);
		}
		
		public function setUserData(validateFileLength:Boolean,responseCall:Function):void{
			this.validateFileLength = validateFileLength;
			this.responseCall = responseCall;
		}
		
		/**
		 * 连接服务器
		 * @param config
		 * Config Infomation of host,port,user and pass
		 * @see com.elfish.ftp.model.Config
		 */
		public function connect(config:Config):void
		{
			//			Security.loadPolicyFile("xmlsocket://localhost:21");
			socket.connect(config.ip, int(config.port));
		}
		
		/**
		 * 关闭连接
		 * 监听连接失败
		 */
		public function close(event:* = null):void
		{
			if(event is IOErrorEvent) {
				if(Console.target)
					Console.console("连接失败!"+socket.readMultiByte(socket.bytesAvailable, "utf8"));
			}else{
				this.dispatchEvent(new FTPEvent("close"));
				socket.close();
			}
		}
		
		/**
		 * 向FTP写入数据
		 * @param byte
		 * ByteArray Data
		 */
		public function write(byte:ByteArray):void
		{
			trace(getTimer()+" Start sending data! ("+socket.connected+")");
			startTime = getTimer();
			sourceFile = byte;
			interval = setInterval(sendData, 0);
			
			
			//			try{
			//				socket.writeBytes(byte,0,byte.bytesAvailable);
			//				socket.flush();
			//			}catch(e:Error){
			//				trace(e.message);
			//			}
			
			//			var tag:Boolean=true; 
			//			var offset:uint=0;     //每次从ByteArray中的什么位置开始读取数据入缓冲区 
			//			var length:uint=4096;  //每次读入缓冲区的字节长度 
			//			var sended:uint=0;     //已发送的ByteArray的长度 
			//			while(tag){ 
			//				if((sended+length)>byte.length){   //判断最后一个包是否还够8K 
			//					tag=false; 
			//					length=byte.length-sended; 
			//				} 
			//				socket.writeBytes(byte,offset,length);  
			//				socket.flush(); 
			//				offset+=4096; 
			//				sended=sended+length; 
			//			} 
		}
		private var startTime:int;
		private var interval:uint;
		private var sourceFile:ByteArray;
		private var bufferSize:uint = 40960;
		private function sendData():void
		{
			
			if (sourceFile.bytesAvailable <= 0)
			{
				close();
				clearInterval(interval);
				trace(getTimer()+" SocketClose :"+socket.connected);
				return;
			}
			if (sourceFile.bytesAvailable < bufferSize)
				bufferSize = sourceFile.bytesAvailable;
			
			var ba:ByteArray = new ByteArray();
			sourceFile.readBytes(ba, 0, bufferSize);
			trace(getTimer()+" Bytes to read: "+ba.bytesAvailable+"/"+sourceFile.bytesAvailable)
			socket.writeBytes(ba, 0, ba.bytesAvailable);
			socket.flush();
		}
		
		/**
		 * 读取从数据连接缓存里获取的数据
		 * @return ByteArray
		 */
		public function read():ByteArray
		{
			return bytes;
		}
		
		/**
		 * 数据返回时,将数据写入byte
		 */
		public function response(event:*):void
		{
			var byte:ByteArray = new ByteArray();
			socket.readBytes(byte);
			bytes.writeBytes(byte);
			
			if(Console.target)
			{
				Console.console("返回数据: "+bytes.toString());
			}
			if(validateFileLength)
			{
				var rsp:Response = new Response(998,"验证上传后的文件列表");
				rsp.code = 998;
				responseCall.call(null, rsp);
			}
			
		}
		
	}
}