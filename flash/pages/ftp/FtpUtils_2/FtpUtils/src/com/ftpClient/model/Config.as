package com.ftpClient.model
{
	/**
	 * 配置
	 * 包含地址,端口,用户名和密码等信息
	 */
	public class Config
	{
		private var _ip:String;
		private var _port:String;
		private var _user:String;
		private var _pass:String;
		
		public function Config(_ip:String='', _port:String='', _user:String='', _pass:String='')
		{
			this._ip = _ip;
			this._port = _port;
			this._user = _user;
			this._pass = _pass;
		}
		
		public function get ip():String {
			return this._ip;
		}
		
		public function get port():String {
			return this._port;
		}
		
		public function get user():String {
			return this._user;
		}
		
		public function get pass():String {
			return this._pass;
		}
	}
}