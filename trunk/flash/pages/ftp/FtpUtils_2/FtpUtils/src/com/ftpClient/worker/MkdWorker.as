package com.ftpClient.worker
{
	import com.ftpClient.event.FTPEvent;
	import com.ftpClient.model.Command;
	import com.ftpClient.model.ControlSocket;
	import com.ftpClient.model.Response;
	import com.ftpClient.status.CommandsStatus;
	import com.ftpClient.status.ResponseStatus;
	
	import flash.events.EventDispatcher;
	
	[Event(name="ftp_workfinish", type="com.ftpClient.event.FTPEvent")]
	
	public class MkdWorker extends EventDispatcher implements IWorker
	{
		
		private var list:Array;
		private var name:String;
		private var control:ControlSocket;
		
		public function MkdWorker(control:ControlSocket, name:String)
		{
			this.control = control;
			this.name = name;
			
			list = new Array();
			
			var names:Array = name.split(",");
			for(var i:int=0;i<names.length;i++)
				list.push(new Command(CommandsStatus.MKD, names[i]));
			
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
			if(list.length == 0) {
				var event:FTPEvent = new FTPEvent(FTPEvent.FTP_WORLFINISH, rsp);
				dispatchEvent(event);
			}
			else
				executeCommand();
		}
	}
}