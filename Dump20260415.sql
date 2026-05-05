-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: repa_ab_1
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `type` varchar(20) NOT NULL,
  `script` varchar(1000) NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','<< Flyway Baseline >>','BASELINE','<< Flyway Baseline >>',NULL,'root','2026-03-10 12:26:04',0,1),(2,'2','add user columns','SQL','V2__add_user_columns.sql',1566754113,'root','2026-03-10 12:27:11',17,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homework_files`
--

DROP TABLE IF EXISTS `homework_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homework_files` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `file_size_kb` int DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `is_answer` bit(1) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `stored_path` varchar(255) NOT NULL,
  `homework_id` bigint NOT NULL,
  `uploaded_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcbw8wjm3vv028ex4neltot8ta` (`homework_id`),
  KEY `FKqwgxyuf7mbaw5vqlhcefsasvi` (`uploaded_by`),
  CONSTRAINT `FKcbw8wjm3vv028ex4neltot8ta` FOREIGN KEY (`homework_id`) REFERENCES `homeworks` (`id`),
  CONSTRAINT `FKqwgxyuf7mbaw5vqlhcefsasvi` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homework_files`
--

LOCK TABLES `homework_files` WRITE;
/*!40000 ALTER TABLE `homework_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `homework_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homeworks`
--

DROP TABLE IF EXISTS `homeworks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homeworks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `checked_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text,
  `due_date` date DEFAULT NULL,
  `grade` tinyint DEFAULT NULL,
  `status` enum('assigned','submitted','checked','overdue') NOT NULL,
  `student_answer` text,
  `submitted_at` datetime(6) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `tutor_comment` text,
  `updated_at` datetime(6) NOT NULL,
  `lesson_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  `tutor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_hw_student` (`student_id`,`due_date`),
  KEY `idx_hw_status` (`status`),
  KEY `FKkt5ecyq4ovj1qrnvh3pow2aoc` (`lesson_id`),
  KEY `FKbj6elqv9riydq34lxjprt1fyc` (`tutor_id`),
  CONSTRAINT `FKbj6elqv9riydq34lxjprt1fyc` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKkt5ecyq4ovj1qrnvh3pow2aoc` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`),
  CONSTRAINT `FKptjlhwoyl8n3nu6phwmgiybyb` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homeworks`
--

LOCK TABLES `homeworks` WRITE;
/*!40000 ALTER TABLE `homeworks` DISABLE KEYS */;
/*!40000 ALTER TABLE `homeworks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `duration_min` int NOT NULL,
  `format` enum('online','offline') NOT NULL,
  `is_paid` bit(1) NOT NULL,
  `lesson_date` datetime(6) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `notes` text,
  `online_link` varchar(255) DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('upcoming','completed','cancelled','no_show') NOT NULL,
  `subject` varchar(255) NOT NULL,
  `topic` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `student_id` bigint NOT NULL,
  `tutor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_student_date` (`student_id`,`lesson_date`),
  KEY `idx_tutor_date` (`tutor_id`,`lesson_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `FK843n4rnjdhi154ra8472wg8ho` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKodhdyw4gpuw2urygs7mjuygr0` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` longtext,
  `created_at` datetime(6) NOT NULL,
  `description` text,
  `external_url` varchar(255) DEFAULT NULL,
  `file_size_kb` int DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `is_visible` bit(1) NOT NULL,
  `material_type` enum('file','link','text') NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `stored_path` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `lesson_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  `tutor_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_mat_student` (`student_id`),
  KEY `idx_mat_tutor` (`tutor_id`),
  KEY `idx_mat_subject` (`subject`),
  KEY `FK24ruqpibfurlhb345nmqh08n` (`lesson_id`),
  CONSTRAINT `FK24ruqpibfurlhb345nmqh08n` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`),
  CONSTRAINT `FKlwfhw5at8x2als7tnr5uqs9yp` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKm5iy4dykq66x27p63i0dq9cbf` FOREIGN KEY (`tutor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `direction` enum('debit','credit') NOT NULL,
  `external_id` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `status` enum('pending','success','failed') NOT NULL,
  `lesson_id` bigint DEFAULT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pay_student` (`student_id`,`created_at`),
  KEY `FK2g8lk4ddut97mbwyj83ldghbe` (`lesson_id`),
  CONSTRAINT `FK2g8lk4ddut97mbwyj83ldghbe` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`),
  CONSTRAINT `FKdn7tvyxt0pb47kudo6f97jauk` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,5000.00,'2026-03-10 15:35:01.007748',NULL,'debit',NULL,NULL,'pending',NULL,1);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `avatar_path` varchar(255) DEFAULT NULL,
  `balance` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `grade` tinyint DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(100) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,_binary '',NULL,5000.00,'2026-03-10 15:35:01.007748','fisina_i@mail.ru','Фисина Илья',3,'$2a$10$OJ433nKf9LeXvHf/OSrQGePxd.9jB1yo7NlbB/CIoccPwfsSYu4kS','+7 960 511-27-22','Студент','2026-03-10 15:35:01.007748'),(2,_binary '',NULL,0.00,'2026-03-10 15:37:30.891583','kilas@mail.ru','Киласханова Рината Мурадовна',NULL,'$2a$10$ktnV0KSqFNo.KLCnibQequrD0HqAnzFRTPB21U1fyqAu7dW3U1Cv6','+7 960 511 27 22','Репетитор','2026-03-10 15:37:30.891583');
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

-- Dump completed on 2026-04-15 11:27:43
