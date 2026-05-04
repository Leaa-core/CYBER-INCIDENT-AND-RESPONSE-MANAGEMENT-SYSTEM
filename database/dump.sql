-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: darquery
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `action`
--

DROP TABLE IF EXISTS `action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `action` (
  `action_id` int NOT NULL AUTO_INCREMENT,
  `action_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`action_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action`
--

LOCK TABLES `action` WRITE;
/*!40000 ALTER TABLE `action` DISABLE KEYS */;
INSERT INTO `action` VALUES (1,'Created Incident #1'),(2,'Updated Incident #1 status'),(3,'Closed Incident #3');
/*!40000 ALTER TABLE `action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `activity_id` int NOT NULL AUTO_INCREMENT,
  `activity_name` text,
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES (1,'Incident created'),(2,'Threat contained'),(3,'Data leak confirmed');
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alert`
--

DROP TABLE IF EXISTS `alert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alert` (
  `alert_id` int NOT NULL AUTO_INCREMENT,
  `alert_type` varchar(100) DEFAULT NULL,
  `alert_time` datetime DEFAULT NULL,
  PRIMARY KEY (`alert_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alert`
--

LOCK TABLES `alert` WRITE;
/*!40000 ALTER TABLE `alert` DISABLE KEYS */;
INSERT INTO `alert` VALUES (1,'Suspicious Login','2026-02-12 10:00:00'),(2,'Malware Signature Detected','2026-02-12 10:10:00'),(3,'Unusual Data Transfer','2026-02-10 08:45:00');
/*!40000 ALTER TABLE `alert` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset`
--

DROP TABLE IF EXISTS `asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset` (
  `asset_id` int NOT NULL AUTO_INCREMENT,
  `asset_name` varchar(100) DEFAULT NULL,
  `asset_type` varchar(100) DEFAULT NULL,
  `criticality` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`asset_id`),
  CONSTRAINT `chk_criticality` CHECK ((`criticality` in (_cp850'Low',_cp850'Medium',_cp850'High',_cp850'Critical')))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset`
--

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
INSERT INTO `asset` VALUES (1,'Main Server','Server','High'),(2,'Employee Laptop 12','Endpoint','Medium'),(3,'Finance Database','Database','Critical');
/*!40000 ALTER TABLE `asset` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_asset_delete` BEFORE DELETE ON `asset` FOR EACH ROW BEGIN
    IF OLD.criticality = 'Critical' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete assets with Critical criticality';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `user_id` int NOT NULL,
  `audit_id` int NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`,`audit_id`),
  KEY `audit_id` (`audit_id`),
  CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
INSERT INTO `audit_log` VALUES (1,1,'2026-02-12 10:31:00'),(2,1,'2026-02-12 11:05:00'),(3,1,'2026-02-10 10:00:00');
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_log_action`
--

DROP TABLE IF EXISTS `audit_log_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log_action` (
  `audit_id` int NOT NULL,
  `action_id` int NOT NULL,
  PRIMARY KEY (`audit_id`,`action_id`),
  KEY `action_id` (`action_id`),
  CONSTRAINT `audit_log_action_ibfk_1` FOREIGN KEY (`audit_id`) REFERENCES `audit_log` (`audit_id`),
  CONSTRAINT `audit_log_action_ibfk_2` FOREIGN KEY (`action_id`) REFERENCES `action` (`action_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log_action`
--

LOCK TABLES `audit_log_action` WRITE;
/*!40000 ALTER TABLE `audit_log_action` DISABLE KEYS */;
INSERT INTO `audit_log_action` VALUES (1,1),(1,2),(1,3);
/*!40000 ALTER TABLE `audit_log_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_name` varchar(100) NOT NULL,
  `incident_type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('Malware','Malware Attack'),('Network','Malware Attack'),('Phishing','Phishing Attack');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_team`
--

DROP TABLE IF EXISTS `category_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_team` (
  `category_name` varchar(100) NOT NULL,
  `team_name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_name`,`team_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_team`
--

LOCK TABLES `category_team` WRITE;
/*!40000 ALTER TABLE `category_team` DISABLE KEYS */;
INSERT INTO `category_team` VALUES ('Malware','Blue Team'),('Network','Network Security Team'),('Phishing','Forensics Team');
/*!40000 ALTER TABLE `category_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident`
--

DROP TABLE IF EXISTS `incident`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident` (
  `incident_id` int NOT NULL AUTO_INCREMENT,
  `incident_type` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `reported_time` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`incident_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident`
--

LOCK TABLES `incident` WRITE;
/*!40000 ALTER TABLE `incident` DISABLE KEYS */;
INSERT INTO `incident` VALUES (1,'Malware Attack','Resolved','2026-02-12 10:30:00',NULL),(2,'Phishing Attempt','Investigating','2026-02-11 14:15:00',NULL),(3,'Data Breach','Closed','2026-02-10 09:00:00','2026-03-24 00:56:32'),(4,'Ransomware Attack','Open','2026-03-24 00:09:05',NULL);
/*!40000 ALTER TABLE `incident` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_incident_insert` AFTER INSERT ON `incident` FOR EACH ROW BEGIN
    DECLARE max_log_id INT;
    
    SELECT IFNULL(MAX(log_id), 0) + 1 INTO max_log_id
    FROM Incident_Log
    WHERE incident_id = NEW.incident_id;
    
    INSERT INTO Incident_Log (incident_id, log_id, log_time, activity)
    VALUES (NEW.incident_id, max_log_id, NOW(), 'Incident created');
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_incident_update` BEFORE UPDATE ON `incident` FOR EACH ROW BEGIN
    SET NEW.last_updated = NOW();
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `incident_2nf`
--

DROP TABLE IF EXISTS `incident_2nf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_2nf` (
  `incident_id` int NOT NULL,
  `incident_type` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `reported_time` datetime DEFAULT NULL,
  PRIMARY KEY (`incident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_2nf`
--

LOCK TABLES `incident_2nf` WRITE;
/*!40000 ALTER TABLE `incident_2nf` DISABLE KEYS */;
INSERT INTO `incident_2nf` VALUES (1,'Malware Attack','Resolved','2026-02-12 10:30:00'),(2,'Phishing Attack','Investigating','2026-02-11 14:15:00');
/*!40000 ALTER TABLE `incident_2nf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_3nf`
--

DROP TABLE IF EXISTS `incident_3nf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_3nf` (
  `incident_id` int NOT NULL,
  `type_id` int DEFAULT NULL,
  `status_id` int DEFAULT NULL,
  `reported_time` datetime DEFAULT NULL,
  PRIMARY KEY (`incident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_3nf`
--

LOCK TABLES `incident_3nf` WRITE;
/*!40000 ALTER TABLE `incident_3nf` DISABLE KEYS */;
INSERT INTO `incident_3nf` VALUES (1,1,1,'2026-02-12 10:30:00'),(2,2,2,'2026-02-11 14:15:00');
/*!40000 ALTER TABLE `incident_3nf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_4nf`
--

DROP TABLE IF EXISTS `incident_4nf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_4nf` (
  `incident_id` int NOT NULL,
  `incident_type` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `reported_time` datetime DEFAULT NULL,
  PRIMARY KEY (`incident_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_4nf`
--

LOCK TABLES `incident_4nf` WRITE;
/*!40000 ALTER TABLE `incident_4nf` DISABLE KEYS */;
INSERT INTO `incident_4nf` VALUES (1,'Malware Attack','Resolved','2026-02-12 10:30:00'),(2,'Phishing Attack','Investigating','2026-02-11 14:15:00');
/*!40000 ALTER TABLE `incident_4nf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_category`
--

DROP TABLE IF EXISTS `incident_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_category`
--

LOCK TABLES `incident_category` WRITE;
/*!40000 ALTER TABLE `incident_category` DISABLE KEYS */;
INSERT INTO `incident_category` VALUES (1,'Cybersecurity'),(2,'Insider Threat'),(3,'System Failure');
/*!40000 ALTER TABLE `incident_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_category_2nf`
--

DROP TABLE IF EXISTS `incident_category_2nf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_category_2nf` (
  `incident_id` int NOT NULL,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`incident_id`,`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_category_2nf`
--

LOCK TABLES `incident_category_2nf` WRITE;
/*!40000 ALTER TABLE `incident_category_2nf` DISABLE KEYS */;
INSERT INTO `incident_category_2nf` VALUES (1,'Malware'),(1,'Network'),(2,'Phishing');
/*!40000 ALTER TABLE `incident_category_2nf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_category_4nf`
--

DROP TABLE IF EXISTS `incident_category_4nf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_category_4nf` (
  `incident_id` int NOT NULL,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`incident_id`,`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_category_4nf`
--

LOCK TABLES `incident_category_4nf` WRITE;
/*!40000 ALTER TABLE `incident_category_4nf` DISABLE KEYS */;
INSERT INTO `incident_category_4nf` VALUES (1,'Malware'),(1,'Network'),(2,'Phishing');
/*!40000 ALTER TABLE `incident_category_4nf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_category_5nf`
--

DROP TABLE IF EXISTS `incident_category_5nf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_category_5nf` (
  `incident_id` int NOT NULL,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`incident_id`,`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_category_5nf`
--

LOCK TABLES `incident_category_5nf` WRITE;
/*!40000 ALTER TABLE `incident_category_5nf` DISABLE KEYS */;
INSERT INTO `incident_category_5nf` VALUES (1,'Malware'),(1,'Network'),(2,'Phishing');
/*!40000 ALTER TABLE `incident_category_5nf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_category_bcnf`
--

DROP TABLE IF EXISTS `incident_category_bcnf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_category_bcnf` (
  `incident_id` int NOT NULL,
  `category_name` varchar(100) NOT NULL,
  PRIMARY KEY (`incident_id`,`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_category_bcnf`
--

LOCK TABLES `incident_category_bcnf` WRITE;
/*!40000 ALTER TABLE `incident_category_bcnf` DISABLE KEYS */;
INSERT INTO `incident_category_bcnf` VALUES (1,'Malware'),(1,'Network'),(2,'Phishing');
/*!40000 ALTER TABLE `incident_category_bcnf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `incident_count_by_status`
--

DROP TABLE IF EXISTS `incident_count_by_status`;
/*!50001 DROP VIEW IF EXISTS `incident_count_by_status`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `incident_count_by_status` AS SELECT 
 1 AS `status`,
 1 AS `incident_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `incident_details`
--

DROP TABLE IF EXISTS `incident_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_details` (
  `incident_id` int NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `incident_type` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `reported_time` datetime DEFAULT NULL,
  PRIMARY KEY (`incident_id`,`category_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_details`
--

LOCK TABLES `incident_details` WRITE;
/*!40000 ALTER TABLE `incident_details` DISABLE KEYS */;
INSERT INTO `incident_details` VALUES (1,'Malware','Malware Attack','Resolved','2026-02-12 10:30:00'),(1,'Network','Malware Attack','Resolved','2026-02-12 10:30:00'),(2,'Phishing','Phishing Attack','Investigating','2026-02-11 14:15:00');
/*!40000 ALTER TABLE `incident_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_log`
--

DROP TABLE IF EXISTS `incident_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_log` (
  `incident_id` int NOT NULL,
  `log_id` int NOT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`incident_id`,`log_id`),
  CONSTRAINT `incident_log_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incident` (`incident_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_log`
--

LOCK TABLES `incident_log` WRITE;
/*!40000 ALTER TABLE `incident_log` DISABLE KEYS */;
INSERT INTO `incident_log` VALUES (1,1,'2026-02-12 10:35:00'),(1,2,'2026-02-12 11:10:00'),(3,1,'2026-02-10 09:30:00');
/*!40000 ALTER TABLE `incident_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_log_activity`
--

DROP TABLE IF EXISTS `incident_log_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_log_activity` (
  `log_id` int NOT NULL,
  `activity_id` int NOT NULL,
  PRIMARY KEY (`log_id`,`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_log_activity`
--

LOCK TABLES `incident_log_activity` WRITE;
/*!40000 ALTER TABLE `incident_log_activity` DISABLE KEYS */;
INSERT INTO `incident_log_activity` VALUES (1,1),(1,3),(2,2);
/*!40000 ALTER TABLE `incident_log_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_status`
--

DROP TABLE IF EXISTS `incident_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_status` (
  `status_id` int NOT NULL AUTO_INCREMENT,
  `status_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_status`
--

LOCK TABLES `incident_status` WRITE;
/*!40000 ALTER TABLE `incident_status` DISABLE KEYS */;
INSERT INTO `incident_status` VALUES (1,'Resolved'),(2,'Investigating');
/*!40000 ALTER TABLE `incident_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_team`
--

DROP TABLE IF EXISTS `incident_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_team` (
  `incident_id` int NOT NULL,
  `team_name` varchar(100) NOT NULL,
  PRIMARY KEY (`incident_id`,`team_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_team`
--

LOCK TABLES `incident_team` WRITE;
/*!40000 ALTER TABLE `incident_team` DISABLE KEYS */;
INSERT INTO `incident_team` VALUES (1,'Blue Team'),(1,'Network Security Team'),(2,'Forensics Team');
/*!40000 ALTER TABLE `incident_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incident_type`
--

DROP TABLE IF EXISTS `incident_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incident_type` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incident_type`
--

LOCK TABLES `incident_type` WRITE;
/*!40000 ALTER TABLE `incident_type` DISABLE KEYS */;
INSERT INTO `incident_type` VALUES (1,'Malware Attack'),(2,'Phishing Attack');
/*!40000 ALTER TABLE `incident_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `incident_with_latest_action`
--

DROP TABLE IF EXISTS `incident_with_latest_action`;
/*!50001 DROP VIEW IF EXISTS `incident_with_latest_action`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `incident_with_latest_action` AS SELECT 
 1 AS `incident_id`,
 1 AS `incident_type`,
 1 AS `status`,
 1 AS `action_description`,
 1 AS `action_time`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `location_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Data Center A'),(2,'Head Office'),(3,'Remote Branch');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `response_action`
--

DROP TABLE IF EXISTS `response_action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `response_action` (
  `incident_id` int NOT NULL,
  `action_id` int NOT NULL,
  `action_description` text,
  `action_time` datetime DEFAULT NULL,
  PRIMARY KEY (`incident_id`,`action_id`),
  CONSTRAINT `response_action_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incident` (`incident_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `response_action`
--

LOCK TABLES `response_action` WRITE;
/*!40000 ALTER TABLE `response_action` DISABLE KEYS */;
INSERT INTO `response_action` VALUES (1,1,'Isolated infected server','2026-02-12 10:45:00'),(1,2,'Ran malware scan','2026-02-12 11:00:00'),(2,1,'Blocked phishing domain','2026-02-11 14:30:00');
/*!40000 ALTER TABLE `response_action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `response_team`
--

DROP TABLE IF EXISTS `response_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `response_team` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `team_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `response_team`
--

LOCK TABLES `response_team` WRITE;
/*!40000 ALTER TABLE `response_team` DISABLE KEYS */;
INSERT INTO `response_team` VALUES (1,'Blue Team'),(2,'Forensics Team'),(3,'Network Security Team');
/*!40000 ALTER TABLE `response_team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Administrator'),(2,'Security Analyst'),(3,'Incident Manager');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `severity_level`
--

DROP TABLE IF EXISTS `severity_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `severity_level` (
  `severity_id` int NOT NULL AUTO_INCREMENT,
  `severity_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`severity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `severity_level`
--

LOCK TABLES `severity_level` WRITE;
/*!40000 ALTER TABLE `severity_level` DISABLE KEYS */;
INSERT INTO `severity_level` VALUES (1,'Low'),(2,'Medium'),(3,'High');
/*!40000 ALTER TABLE `severity_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_role`
--

DROP TABLE IF EXISTS `team_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_role` (
  `team_name` varchar(100) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  PRIMARY KEY (`team_name`,`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_role`
--

LOCK TABLES `team_role` WRITE;
/*!40000 ALTER TABLE `team_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `unique_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin_01','admin@darquery.com'),(2,'analyst_01','analyst@darquery.com'),(3,'manager_01','manager@darquery.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `incident_count_by_status`
--

/*!50001 DROP VIEW IF EXISTS `incident_count_by_status`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `incident_count_by_status` AS select `incident`.`status` AS `status`,count(0) AS `incident_count` from `incident` group by `incident`.`status` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `incident_with_latest_action`
--

/*!50001 DROP VIEW IF EXISTS `incident_with_latest_action`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `incident_with_latest_action` AS select `i`.`incident_id` AS `incident_id`,`i`.`incident_type` AS `incident_type`,`i`.`status` AS `status`,`ra`.`action_description` AS `action_description`,`ra`.`action_time` AS `action_time` from (`incident` `i` left join `response_action` `ra` on((`i`.`incident_id` = `ra`.`incident_id`))) where (`ra`.`action_time` = (select max(`ra2`.`action_time`) from `response_action` `ra2` where (`ra2`.`incident_id` = `i`.`incident_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-04 20:55:36
