package com.ftpClient.status
{
	//ftp返回代码表
	
	
//110  新文件指示器上的重启标记
//	120 服务器准备就绪的时间（分钟数）
//	125 打开数据连接，开始传输
//	150 打开连接
//	200 成功
//	202 命令没有执行
//	211 系统状态回复
//	212 目录状态回复
//	213 文件状态回复
//	214 帮助信息回复
//	215 系统类型回复
//	220 服务就绪
//	221 退出网络
//	225 打开数据连接
//	226 结束数据连接
//	227 进入被动模式（IP 地址、ID 端口）
//	230 登录因特网
//	250 文件行为完成
//	257 路径名建立
//	331 要求密码
//	332 要求帐号
//	350 文件行为暂停
//	421 服务关闭
//	425 无法打开数据连接
//	426 结束连接
//	450 文件不可用
//	451 遇到本地错误
//	452 磁盘空间不足
//	500 无效命令
//	501 错误参数
//	502 命令没有执行
//	503 错误指令序列
//	504 无效命令参数
//	530 未登录网络
//	532 存储文件需要帐号
//	550 文件不可用
//	551 不知道的页类型
//	552 超过存储分配
//	553 文件名不允许 
	
	/**
	 * 状态码对照表
	 */
	public class ResponseStatus
	{
		
		/**
		 * 连接
		 */
		public static const CONNECTION:Object = {
			SUCCESS:220
		};
		
		/**
		 * 登录流程
		 */
		public static const LOGIN:Object = {
			NEED_PASS:331,
			SUCCESS:230
		};
		
		/**
		 * 当前目录
		 */
		public static const PWD:Object = {
			SUCCESS:257
		};
		
		/**
		 * 列表流程
		 */
		public static const LIST:Object = {
			START:125,
			END:226
		};
		
		/**
		 * 设置目录
		 */
		public static const CWD:Object = {
			SUCCESS:250,
			ERROR:550
		};
		
		/**
		 * 创建目录
		 */
		public static const MKD:Object = {
			SUCCESS:257
		};
		
		/**
		 * 被动模式
		 */
		public static const PASV:Object = {
			SUCCESS:227
		};
		
		/**
		 * 下载
		 */
		public static const RETR:Object = {
			START:125,
			END:226
		};
		
		/**
		 * 上传
		 */
		public static const STOR:Object = {
			START:125,
			END:226
		}
		
		/**
		 * 删除
		 */
		public static const DELE:Object = {
			SUCCESS:250,
			ERROR:550
		}
	}
}