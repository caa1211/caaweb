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
	
	[Event(name="ftp_workfinish", type="com.ftpClient.event.FTPEvent")]
	
	public class UploadWorker extends EventDispatcher implements IWorker
	{
		
		private var list:Array;
		private var name:String;
		private var fileData:*;
		private var control:ControlSocket;
		private var data:DataSocket;
		
		public function UploadWorker(control:ControlSocket, name:String, fileData:*)
		{
			this.control = control;
			this.name = name;
			this.fileData = fileData;
			
			list = new Array();
			list.push(new Command(CommandsStatus.PASV));
			list.push(new Command(CommandsStatus.STOR, name));
			
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
			if(rsp.code == ResponseStatus.PASV.SUCCESS) {
				data = new DataSocket();
				data.connect(rsp.data as Config);
				executeCommand();
			}
			else if(rsp.code == ResponseStatus.STOR.START || rsp.code == 150) {
				data.write(fileData);
			}
			else if(rsp.code == ResponseStatus.STOR.END) {
				rsp.code = 999;
				var event:FTPEvent = new FTPEvent(FTPEvent.FTP_WORLFINISH, rsp);
				dispatchEvent(event);
			}
		}
		
	}
}