-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 03/10/2025 às 14:01
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
-- Estrutura para tabela `tb_documentos_financeiros`
--

CREATE TABLE `tb_documentos_financeiros` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tipo` enum('pagar','receber') NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `valor` int(11) NOT NULL,
  `data_emissao` date DEFAULT NULL,
  `data_vencimento` date NOT NULL,
  `data_baixa` date DEFAULT NULL,
  `status` enum('pendente','pago','recebido','cancelado','atrasado') DEFAULT 'pendente',
  `user_id` bigint(20) NOT NULL,
  `conta_id` bigint(20) DEFAULT NULL,
  `categoria_id` bigint(20) UNSIGNED DEFAULT NULL,
  `fornecedor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `cliente_id` bigint(20) UNSIGNED DEFAULT NULL,
  `forma_pagamento` enum('dinheiro','cartao','boleto','pix','transferencia') DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `tb_documentos_financeiros`
--
ALTER TABLE `tb_documentos_financeiros`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tb_documentos_financeiros`
--
ALTER TABLE `tb_documentos_financeiros`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
