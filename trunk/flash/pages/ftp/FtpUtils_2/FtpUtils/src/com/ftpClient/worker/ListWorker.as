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
	
	[Event(name="ftp_workfinish", type="com.ftpClient.event.FTPEvent")]

	public class ListWorker extends EventDispatcher implements IWorker
	{
		
		private var list:Array;
		private var path:String;
		private var control:ControlSocket;
		private var data:DataSocket;
		
		public function ListWorker(control:ControlSocket, path:String)
		{
			this.control = control;
			this.path = path;
			
			list = new Array();
			
			list.push(new Command(CommandsStatus.PWD));
			list.push(new Command(CommandsStatus.CWD));
				
			list.push(new Command(CommandsStatus.PASV));
			list.push(new Command(CommandsStatus.LIST, "-al"));
			
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
			if(rsp.code == ResponseStatus.PWD.SUCCESS) {
				if(path != "")
				{
					Command(list[list.length-1]).args = rsp.data + "/" + path;
				}
					
				else
				{
					try
					{
						Command(list[list.length-1]).args = rsp.data;
					}
					catch(e:Error)
					{
						return;
					}
					
				}
				
				executeCommand();
			}
			else if(rsp.code == ResponseStatus.CWD.SUCCESS)
				executeCommand();
			else if(rsp.code == ResponseStatus.PASV.SUCCESS) {
				data = new DataSocket();
				data.connect(rsp.data as Config);
				executeCommand();
			}
			else if(rsp.code == ResponseStatus.LIST.END) 
			{
				var bytes:ByteArray = data.read();
				
				rsp.data = bytes;
				var event:FTPEvent = new FTPEvent(FTPEvent.FTP_WORLFINISH, rsp);
				dispatchEvent(event);
			}
			
		}
	}
}