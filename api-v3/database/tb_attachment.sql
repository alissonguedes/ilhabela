-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 23/10/2025 às 09:37
-- Versão do servidor: 10.11.13-MariaDB-0ubuntu0.24.04.1
-- Versão do PHP: 8.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `controle_financeiro`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_attachment`
--

CREATE TABLE `tb_attachment` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `object_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(50) NOT NULL,
  `file_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `inline` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `lang` varchar(16) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_file`
--

CREATE TABLE `tb_file` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ft` varchar(50) NOT NULL DEFAULT 'T' COMMENT 'Coluna FileType: Esta coluna indica o contexto ao qual o arquivo foi salvo (T - Transaction)',
  `type` varchar(255) NOT NULL DEFAULT '',
  `size` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `key` varchar(86) NOT NULL,
  `signature` varchar(86) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `attrs` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_file_chunk`
--

CREATE TABLE `tb_file_chunk` (
  `file_id` bigint(20) UNSIGNED NOT NULL,
  `chunk_id` int(11) NOT NULL,
  `filedata` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `tb_attachment`
--
ALTER TABLE `tb_attachment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `object_id_type_file_id_UNIQUE` (`object_id`,`type`,`file_id`),
  ADD KEY `fk_tb_attachment_file_id` (`file_id`);

--
-- Índices de tabela `tb_file`
--
ALTER TABLE `tb_file`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ft` (`ft`),
  ADD KEY `key` (`key`),
  ADD KEY `signature` (`signature`),
  ADD KEY `type` (`type`),
  ADD KEY `created` (`created_at`),
  ADD KEY `size` (`size`);

--
-- Índices de tabela `tb_file_chunk`
--
ALTER TABLE `tb_file_chunk`
  ADD PRIMARY KEY (`file_id`,`chunk_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tb_attachment`
--
ALTER TABLE `tb_attachment`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_file`
--
ALTER TABLE `tb_file`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `tb_attachment`
--
ALTER TABLE `tb_attachment`
  ADD CONSTRAINT `fk_tb_attachment_file_id` FOREIGN KEY (`file_id`) REFERENCES `tb_file` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_file_chunk`
--
ALTER TABLE `tb_file_chunk`
  ADD CONSTRAINT `tb_file_chunk_file_id` FOREIGN KEY (`file_id`) REFERENCES `tb_file` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
