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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homework_files`
--

LOCK TABLES `homework_files` WRITE;
/*!40000 ALTER TABLE `homework_files` DISABLE KEYS */;
INSERT INTO `homework_files` VALUES (1,'2026-04-20 18:36:20.088810',4970,'application/pdf',_binary '','Рейтинг-контроль №2 Оцифровка карты.pdf','homework\\71ea4a07-15a1-42f8-8453-836b066eec90.pdf',1,1),(2,'2026-04-20 18:40:36.375941',4970,'application/pdf',_binary '','Рейтинг-контроль №2 Оцифровка карты.pdf','homework\\2f77c2d6-ec3b-4867-b9f2-7e5935883927.pdf',1,1),(3,'2026-04-20 18:41:56.117272',1121,'application/vnd.openxmlformats-officedocument.wordprocessingml.document',_binary '','ИСТ123-CASE-КП-№5-КиласхановаРМ.docx','homework\\54c579d8-6643-49c9-824e-fe9152eb9bb3.docx',2,1),(4,'2026-04-20 19:02:28.421669',4970,'application/pdf',_binary '','Рейтинг-контроль №2 Оцифровка карты.pdf','homework\\6fd4feb4-78e2-4f6c-aa81-e3aba3843bcc.pdf',1,1),(5,'2026-04-20 19:03:03.593007',182,'application/vnd.openxmlformats-officedocument.wordprocessingml.document',_binary '','Statya_2.docx','homework\\67e8123a-fac4-43ed-bb99-ecd00fb15fca.docx',3,1),(6,'2026-04-21 07:29:21.488043',182,'application/vnd.openxmlformats-officedocument.wordprocessingml.document',_binary '','Statya_2 (1).docx','homework\\1096793d-826a-4c2e-bf7d-8988009a540e.docx',1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homeworks`
--

LOCK TABLES `homeworks` WRITE;
/*!40000 ALTER TABLE `homeworks` DISABLE KEYS */;
INSERT INTO `homeworks` VALUES (1,NULL,'2026-04-15 11:59:12.000000','Решить 10 квадратных уравнений из учебника (стр. 145)','2026-04-17',NULL,'submitted',NULL,'2026-04-21 07:29:21.561801','Решить квадратные уравнения',NULL,'2026-04-21 07:29:21.574156',2,1,2),(2,NULL,'2026-04-15 11:59:12.000000','Предоставить 3 различных способа доказательства','2026-04-15',NULL,'submitted','Решено 3 способами: алгебраический, геометрический и через площади','2026-04-20 18:41:56.117780','Доказать теорему Пифагора',NULL,'2026-04-20 18:41:56.120339',2,1,2),(3,'2026-04-13 10:00:00.000000','2026-04-15 11:59:12.000000','Решить систему из 5 уравнений','2026-04-12',4,'submitted','Решено правильно 4 из 5','2026-04-20 19:03:03.595007','Система уравнений','Хорошо! Ошибка в 3-м уравнении - внимательнее со знаками.','2026-04-20 19:03:03.596498',2,1,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES (1,'2026-04-15 11:57:06.000000',60,'online',_binary '','2026-04-22 17:00:00.000000',NULL,'Подготовка к контрольной','https://zoom.us/j/123456789','2026-04-20 13:56:06.009513',500.00,'upcoming','Математика','Геометрия. Треугольники','2026-04-20 13:56:06.010328',1,2),(2,'2026-04-15 11:57:06.000000',90,'online',_binary '','2026-04-10 16:00:00.000000',NULL,'Хорошо объяснили дискриминант','https://zoom.us/j/987654321','2026-04-10 16:45:00.000000',600.00,'upcoming','Математика','Алгебра. Квадратные уравнения','2026-04-15 11:57:06.000000',1,2),(4,'2026-04-15 11:57:59.000000',60,'online',_binary '','2026-04-20 16:00:00.000000',NULL,'Подготовка к контрольной','https://zoom.us/j/123456789','2026-04-20 13:47:11.339073',500.00,'upcoming','Математика','Геометрия. Треугольники','2026-04-20 13:47:11.345034',1,2),(5,'2026-04-15 11:57:59.000000',90,'online',_binary '','2026-04-10 16:00:00.000000',NULL,'Хорошо объяснили дискриминант','https://zoom.us/j/987654321','2026-04-10 16:45:00.000000',600.00,'completed','Математика','Алгебра. Квадратные уравнения','2026-04-15 11:57:59.000000',1,2),(6,'2026-04-15 11:57:59.000000',60,'offline',_binary '','2026-04-22 17:30:00.000000','Кафе Campus','Встреча в центре города',NULL,'2026-04-20 13:47:17.586354',400.00,'upcoming','Английский язык','Present Perfect','2026-04-20 13:47:17.587358',1,5),(7,'2026-04-15 11:57:59.000000',60,'online',_binary '\0','2026-04-20 16:00:00.000000',NULL,'Подготовка к контрольной','https://zoom.us/j/123456789','2026-04-20 13:47:11.339073',500.00,'upcoming','Математика','Геометрия. Треугольники','2026-04-20 13:47:11.345034',1,2),(8,'2026-04-15 11:57:59.000000',60,'online',_binary '','2026-04-22 19:00:00.000000',NULL,'Подготовка к контрольной','https://zoom.us/j/123456789','2026-04-20 18:27:25.623120',500.00,'upcoming','Математика','Геометрия. Треугольники','2026-04-20 18:27:25.629780',1,2),(9,'2026-04-15 11:57:59.000000',60,'online',_binary '','2026-04-22 19:00:00.000000',NULL,'Подготовка к контрольной','https://zoom.us/j/123456789','2026-04-21 08:05:12.561522',500.00,'upcoming','Математика','Геометрия. Треугольники','2026-04-21 08:05:12.579749',1,2),(10,'2026-04-15 11:57:59.000000',60,'online',_binary '','2026-04-22 19:00:00.000000',NULL,'Подготовка к контрольной','https://zoom.us/j/123456789','2026-04-21 07:50:22.952857',500.00,'upcoming','Математика','Геометрия. Треугольники','2026-04-21 07:50:22.959211',1,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
INSERT INTO `materials` VALUES (1,NULL,'2026-04-15 11:59:18.000000','Полный конспект по теме квадратных уравнений',NULL,2048,'application/pdf',_binary '','file','квадратные_уравнения.pdf','/files/materials/квадратные_уравнения.pdf','Математика','Конспект - Квадратные уравнения','2026-04-15 11:59:18.000000',2,1,2),(2,NULL,'2026-04-15 11:59:18.000000','Отличное объяснение теоремы Пифагора на YouTube','https://www.youtube.com/watch?v=dQw4w9WgXcQ',NULL,NULL,_binary '','link',NULL,NULL,'Математика','Видео - Теорема Пифагора','2026-04-15 11:59:18.000000',2,1,2),(3,'Квадратное уравнение: ax² + bx + c = 0\nДискриминант: D = b² - 4ac\nКорни: x = (-b ± √D) / 2a','2026-04-15 11:59:18.000000','Основные формулы алгебры и геометрии',NULL,NULL,NULL,_binary '','text',NULL,NULL,'Математика','Справочник формул','2026-04-15 11:59:18.000000',NULL,NULL,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,5000.00,'2026-03-10 15:35:01.007748',NULL,'debit',NULL,NULL,'pending',NULL,1),(2,500.00,'2026-04-20 13:47:11.281575','Оплата занятия','debit',NULL,'balance','success',4,1),(3,400.00,'2026-04-20 13:47:17.581045','Оплата занятия','debit',NULL,'balance','success',6,1),(4,500.00,'2026-04-20 13:56:06.004945','Оплата занятия','debit',NULL,'balance','success',1,1),(5,555.00,'2026-04-20 14:18:01.784922','Пополнение баланса','credit',NULL,'web','success',NULL,1),(6,66666.00,'2026-04-20 14:18:16.541227','Пополнение баланса','credit',NULL,'web','success',NULL,1),(7,6666.00,'2026-04-20 14:19:22.516497','Пополнение баланса','credit',NULL,'web','success',NULL,7),(8,500.00,'2026-04-20 18:27:25.589367','Оплата занятия','debit',NULL,'balance','success',8,1),(9,5555.00,'2026-04-21 07:48:47.600519','Пополнение баланса','credit',NULL,'web','success',NULL,1),(10,500.00,'2026-04-21 07:50:22.949746','Оплата урока: Математика - Геометрия. Треугольники (22.04.2026 22:00)','debit',NULL,'balance','success',10,1),(11,500.00,'2026-04-21 08:05:12.475648','Оплата урока: Математика - Геометрия. Треугольники (22.04.2026 19:00)','debit',NULL,'balance','success',9,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,_binary '',NULL,74876.00,'2026-03-10 15:35:01.007748','fisina_i@mail.ru','Фисина Илья',6,'$2a$10$OJ433nKf9LeXvHf/OSrQGePxd.9jB1yo7NlbB/CIoccPwfsSYu4kS','+7 960 511-27-22','Студент','2026-04-21 08:05:12.578580'),(2,_binary '',NULL,0.00,'2026-03-10 15:37:30.891583','kilas@mail.ru','Киласханова Рината Мурадовна',NULL,'$2a$10$ktnV0KSqFNo.KLCnibQequrD0HqAnzFRTPB21U1fyqAu7dW3U1Cv6','+7 960 511 27 22','Репетитор','2026-03-10 15:37:30.891583'),(4,_binary '',NULL,3500.00,'2026-04-15 11:57:59.000000','akselov@mail.ru','Акселов Артём',8,'$2a$10$D8Z9K3L4M2N1P0Q9R8S7T6U5V4W3X2Y1Z0A9B8C7D6E5F4G3H2I1J0','+7 960 511-11-11','Студент','2026-04-15 11:57:59.000000'),(5,_binary '',NULL,2500.00,'2026-04-15 11:57:59.000000','petrova@mail.ru','Петрова Анна',9,'$2a$10$A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6','+7 960 522-22-22','Студент','2026-04-15 11:57:59.000000'),(6,_binary '',NULL,0.00,'2026-04-15 11:57:59.000000','ivanov@mail.ru','Иванов Иван Иванович',NULL,'$2a$10$F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2','+7 960 533-33-33','Репетитор','2026-04-15 11:57:59.000000'),(7,_binary '',NULL,6666.00,'2026-04-20 12:06:21.742154','aaaa@mail.ru','Артём касюша',4,'$2a$10$SAAA1exQHYxCHgud2mqif.tMXwP1Aqb1UpCSfUM44I1zGQyR6.BtK','78766666432','Студент','2026-04-20 14:19:22.517502');
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

-- Dump completed on 2026-04-21 17:39:16
