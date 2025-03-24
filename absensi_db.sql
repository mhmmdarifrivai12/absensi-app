/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 10.4.32-MariaDB : Database - absensi_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `attendance` */

DROP TABLE IF EXISTS `attendance`;

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) DEFAULT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `day` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subject_id` (`subject_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `attendance` */

insert  into `attendance`(`id`,`student_id`,`subject_id`,`class_id`,`date`,`status`,`day`) values 
(20,30,10,10,'2025-02-20','absen','Kamis'),
(21,28,10,18,'2025-02-20','izin','Kamis'),
(22,38,10,18,'2025-02-20','sakit','Kamis'),
(23,21,10,10,'2025-02-20','izin','Kamis'),
(24,28,10,18,'2025-02-19','hadir','Rabu'),
(25,28,10,18,'2025-02-27','hadir','Kamis'),
(26,21,10,10,'2025-02-20','absen','Kamis'),
(27,26,10,15,'2025-02-20','hadir','Kamis'),
(28,35,10,15,'2025-02-20','sakit','Kamis'),
(29,26,10,15,'2025-02-21','sakit','Jumat'),
(30,35,10,15,'2025-02-21','sakit','Jumat'),
(31,21,10,10,'2025-02-20','hadir','Kamis'),
(32,30,10,10,'2025-02-20','sakit','Kamis'),
(33,26,10,15,'2025-02-08','izin','Sabtu'),
(34,21,10,10,'2025-02-07','hadir','Jumat'),
(35,30,10,10,'2025-02-07','hadir','Jumat'),
(36,38,10,18,'2025-02-20','izin','Kamis'),
(37,21,10,10,'2025-02-20','hadir','Kamis'),
(38,24,15,13,'2025-02-21','alpha','Jumat'),
(39,33,15,13,'2025-02-21','alpha','Jumat'),
(40,23,11,12,'2025-02-24','hadir','Senin'),
(41,32,11,12,'2025-02-24','sakit','Senin'),
(42,23,11,12,'2025-02-25','sakit','Selasa'),
(43,32,11,12,'2025-02-25','alpha','Selasa'),
(44,21,17,10,'2025-03-23','hadir','Minggu'),
(45,30,17,10,'2025-03-23','sakit','Minggu'),
(46,39,17,10,'2025-03-23','hadir','Minggu'),
(47,40,17,10,'2025-03-23','hadir','Minggu'),
(48,41,17,10,'2025-03-23','hadir','Minggu'),
(49,42,17,10,'2025-03-23','alpha','Minggu'),
(50,43,17,10,'2025-03-23','izin','Minggu'),
(51,21,17,10,'2025-03-23','hadir','Minggu'),
(52,30,17,10,'2025-03-23','sakit','Minggu'),
(53,39,17,10,'2025-03-23','hadir','Minggu'),
(54,40,17,10,'2025-03-23','hadir','Minggu'),
(55,41,17,10,'2025-03-23','hadir','Minggu'),
(56,42,17,10,'2025-03-23','alpha','Minggu'),
(57,43,17,10,'2025-03-23','izin','Minggu'),
(58,23,11,12,'2025-03-23','hadir','Minggu'),
(59,32,11,12,'2025-03-23','izin','Minggu'),
(60,21,17,10,'2025-03-24','hadir','Senin'),
(61,21,17,10,'2025-03-28','alpha','Jumat');

/*Table structure for table `classes` */

DROP TABLE IF EXISTS `classes`;

CREATE TABLE `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `classes` */

insert  into `classes`(`id`,`name`) values 
(10,'10 IPA 1 Update'),
(11,'10 IPA 2'),
(12,'10 IPA 3'),
(13,'11 IPA 1'),
(14,'11 IPA 2'),
(15,'11 IPA 3'),
(16,'12 IPA 1'),
(17,'12 IPA 2'),
(18,'12 IPA 3'),
(19,'12 IPA 3'),
(20,'11 IPA 9');

/*Table structure for table `students` */

DROP TABLE IF EXISTS `students`;

CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `nis` varchar(20) NOT NULL,
  `class_id` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nis` (`nis`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `students` */

insert  into `students`(`id`,`name`,`nis`,`class_id`,`updated_at`) values 
(21,'rivai Update','22132441',11,'2025-03-23 17:34:46'),
(22,'Putri','00192',11,'2025-03-23 15:13:45'),
(23,'Akhfee','080800',12,'2025-03-23 15:13:45'),
(24,'Rivai','992831',13,'2025-03-23 15:13:45'),
(25,'Lailatul','99831',14,'2025-03-23 15:13:45'),
(26,'Zidane','99381',15,'2025-03-23 15:13:45'),
(27,'Dicky','993817',16,'2025-03-23 15:13:45'),
(28,'Ridwan','88317',18,'2025-03-23 15:13:45'),
(29,'Erlangga','356713',17,'2025-03-23 15:13:45'),
(30,'Indah','318349',10,'2025-03-23 15:13:45'),
(31,'Julian','34124',11,'2025-03-23 15:13:45'),
(32,'Iwan','231241',12,'2025-03-23 15:13:45'),
(33,'Neneng','214909',13,'2025-03-23 15:13:45'),
(34,'Susanti','887516',14,'2025-03-23 15:13:45'),
(35,'Bian','241551',15,'2025-03-23 15:13:45'),
(36,'Yuda','455123',16,'2025-03-23 15:13:45'),
(37,'Jima','1324551',17,'2025-03-23 15:13:45'),
(38,'Luis','441324',18,'2025-03-23 15:13:45'),
(39,'Judi','9989',10,'2025-03-23 15:13:45'),
(40,'Chikal2','21312312',10,'2025-03-23 15:13:45'),
(41,'tester','1111',10,'2025-03-23 15:13:45'),
(42,'tester1','1212',10,'2025-03-23 15:13:45'),
(43,'Chikal2','321321',10,'2025-03-23 15:13:45'),
(44,'Chikal2','2312441',11,'2025-03-23 15:13:45'),
(45,'final','12312',18,'2025-03-23 15:13:45');

/*Table structure for table `subjects` */

DROP TABLE IF EXISTS `subjects`;

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `subjects` */

insert  into `subjects`(`id`,`name`) values 
(10,'Matematika'),
(11,'Bahasa Indonesia'),
(12,'Bahasa Lampung'),
(13,'Bahasa Inggris'),
(14,'Fisika'),
(15,'Kimia'),
(16,'PKN'),
(17,'IPA'),
(18,'IPS'),
(19,'Penjaskes'),
(20,'Kimia'),
(21,'fisika'),
(22,'Final');

/*Table structure for table `teacher_class` */

DROP TABLE IF EXISTS `teacher_class`;

CREATE TABLE `teacher_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `teacher_class_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `teacher_class_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `teacher_class` */

/*Table structure for table `teacher_subjects` */

DROP TABLE IF EXISTS `teacher_subjects`;

CREATE TABLE `teacher_subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `subject_id` (`subject_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `teacher_subjects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `teacher_subjects_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `teacher_subjects_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `teacher_subjects` */

insert  into `teacher_subjects`(`id`,`user_id`,`subject_id`,`class_id`) values 
(10,8,16,10),
(11,8,19,14);

/*Table structure for table `teachers_classes_subjects` */

DROP TABLE IF EXISTS `teachers_classes_subjects`;

CREATE TABLE `teachers_classes_subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `teaching_day` varchar(255) NOT NULL,
  `start_time` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `class_id` (`class_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `teachers_classes_subjects_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `teachers_classes_subjects_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `teachers_classes_subjects_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `teachers_classes_subjects` */

insert  into `teachers_classes_subjects`(`id`,`teacher_id`,`class_id`,`subject_id`,`teaching_day`,`start_time`,`duration`) values 
(16,7,10,22,'Minggu','08:00:00',90),
(17,7,18,10,'Kamis','13:00',180),
(18,7,15,10,'Selasa','10:00',180),
(19,8,10,17,'Selasa','09:00',120),
(20,8,12,11,'Kamis','07:00',180),
(21,2,16,19,'Rabu','15:00',180),
(22,7,13,15,'Jumat','13:00',180),
(23,2,11,16,'Selasa','15:00',180),
(24,11,20,14,'Minggu','13:00',180),
(25,11,20,19,'Sabtu','15:00',180),
(26,8,17,19,'Senin','10:00',60),
(27,3,20,22,'Minggu','09:00',180),
(28,3,10,22,'Minggu','08:00:00',90),
(29,3,10,22,'Kamis','08:00',120),
(31,12,20,22,'Rabu','07:00',60);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `name` varchar(225) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','guru') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`name`,`password`,`role`,`created_at`) values 
(1,'admin','Admin','$2b$10$4woJhoRp11OIttJ4irs5Tu.xeakjH3zvhT20K7CWsNEaRXM/HCVX2','admin','2025-02-18 23:10:04'),
(2,'guru','Muhammad','$2b$10$4Z3tbZG.B7Xa0wlUmTcVueHq6rnmaTNGPvVO5nkgfQzHFgtLDQG4y','guru','2025-02-18 23:10:20'),
(3,'guru2','Guru 2','$2b$10$LC3JDWMKc6L7ob/tNNiSUO3iFmDH5S.gUhbIMTk26snulM4SIFJHe','guru','2025-02-19 03:38:56'),
(4,'guru3','Guru 3','$2b$10$jbeZZsMTIq0IiNlhqPGe3ePRlGrR7OuhXLSM80AWZ6tNilK6y4FKO','guru','2025-02-19 03:39:02'),
(5,'guru4','Guru 4','$2b$10$QoRIZMeQBTPoYA3ANw4TZu4PA70/Wc4cF6K0FxC5zIS9Eh7GsvkjG','guru','2025-02-19 03:39:06'),
(6,'arif','Arif Rivai','$2b$10$qZVLjvNLTLMVIBY5lNdoOuAXhK0nyFB0N5yHRoMwzqcKi2HBSo6m.','admin','2025-02-19 22:55:33'),
(7,'putri','Putri Lailatul','$2b$10$LyYjcJKVCtJ9TeDX0hPGp.HmGZkpcBfJYA2mSbHLfnbXCVxsT0jLu','guru','2025-02-19 23:00:12'),
(8,'Uki','Akhfee Lauki Udate','$2b$10$wUOcmKG3xO/TmeVcSL7ZJ.Sgmd0zbSsaj/cI.G1JTLLzk.NjlRRAS','guru','2025-02-20 22:53:59'),
(10,'zidan','Zidan Al','$2b$10$n7SABzStoOmvxs/Bc3XBJ.EXBXumb7CTTXcwAFGpz6wwxn0qDfntK','guru','2025-02-23 14:27:02'),
(11,'diki','Ahmad Diki','$2b$10$mUVEck89vFOOJk9CMmYCPO9PR7RvUL6YFTq3DHV.brJgPF5K2ZTBC','guru','2025-02-24 23:23:25'),
(12,'update','Muhammad Arif','$2b$10$.DSl8ryAr/gWw3oJaWUpiOoRrxQlc5uz89XniySzVi56hdColfVV.','guru','2025-03-23 15:52:12'),
(17,'arif12','Muhammad Arif Rivai','$2b$10$la0JCmK3nlh3EPhpyoJ09e/4kstlHIoyeDOxbWYgp49yK1rs0lCQ2','guru','2025-03-23 16:31:17');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
