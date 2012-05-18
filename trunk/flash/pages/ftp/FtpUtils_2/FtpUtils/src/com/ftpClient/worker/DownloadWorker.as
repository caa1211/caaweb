package com.ftpClient.worker
{
	import com.ftpClient.event.FTPEvent;
	import com.ftpClient.model.Command;
	import com.ftpClient.model.Config;
	import com.ftpClient.model.ControlSocket;
	import com.ftpClient.model.DataSocket;
	import com.ftpClient.model.Response;
	import com.ftpClient.status.CommandsStatus;
	import com.ftpClient.status.ResponseStatus;
	
	import flash.events.EventDispatcher;
	import flash.utils.ByteArray;
	
	import mx.controls.Alert;
	
	public class DownloadWorker extends EventDispatcher implements IWorker
	{
		
		private var list:Array;
		private var target:String;
		private var control:ControlSocket;
		private var data:DataSocket;
		
		public function DownloadWorker(control:ControlSocket, target:String)
		{
			this.control = control;
			this.target = target;
			
			list = new Array();
			list.push(new Command(CommandsStatus.PASV));
			list.push(new Command(CommandsStatus.RETR, target));
			
			list = list.reverse();
			
			this.control.responseCall = response;
		}
		
		public function set commandList(list:Array):void
		{
			this.list = list;
		}
		
		public function get commandList():Array
		{
			return this.list;
		}
		
		public function executeCommand():void
		{
			if(list.length > 0) {
				control.send(list[list.length-1] as Command);
				list.pop();
			}
		}
		
		public function response(rsp:Response):void
		{
			if(rsp.code == ResponseStatus.PASV.SUCCESS)
			{
				data = new DataSocket();
				data.connect(rsp.data as Config);
				executeCommand();
			}
			else if(rsp.code == ResponseStatus.RETR.END) 
			{
				data.addEventListener("close", close);
				
			}
			function close(event:* = null):void
			{
				var bytes:ByteArray = data.read();
				
				rsp.data = bytes;
				var event:FTPEvent = new FTPEvent(FTPEvent.FTP_WORLFINISH, rsp);
				dispatchEvent(event);
			}
		}
	}
}