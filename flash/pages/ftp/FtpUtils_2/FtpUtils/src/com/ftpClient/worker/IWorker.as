package com.ftpClient.worker
{
	import com.ftpClient.model.Response;
	
	
	/**
	 * 流程接口
	 */
	public interface IWorker
	{	
		/**
		 * 设置自定义命令列表
		 */
		function set commandList(list:Array):void;
		/**
		 * 获取自定义命令列表
		 */
		function get commandList():Array;
		/**
		 * 执行命令
		 */
		function executeCommand():void;
		/**
		 * 命令结束后自动执行
		 */
		function response(rsp:Response):void;
	}
}