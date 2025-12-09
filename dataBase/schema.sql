-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema senseidojo_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema senseidojo_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `senseidojo_db` DEFAULT CHARACTER SET utf8mb3 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`administrador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`administrador` (
  `idadministrador` INT NOT NULL AUTO_INCREMENT,
  `admin_name` VARCHAR(60) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `active` TINYINT NOT NULL DEFAULT 1,
  `admin_email` VARCHAR(120) NOT NULL,
  `acess_level` ENUM('master', 'gerente', 'financeiro', 'operacional') NULL DEFAULT 'operacional',
  `photo_perfil` VARCHAR(255) NULL,
  PRIMARY KEY (`idadministrador`),
  UNIQUE INDEX `admin_email_UNIQUE` (`admin_email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `acess_type` ENUM('professor', 'aluno') NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `user_email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `user_telephone` VARCHAR(20) NOT NULL,
  `birth_date` DATE NOT NULL,
  `active` TINYINT NOT NULL DEFAULT 1,
  `registration_data` VARCHAR(45) NULL,
  `administrador_idadministrador` INT NOT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC) VISIBLE,
  INDEX `fk_usuario_administrador_idx` (`administrador_idadministrador` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_administrador`
    FOREIGN KEY (`administrador_idadministrador`)
    REFERENCES `mydb`.`administrador` (`idadministrador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `senseidojo_db`.`administrador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `senseidojo_db`.`administrador` (
  `idadministrador` INT NOT NULL AUTO_INCREMENT,
  `admin_name` VARCHAR(60) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `active` TINYINT NOT NULL DEFAULT '1',
  `admin_email` VARCHAR(120) NOT NULL,
  `acess_level` ENUM('master', 'operacional') NULL DEFAULT 'operacional',
  `photo_perfil` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`idadministrador`),
  UNIQUE INDEX `admin_email_UNIQUE` (`admin_email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `senseidojo_db`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `senseidojo_db`.`usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `acess_type` ENUM('professor', 'aluno') NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `user_email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `user_telephone` VARCHAR(20) NOT NULL,
  `birth_date` DATE NOT NULL,
  `active` TINYINT NOT NULL DEFAULT '1',
  `registration_data` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `administrador_idadministrador` INT NOT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE INDEX `user_email_UNIQUE` (`user_email` ASC) VISIBLE,
  INDEX `fk_usuario_administrador_idx` (`administrador_idadministrador` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_administrador`
    FOREIGN KEY (`administrador_idadministrador`)
    REFERENCES `senseidojo_db`.`administrador` (`idadministrador`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`professor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `senseidojo_db`.`professor` (
  `idprofessor` INT NOT NULL AUTO_INCREMENT,
  `modalidade` ENUM('jiu-jitsu', 'karatê', 'kickboxing', 'boxe', 'wrestling') NOT NULL,
  `usuario_idusuario` INT NOT NULL,
  `prof_telephone` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`idprofessor`),
  INDEX `fk_professor_usuario1_idx` (`usuario_idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_professor_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `senseidojo_db`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`aluno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `senseidojo_db`.`aluno` (
  `idaluno` INT NOT NULL,
  `responsible_phone` VARCHAR(20) NULL,
  `medical_observations` TEXT NULL,
  `start_date` DATE NOT NULL,
  `responsible` VARCHAR(100) NULL,
  `usuario_idusuario` INT NOT NULL,
  PRIMARY KEY (`idaluno`),
  INDEX `fk_aluno_usuario1_idx` (`usuario_idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_aluno_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `senseidojo_db`.`usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `senseidojo_db` ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;