package com.ftpClient.model
{
	import mx.collections.ArrayCollection;

	public class FTPFile
	{
		public var _name:String;
		public var _path:String;
		public var _size:int;
		public var _date:Date;
		public var _isDir:Boolean;
		public function FTPFile (name:String="",
								 path:String="", 
								 size:int=0,
								 date:Date=null,
								 isDir:Boolean=false)
		{
			_name = name;
			_path = path;
			_size = size;
			_date = date;
			_isDir = isDir;
		}
		
		public function get fullPath ():String
		{
			return path+"/"+name;
		}
		
		public function get name ():String
		{
			return _name;
		}
		
		public function get path ():String
		{
			return _path;
		}
		
		public function get size ():int
		{
			return _size;
		}
		
		public function get date ():Date
		{
			return _date;
		}
		public function get isDir ():Boolean
		{
			return _isDir;
		}
		
		/**
		 *获取文件内容信息 
		 */
		public static function  getFtpFile(entry:String, dir:String):FTPFile
		{
			var file:FTPFile = new FTPFile();
			var fields:Array = entry.split(/ +/g);
			var isDir:Boolean = (fields[0].charAt(0) as String).toLowerCase() == "d";
			var name:String = fields[8];
			var path:String = dir;
			var size:int = parseInt(fields[4]);
			var date:Date = new Date(); //FIXME: Parse date from string!
			return new FTPFile(name, path, size, date, isDir);
		}
		
	}
}