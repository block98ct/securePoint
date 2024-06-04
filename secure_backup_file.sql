-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: secure_point
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.22.04.1

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
-- Table structure for table `assetimages`
--

DROP TABLE IF EXISTS `assetimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assetimages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `images` varchar(255) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `assetId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assetimages`
--

LOCK TABLES `assetimages` WRITE;
/*!40000 ALTER TABLE `assetimages` DISABLE KEYS */;
INSERT INTO `assetimages` VALUES (1,'thor.jpg',1,1),(2,'thor.jpg',1,1),(3,'thor.jpg',1,2),(56,'1716301470146313',28,36),(57,'1716358055486521',28,37),(59,'1716372465015022',28,36),(64,'1716470328100808',21,43),(65,'1716474134029263',21,44);
/*!40000 ALTER TABLE `assetimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `AssetName` varchar(255) DEFAULT NULL,
  `AssetDetails` varchar(255) DEFAULT NULL,
  `AssetIdentifier` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `lockAndUnlock` tinyint(1) DEFAULT NULL,
  `subCategory` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `promote` varchar(255) DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hideStatus` int DEFAULT '1',
  `longitude` varchar(200) DEFAULT NULL,
  `latitude` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,'pulsar150','N2589','number plate','2',0,'3','not stolen','1 week ',1,'2024-05-15 13:06:48','2024-05-21 06:04:04',1,NULL,NULL),(2,'iphone','125','logo','1',0,'2','not stolen','2 week',1,'2024-05-16 07:08:19','2024-05-21 06:04:04',1,NULL,NULL),(36,'pppppppp','ppppp','ppppppp','1',1,'1','Stolen','0',28,'2024-05-21 14:24:31','2024-05-21 14:24:31',1,NULL,NULL),(37,'stotleeen','sdfg','sdfg','1',0,'2','Not Stolen','0',28,'2024-05-22 06:07:36','2024-05-22 06:07:36',1,NULL,NULL),(43,'sdfv','xcv ','sdcfv','1',0,'1','Not Stolen','0',21,'2024-05-23 13:18:46','2024-05-27 08:08:25',1,'80.949997','26.85'),(44,'mmmmm','mmm','mm','1',0,'1','Not Stolen','0',21,'2024-05-23 14:22:13','2024-05-27 08:09:07',1,'77.0889583','22.3466702');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(255) DEFAULT NULL,
  `categoryImage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'mobile','82438870.jpeg'),(2,'bikes','82438870.jpeg'),(3,'properties','thor.jpg');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatConversation`
--

DROP TABLE IF EXISTS `chatConversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatConversation` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `message` varchar(255) NOT NULL,
  `toUserId` int DEFAULT NULL,
  `fromUserId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatConversation`
--

LOCK TABLES `chatConversation` WRITE;
/*!40000 ALTER TABLE `chatConversation` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatConversation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatMessage`
--

DROP TABLE IF EXISTS `chatMessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatMessage` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `message` varchar(255) DEFAULT NULL,
  `fromUserId` int DEFAULT NULL,
  `toUserId` int DEFAULT NULL,
  `sender` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatMessage`
--

LOCK TABLES `chatMessage` WRITE;
/*!40000 ALTER TABLE `chatMessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatMessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritesAssets`
--

DROP TABLE IF EXISTS `favoritesAssets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritesAssets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `assetId` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritesAssets`
--

LOCK TABLES `favoritesAssets` WRITE;
/*!40000 ALTER TABLE `favoritesAssets` DISABLE KEYS */;
INSERT INTO `favoritesAssets` VALUES (2,1,9,'2024-05-20 14:35:37'),(3,21,NULL,'2024-05-24 06:55:38'),(4,21,NULL,'2024-05-24 06:55:48'),(5,21,NULL,'2024-05-24 06:56:38'),(7,21,1,'2024-05-24 07:17:34'),(8,21,1,'2024-05-24 07:17:37'),(9,21,1,'2024-05-24 07:17:50'),(10,21,1,'2024-05-24 07:17:53'),(11,21,1,'2024-05-24 07:17:55'),(12,21,1,'2024-05-24 07:19:00'),(13,21,1,'2024-05-24 07:19:06'),(14,21,36,'2024-05-24 07:46:51'),(15,21,1,'2024-05-24 13:48:25'),(16,21,1,'2024-05-24 13:49:11'),(17,21,1,'2024-05-24 13:49:13'),(18,21,1,'2024-05-24 13:49:20'),(19,21,1,'2024-05-24 13:49:26'),(20,21,1,'2024-05-24 13:50:09'),(21,21,1,'2024-05-24 13:50:20'),(22,21,1,'2024-05-24 13:50:34'),(24,21,1,'2024-05-24 13:54:14'),(25,21,1,'2024-05-24 13:54:25'),(26,21,1,'2024-05-24 13:57:18'),(27,21,1,'2024-05-24 13:58:12'),(29,21,2,'2024-05-24 13:59:02'),(30,21,37,'2024-05-24 13:59:19');
/*!40000 ALTER TABLE `favoritesAssets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `senderId` int DEFAULT NULL,
  `receiverId` int DEFAULT NULL,
  `message` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subCategories`
--

DROP TABLE IF EXISTS `subCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subCategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subCategory` varchar(255) DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subCategories`
--

LOCK TABLES `subCategories` WRITE;
/*!40000 ALTER TABLE `subCategories` DISABLE KEYS */;
INSERT INTO `subCategories` VALUES (1,'android',1),(2,'phone',1),(3,'sport',2),(4,'cruser',2),(5,'Residential',3),(6,'Commercial',3),(7,'Industrial',3);
/*!40000 ALTER TABLE `subCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `roll` varchar(255) DEFAULT 'user',
  `password` varchar(255) DEFAULT NULL,
  `isVerified` int DEFAULT '0',
  `otp` varchar(255) DEFAULT NULL,
  `lastlogin` datetime DEFAULT NULL,
  `status` int DEFAULT '1',
  `contactNumber` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `dp` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `nameStatus` int DEFAULT '0',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'pramod@yopmail.com','user','$2a$10$Oa1R4aoSal4abrFfuibQ0emQwwwVKUzjdoqSbl4eRpKTJNM0GlD/2',1,NULL,'2024-05-22 19:10:38',1,NULL,NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-22 13:40:37'),(2,'pramodsss@yopmail.com','user',NULL,0,'511288',NULL,1,NULL,NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(3,NULL,'user',NULL,0,'841173',NULL,1,'9874561238',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(4,'pramodsssdfgs@yopmail.com','user',NULL,0,'163986',NULL,1,NULL,NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(5,NULL,'user',NULL,0,'2050',NULL,1,'1234567890',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(6,NULL,'user',NULL,0,'5927',NULL,1,'0987654321',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(7,NULL,'user',NULL,1,NULL,NULL,1,'254879963',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(8,NULL,'user',NULL,1,NULL,NULL,1,'0987654322',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(9,NULL,'user',NULL,0,'3581',NULL,1,'76543234567',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(10,NULL,'user',NULL,0,'4624',NULL,1,'1234567888',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(11,NULL,'user',NULL,0,'4278',NULL,1,'123456787',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(12,NULL,'user',NULL,0,'5043',NULL,1,'123456783',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(13,NULL,'user',NULL,0,'5993',NULL,1,'123456785',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(14,NULL,'user',NULL,0,'6091',NULL,1,'1234512345',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(15,NULL,'user',NULL,0,'3448',NULL,1,'1234512344',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(16,NULL,'user',NULL,1,NULL,NULL,1,'1234567812',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(17,NULL,'user',NULL,1,NULL,NULL,1,'1234567817',NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(18,'pramod@gmakd.com','user',NULL,0,'3856',NULL,1,NULL,NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(19,'pramodas@gmail.com','user',NULL,1,NULL,NULL,1,NULL,NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(20,'pramod33@gmail.com','user',NULL,1,NULL,NULL,1,NULL,NULL,NULL,NULL,0,'2024-05-20 09:22:54','2024-05-20 09:22:54'),(21,'pramod007@gmail.com','user','$2a$10$zuySd9d2SNXqBaVYKwf/R.WJ9m8mivP3JwU5PlFnWBnXIMQXbsCBq',1,NULL,'2024-05-29 15:38:18',1,NULL,'pramod vishwakarma','1716560898337849','my name is pramod vishwakarmaycufugif8',0,'2024-05-20 09:22:54','2024-05-29 10:08:18'),(22,'pramod002@gmail.com','user','$2a$10$kbEb0ZHFRwVtVyH2fs3bPeTtnxXfi7sC8B/lSUK7UAlWP/rSYCubK',1,NULL,NULL,1,NULL,NULL,NULL,NULL,0,'2024-05-21 10:05:30','2024-05-21 10:06:43'),(23,'jjstar@gmail.com','user','$2a$10$IJPr8o9WuEKSLAzqbGlR9.1VwtSMk92et515.qCF8O7D9H4qp.7vK',1,NULL,'2024-05-21 15:38:39',1,NULL,NULL,NULL,NULL,0,'2024-05-21 10:07:58','2024-05-21 10:08:39'),(24,NULL,'user',NULL,1,NULL,NULL,1,'123456789',NULL,NULL,NULL,0,'2024-05-21 10:10:07','2024-05-21 10:10:25'),(25,'pramod@gmail.com','user',NULL,0,'9351',NULL,1,NULL,NULL,NULL,NULL,0,'2024-05-21 10:15:29','2024-05-21 10:15:29'),(26,'pramodwert@gmail.com','user','$2a$10$6WG1MxN6xQIFHyMPWmccvuA5JzdvMLarKDHwcxsEGt3G5FO8uzUjy',1,NULL,NULL,1,NULL,NULL,NULL,NULL,0,'2024-05-21 10:16:24','2024-05-21 10:16:54'),(27,NULL,'user','$2a$10$mLW40uz93dDDuaIpeEqH3uN1.iR8DvMkeT07E0WIDmiYAEPk0Ggnu',1,NULL,NULL,1,'9988776655',NULL,NULL,NULL,0,'2024-05-21 10:17:25','2024-05-21 10:17:47'),(28,'pramod008@gmail.com','user','$2a$10$ejX58/dKHWvxDPU6PTA3l.AL2zthbPD9ju0ohEWvKKJSAPbeZX/9O',1,NULL,'2024-05-21 18:58:29',1,NULL,'pramodddd','avtar.svg','bio',0,'2024-05-21 13:27:37','2024-05-21 14:58:24'),(29,'pinkeesahu1994@gmail.com','user',NULL,0,'1994',NULL,1,NULL,NULL,NULL,NULL,0,'2024-05-27 12:00:47','2024-05-27 12:00:47'),(30,NULL,'user',NULL,0,'2236',NULL,1,'8269671502',NULL,NULL,NULL,0,'2024-05-27 12:01:37','2024-05-27 12:01:37'),(31,NULL,'user','$2a$10$QAZmY/eMyqXeyElPbJfM9OU.WqcA.J5JWIiB0x/dx59AoOknC4BeS',1,NULL,NULL,1,'+919302838884',NULL,NULL,NULL,0,'2024-05-27 12:02:17','2024-05-27 12:04:47'),(32,NULL,'user',NULL,0,'4062',NULL,1,'8989444369',NULL,NULL,NULL,0,'2024-05-27 12:11:36','2024-05-27 12:11:36'),(33,NULL,'user',NULL,0,'7698',NULL,1,'5678903456',NULL,NULL,NULL,0,'2024-05-27 12:12:57','2024-05-27 12:12:57'),(34,NULL,'user','$2a$10$lAhuBu6y6h2nW.aNMBVJ0u/.FeJu2gtr3Tch/sWzoooYYvvMvQata',1,NULL,NULL,1,'9898765656',NULL,NULL,NULL,0,'2024-05-27 12:27:47','2024-05-27 12:39:40'),(35,NULL,'user',NULL,0,'4025',NULL,1,'6789912345566',NULL,NULL,NULL,0,'2024-05-27 12:53:18','2024-05-27 12:53:18'),(36,NULL,'user',NULL,0,'3564',NULL,1,'dfghh',NULL,NULL,NULL,0,'2024-05-27 13:13:23','2024-05-27 13:13:23'),(37,NULL,'user','$2a$10$mCQHhkcRRx8v/zR8vIbIiugsI2/K.26wI7RBbofMcLy13hUoLUTHm',1,NULL,'2024-05-29 15:20:39',1,'9365486648',NULL,NULL,NULL,0,'2024-05-29 06:41:05','2024-05-29 09:50:39');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-29 19:37:11
