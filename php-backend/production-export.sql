-- MySQL dump 10.13  Distrib 9.4.0, for macos15.4 (arm64)
--
-- Host: localhost    Database: midway_storage
-- ------------------------------------------------------
-- Server version	9.4.0
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_admin_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (1,'admin','$2y$12$h96wgJW2yKIKvZnfBFaTh.jeD8YKHKcwa2sIQ2q/h.Mm0yRIgmP7e','admin@midwaystorage.com','System Administrator','2025-10-21 04:30:50',NULL,1);
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_user_id` int DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`admin_user_id`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_log`
--

LOCK TABLES `activity_log` WRITE;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `cover_letter` text,
  `resume_path` varchar(1024) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,'Alice Applicant','alice@example.com','555-9999','Delivery Driver','I am very interested.','1761025563613-dummy_resume.txt','reviewing','2025-10-21 05:46:03');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_settings`
--

DROP TABLE IF EXISTS `business_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_settings` (
  `id` int NOT NULL DEFAULT '1',
  `business_phone` varchar(20) DEFAULT NULL,
  `business_email` varchar(100) DEFAULT NULL,
  `business_address` text,
  `business_hours` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `business_settings_chk_1` CHECK ((`id` = 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_settings`
--

LOCK TABLES `business_settings` WRITE;
/*!40000 ALTER TABLE `business_settings` DISABLE KEYS */;
INSERT INTO `business_settings` VALUES (1,'(555) 123-4567','info@midwaystorage.com','123 Storage Way, Your City, ST 12345','Mon-Fri: 8am-6pm, Sat: 9am-3pm','2025-10-21 04:30:50');
/*!40000 ALTER TABLE `business_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `condition` enum('New','Used - Excellent','Used - Good','Used - Fair') NOT NULL,
  `status` enum('Available','Rented','Sold','Maintenance','Reserved') DEFAULT 'Available',
  `quantity` int DEFAULT '0',
  `serial_number` varchar(100) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,'20ft Container','New','Available',7,NULL,NULL,NULL,'2025-10-21 04:30:50','2025-11-22 07:04:14'),(3,'40ft High Cube','New','Available',5,NULL,NULL,NULL,'2025-10-21 04:30:50','2025-10-21 04:30:50'),(4,'Full-Size Trailer','Used - Excellent','Available',7,NULL,NULL,NULL,'2025-10-21 04:30:50','2025-10-21 04:30:50'),(5,'20ft Container','Used - Excellent','Rented',3,NULL,NULL,NULL,'2025-10-21 04:30:50','2025-10-21 04:30:50'),(6,'40ft Container','New','Reserved',2,NULL,NULL,NULL,'2025-10-21 04:30:50','2025-10-21 04:30:50');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_applications`
--

DROP TABLE IF EXISTS `job_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `position` enum('driver','contractor-driver','fabrication','sales','customer-service','other') NOT NULL,
  `experience` varchar(100) DEFAULT NULL,
  `message` text,
  `resume_filename` varchar(255) DEFAULT NULL,
  `resume_path` varchar(500) DEFAULT NULL,
  `status` enum('new','reviewing','interviewed','hired','rejected') DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_position` (`position`),
  KEY `idx_job_applications_status` (`status`),
  KEY `idx_job_applications_created_at` (`created_at`),
  KEY `idx_job_applications_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
INSERT INTO `job_applications` VALUES (4,'Test Applicant','test@test.com','555-1234','driver','5 years','Test message',NULL,NULL,'new','2025-11-22 02:19:34','2025-11-22 02:19:34'),(6,'John Doe','john@example.com','','driver','5 years','Test',NULL,NULL,'new','2025-11-22 06:48:54','2025-11-22 06:48:54'),(7,'Jason Marshall','falsegrandeur@gmail.com','3368300130','contractor-driver','testing!','testing!',NULL,NULL,'new','2025-11-22 06:54:57','2025-11-22 06:54:57'),(8,'Jason Marshall','falsegrandeur@gmail.com','3368300130','fabrication','testing','testing',NULL,NULL,'new','2025-11-25 01:19:46','2025-11-25 01:19:46');
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(512) NOT NULL,
  `original_name` varchar(512) DEFAULT NULL,
  `mime_type` varchar(128) DEFAULT NULL,
  `media_type` varchar(64) DEFAULT 'image',
  `alt_text` varchar(512) DEFAULT NULL,
  `uploaded_by` varchar(128) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_messages_status` (`status`),
  KEY `idx_messages_createdAt` (`createdAt`),
  KEY `idx_messages_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (3,'Test','test@example.com','Test','Test','2025-11-21 20:51:11','new'),(5,'Jason Marshall','falsegrandeur@gmail.com','testing!','testing!','2025-11-22 01:26:31','new');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `panelseal_orders`
--

DROP TABLE IF EXISTS `panelseal_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `panelseal_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `product` varchar(100) NOT NULL,
  `quantity` int NOT NULL,
  `shipping_address` text NOT NULL,
  `status` enum('processing','shipped','delivered','cancelled') DEFAULT 'processing',
  `tracking_number` varchar(100) DEFAULT NULL,
  `order_total` decimal(10,2) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_customer_email` (`customer_email`),
  KEY `idx_panelseal_orders_status` (`status`),
  KEY `idx_panelseal_orders_created_at` (`created_at`),
  KEY `idx_panelseal_orders_customer_email` (`customer_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `panelseal_orders`
--

LOCK TABLES `panelseal_orders` WRITE;
/*!40000 ALTER TABLE `panelseal_orders` DISABLE KEYS */;
INSERT INTO `panelseal_orders` VALUES (4,'Jason Marshall','falsegrandeur@gmail.com','3368300130','PanelSeal',25,'11952 Old Us Highway 52','processing',NULL,NULL,'testing!','2025-11-22 06:26:15','2025-11-22 06:26:15'),(5,'Jason Marshall','falsegrandeur@gmail.com','3368300130','PanelSeal',750,'11952 Old Us Highway 52','processing',NULL,NULL,'testing','2025-11-25 01:20:02','2025-11-25 01:20:02');
/*!40000 ALTER TABLE `panelseal_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote_requests`
--

DROP TABLE IF EXISTS `quote_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quote_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `service_type` enum('rental','purchase','trailer','custom') NOT NULL,
  `container_size` varchar(50) DEFAULT NULL,
  `quantity` varchar(10) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `delivery_address` text NOT NULL,
  `message` text,
  `status` enum('pending','responded','accepted','declined') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote_requests`
--

LOCK TABLES `quote_requests` WRITE;
/*!40000 ALTER TABLE `quote_requests` DISABLE KEYS */;
INSERT INTO `quote_requests` VALUES (1,'John Smith','john.smith@email.com','555-0101','rental','20ft','1','short-term','Lexington, NC 27292','Need for construction site storage','pending','2025-10-21 04:30:50','2025-10-21 04:30:50'),(2,'ABC Construction','contact@abcconstruction.com','555-0102','custom','40ft','2','long-term','Charlotte, NC 28202','Custom build with shelving','responded','2025-10-21 04:30:50','2025-10-21 04:30:50'),(3,'Jane Doe','jane.doe@email.com','555-0103','trailer','Full-Size','1','short-term','Greensboro, NC 27401','Moving storage needed','pending','2025-10-21 04:30:50','2025-10-21 04:30:50'),(4,'Test User','test@example.com','555-5555','rental','20ft','1','short-term','123 Main St','Testing quote','pending','2025-10-21 05:45:54','2025-10-21 05:45:54');
/*!40000 ALTER TABLE `quote_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotes`
--

DROP TABLE IF EXISTS `quotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `serviceType` varchar(255) DEFAULT NULL,
  `containerSize` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `deliveryAddress` text,
  `message` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_quotes_status` (`status`),
  KEY `idx_quotes_createdAt` (`createdAt`),
  KEY `idx_quotes_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotes`
--

LOCK TABLES `quotes` WRITE;
/*!40000 ALTER TABLE `quotes` DISABLE KEYS */;
INSERT INTO `quotes` VALUES (4,'Test User','test@example.com','555-1234','rental','20ft',2,'1 month','123 Test St','Test quote request','2025-11-21 20:49:50','new'),(6,'Jason Marshall','falsegrandeur@gmail.com','3368300130','purchase','40ft',2,'','11952 Old Us Highway 52','testing!','2025-11-22 01:25:42','new'),(7,'Jason Marshall','falsegrandeur@gmail.com','3368300130','rental','40ft',1,'long-term','11952 Old Us Highway 52','testing','2025-11-24 20:20:17','new');
/*!40000 ALTER TABLE `quotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_contracts`
--

DROP TABLE IF EXISTS `rental_contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_contracts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `inventory_id` int DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `monthly_rate` decimal(10,2) DEFAULT NULL,
  `deposit_amount` decimal(10,2) DEFAULT NULL,
  `delivery_address` text,
  `status` enum('active','completed','cancelled') DEFAULT 'active',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `inventory_id` (`inventory_id`),
  KEY `idx_status` (`status`),
  KEY `idx_customer_email` (`customer_email`),
  CONSTRAINT `rental_contracts_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_contracts`
--

LOCK TABLES `rental_contracts` WRITE;
/*!40000 ALTER TABLE `rental_contracts` DISABLE KEYS */;
/*!40000 ALTER TABLE `rental_contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `businessName` varchar(255) NOT NULL DEFAULT 'Midway Mobile Storage',
  `email` varchar(255) NOT NULL DEFAULT 'info@midwaystorage.example',
  `phone` varchar(50) NOT NULL DEFAULT '(555) 555-5555',
  `address` varchar(255) NOT NULL DEFAULT '123 Storage Ave',
  `city` varchar(100) NOT NULL DEFAULT 'Somewhere',
  `state` varchar(100) NOT NULL DEFAULT 'State',
  `zip` varchar(20) NOT NULL DEFAULT '00000',
  `country` varchar(10) NOT NULL DEFAULT 'US',
  `hours` varchar(255) NOT NULL DEFAULT 'Mon–Fri 8:00–17:00',
  `siteUrl` varchar(255) NOT NULL DEFAULT 'https://midwaymobilestorage.com',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'Midway Mobile Storage','midwaymobilestorage@gmail.com','(336) 764-4208','212 Fred Sink Road','Winston-Salem','NC','27107','US','Mon–Fri 8:00–17:00','https://midwaymobilestorage.com','2025-11-13 18:01:21','2025-11-13 23:05:52');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-25  9:47:16
