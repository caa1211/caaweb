package com.ftpClient.core
{
	
	import mx.controls.TextArea;
	import mx.events.FlexEvent;
	import mx.formatters.DateFormatter;
	
	/**
	 * 控制台输出类
	 * 格式化时间及流方向输出
	 * 若不给出输出容器,便不输出
	 */
	public class Console
	{
		
		/**
		 * 输出容器
		 */
		public static var target:TextArea;
		
		/**
		 * 输出内容
		 * @param pf
		 * String Something to put and format it before
		 * @param isPost
		 * Boolean Server or client
		 */
		public static function console(pf:String, isPost:Boolean = false):void
		{
			if(target) {
				if(isPost) {
					target.htmlText += formatDate() + " <font>&lt;&lt; " + pf.replace("\r\n", "") + "</font>\n";
				}else {
					target.htmlText += formatDate() + " <font>&gt;&gt; " + pf.replace("\r\n", "") + "</font>\n";
				}
			}
		}
		
		/**
		 * 格式化时间
		 */
		public static function formatDate():String
		{
			var df:DateFormatter = new DateFormatter();
			df.formatString = "JJ:NN:SS";
			return df.format(new Date());
		}
		
		/**
		 * 设置输出容器
		 * 监听内容事件,完成滚动条始终在底部
		 * @param t
		 * TextArea Container
		 * @see mx.controls.TextArea
		 */
		public static function setTarget(t:TextArea):void
		{
			target = t;
			target.addEventListener(FlexEvent.VALUE_COMMIT, onValueCommit);
		}
		
		/**
		 * 监听输出容器事件
		 */
		private static function onValueCommit(event:FlexEvent):void
		{
			target.verticalScrollPosition = target.maxVerticalScrollPosition;
			target.validateNow();
		}

	}
}