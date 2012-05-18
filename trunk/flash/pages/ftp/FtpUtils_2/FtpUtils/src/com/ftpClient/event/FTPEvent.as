package com.ftpClient.event
{
	
	import flash.events.Event;
	
	/**
	 * FTP客户端中的通用事件
	 */
	public class FTPEvent extends Event
	{
		
		/**
		 * 事件回复
		 */
		public static var FTP_RESPONSE:String = "ftp_response";
		/**
		 * 流程结束
		 */
		public static var FTP_WORLFINISH:String = "ftp_workfinish";
		
		private var _param:*;
		
		public function FTPEvent(name:String, param:*=null)
		{
			super(name, true);
			this._param = param;	
		}
		
		/**
		 * 设置事件所带参数
		 */
		public function set param(param:*):void
		{
			this._param = param;
		}
		
		/**
		 * 获取事件所带参数
		 */
		public function get param():*
		{
			return this._param;
		}

	}
}