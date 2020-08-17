-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: werewolf
-- ------------------------------------------------------
-- Server version	5.7.28-log

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
-- Table structure for table `lichsuchoi`
--

DROP TABLE IF EXISTS `lichsuchoi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lichsuchoi` (
  `idUser` int(11) NOT NULL,
  `idPhong` int(11) NOT NULL,
  `ketqua` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `nhanvat` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idUser`,`idPhong`),
  KEY `FK_lichsu_phong_idx` (`idPhong`),
  CONSTRAINT `FK_lichsu_phong` FOREIGN KEY (`idPhong`) REFERENCES `phongchoi` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_lichsu_user` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichsuchoi`
--

LOCK TABLES `lichsuchoi` WRITE;
/*!40000 ALTER TABLE `lichsuchoi` DISABLE KEYS */;
/*!40000 ALTER TABLE `lichsuchoi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phongchoi`
--

DROP TABLE IF EXISTS `phongchoi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phongchoi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slnguoichoimax` int(11) DEFAULT NULL,
  `slnguoihientai` int(11) DEFAULT NULL,
  `thoidiemchoi` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phongchoi`
--

LOCK TABLES `phongchoi` WRITE;
/*!40000 ALTER TABLE `phongchoi` DISABLE KEYS */;
/*!40000 ALTER TABLE `phongchoi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userphongchoi`
--

DROP TABLE IF EXISTS `userphongchoi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userphongchoi` (
  `iduser` int(11) NOT NULL,
  `idphong` int(11) NOT NULL,
  PRIMARY KEY (`iduser`,`idphong`),
  KEY `id_phong_idx` (`idphong`),
  CONSTRAINT `id_phong` FOREIGN KEY (`idphong`) REFERENCES `phongchoi` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_user` FOREIGN KEY (`iduser`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userphongchoi`
--

LOCK TABLES `userphongchoi` WRITE;
/*!40000 ALTER TABLE `userphongchoi` DISABLE KEYS */;
/*!40000 ALTER TABLE `userphongchoi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `ten` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'haimtp','$2a$10$SzGS1PorpcElE1hzFhVF4./PvflMloj4uk/h9PbOnWJnr3S3coUjC','','lequanghai540@gmail.com'),(2,'nnt','$2a$10$/zalRIDEq3l9QdToWf2OducbGmvGMqmGbYZYTkuy1.PnaeDrn/V.O','LÊ QUANG HẢI','lequanghai540@gmail.com');
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

-- Dump completed on 2020-08-17 22:44:09
