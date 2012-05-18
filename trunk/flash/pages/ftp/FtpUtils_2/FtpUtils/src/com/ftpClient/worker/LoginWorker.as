package com.ftpClient.worker
{
	import com.ftpClient.event.FTPEvent;
	import com.ftpClient.model.Command;
	import com.ftpClient.model.Config;
	import com.ftpClient.model.ControlSocket;
	import com.ftpClient.model.Response;
	import com.ftpClient.status.CommandsStatus;
	import com.ftpClient.status.ResponseStatus;
	
	import flash.events.EventDispatcher;
	
	import mx.controls.Alert;
	
	[Event(name="ftp_workfinish", type="com.ftpClient.event.FTPEvent")]
	
	public class LoginWorker extends EventDispatcher implements IWorker
	{
		
		private var list:Array;
		private var config:Config;
		private var control:ControlSocket;
		
		public function LoginWorker(control:ControlSocket, config:Config)
		{
			this.control = control;
			this.config = config;
			
			list = new Array();
			list.push(new Command(CommandsStatus.USER, config.user));
			list.push(new Command(CommandsStatus.PASS, config.pass));
			
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
			if(rsp.code == ResponseStatus.LOGIN.NEED_PASS) {
				executeCommand();
			}else if(rsp.code == ResponseStatus.LOGIN.SUCCESS) {
				var event:FTPEvent = new FTPEvent(FTPEvent.FTP_WORLFINISH, rsp);
				dispatchEvent(event);
			}
		}
	}
}