/*
Navicat MySQL Data Transfer

Source Server         : NOC
Source Server Version : 50512
Source Host           : localhost:3306
Source Database       : vsp

Target Server Type    : MYSQL
Target Server Version : 50512
File Encoding         : 65001

Date: 2013-02-01 18:23:10
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `application`
-- ----------------------------
DROP TABLE IF EXISTS `application`;
CREATE TABLE `application` (
  `application_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `company_id` bigint(20) DEFAULT NULL,
  `hqGroupID` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `application_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of application
-- ----------------------------

-- ----------------------------
-- Table structure for `company`
-- ----------------------------
DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `company_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `phone` varchar(128) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(128) COLLATE utf8_bin DEFAULT NULL,
  `address` varchar(128) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of company
-- ----------------------------
INSERT INTO `company` VALUES ('1', 'ITRI', null, null, null);
INSERT INTO `company` VALUES ('2', '?????', '125', '1@a.2', 'aa');
INSERT INTO `company` VALUES ('3', '??234324', null, null, null);
INSERT INTO `company` VALUES ('4', '??2', null, null, null);
INSERT INTO `company` VALUES ('5', 'ITRI2', 'sdafasf', 'asdfs@dasf.asd', '3324');
INSERT INTO `company` VALUES ('6', '??', '1231', '1231', '123');
INSERT INTO `company` VALUES ('7', '??', null, null, null);
INSERT INTO `company` VALUES ('8', '中文', null, null, null);

-- ----------------------------
-- Table structure for `dashboard`
-- ----------------------------
DROP TABLE IF EXISTS `dashboard`;
CREATE TABLE `dashboard` (
  `dashboard_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `setting` text COLLATE utf8_bin,
  `application_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`dashboard_id`),
  KEY `application_id` (`application_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `dashboard_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `application` (`application_id`) ON DELETE CASCADE,
  CONSTRAINT `dashboard_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of dashboard
-- ----------------------------

-- ----------------------------
-- Table structure for `hqserver`
-- ----------------------------
DROP TABLE IF EXISTS `hqserver`;
CREATE TABLE `hqserver` (
  `hq_id` bigint(20) NOT NULL DEFAULT '0',
  `company_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `ip` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`hq_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `hqserver_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of hqserver
-- ----------------------------

-- ----------------------------
-- Table structure for `session`
-- ----------------------------
DROP TABLE IF EXISTS `session`;
CREATE TABLE `session` (
  `session_key` bigint(20) NOT NULL DEFAULT '0',
  `login_time` datetime DEFAULT NULL,
  `last_active_time` datetime DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`session_key`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of session
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  `password` varchar(255) COLLATE utf8_bin NOT NULL,
  `secret_key` varchar(128) COLLATE utf8_bin NOT NULL,
  `access_key` varchar(128) COLLATE utf8_bin NOT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'admin', '1234', '', '', null);

-- ----------------------------
-- Table structure for `user2company`
-- ----------------------------
DROP TABLE IF EXISTS `user2company`;
CREATE TABLE `user2company` (
  `user2company_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `company_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`user2company_id`),
  KEY `user_id` (`user_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `user2company_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `user2company_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of user2company
-- ----------------------------
INSERT INTO `user2company` VALUES ('1', '1', '1');
INSERT INTO `user2company` VALUES ('2', '1', '3');
