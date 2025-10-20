-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 18/10/2025 às 20:04
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
-- Estrutura para tabela `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_aplicativos`
--

CREATE TABLE `tb_aplicativos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `id_categoria` bigint(20) UNSIGNED NOT NULL,
  `nome` varchar(100) NOT NULL,
  `icone` varchar(255) DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `compartilhado` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_cartao_credito`
--

CREATE TABLE `tb_cartao_credito` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `id_bandeira` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `titulo_slug` varchar(255) NOT NULL,
  `digito_verificador` varchar(4) NOT NULL,
  `compartilhado` tinyint(1) NOT NULL DEFAULT 0,
  `limite` int(10) UNSIGNED DEFAULT NULL,
  `limite_utilizado` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_cartao_credito_bandeira`
--

CREATE TABLE `tb_cartao_credito_bandeira` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bandeira` varchar(20) NOT NULL,
  `icone` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_carteira_digital`
--

CREATE TABLE `tb_carteira_digital` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `titulo_slug` varchar(255) NOT NULL,
  `saldo_atual` int(11) NOT NULL,
  `moeda` varchar(10) NOT NULL DEFAULT 'BRL',
  `compartilhado` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('ativa','inativa','suspensa') NOT NULL DEFAULT 'ativa',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_categoria`
--

CREATE TABLE `tb_categoria` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `id_parent` bigint(20) UNSIGNED DEFAULT NULL,
  `titulo` varchar(50) NOT NULL,
  `titulo_slug` varchar(100) NOT NULL,
  `descricao` varchar(500) DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL,
  `text_color` varchar(7) DEFAULT NULL,
  `icone` varchar(255) DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `ordem` int(11) DEFAULT 1,
  `compartilhado` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `tb_categoria`
--

INSERT INTO `tb_categoria` (`id`, `id_usuario`, `id_parent`, `titulo`, `titulo_slug`, `descricao`, `color`, `text_color`, `icone`, `imagem`, `ordem`, `compartilhado`, `status`, `created_at`, `updated_at`) VALUES
(24, 2, NULL, 'Receitas', 'receitas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(25, 2, NULL, 'Despesas', 'Despesas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(26, 2, 24, 'Salário', 'Salário', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(27, 2, 24, 'Renda Extra', 'Renda Extra', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(29, 2, 24, 'Premiações', 'Premiações', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(30, 2, 24, 'Reembolsos', 'reembolsos', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(31, 2, 24, 'Juros / Dividendos', 'juros-dividendos', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(32, 2, 24, 'Vendas', 'vendas', 'Ex.: Vendas de itens usados', NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(33, 2, 24, 'Aluguéis', 'Aluguéis', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(34, 2, 24, 'Outras receitas', 'outras-receitas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(35, 2, 25, 'Alimentação', 'Alimentação', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(36, 2, 35, 'Supermercado', 'supermercado', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(37, 2, 35, 'Restaurante / Delivery', 'restaurante-delivery', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(38, 2, 25, 'Moradia', 'moradia', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(39, 2, 38, 'Aluguel', 'aluguel', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(40, 2, 38, 'Luz / Água / Gás', 'luz-agua-gas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(41, 2, 38, 'Condomínio', 'condominio', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(42, 2, 38, 'Internet / Telefone', 'internet-telefone', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(43, 2, 25, 'Lazer', 'lazer', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(44, 2, 43, 'Cultura / Cinema / Teatro', 'cultura-cinema-teatro', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(45, 2, 43, 'Assinatura de Streams', 'assinatura-de-streams', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(46, 2, 45, 'Netflix', 'netflix', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(47, 2, 45, 'Spotify', 'spotify', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(48, 2, 45, 'Youtube', 'youtube', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(49, 2, 45, 'Amazon Prime', 'amazon-prime', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(50, 2, 25, 'Saúde', 'saude', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(51, 2, 50, 'Plano de saúde', 'plano-de-saude', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(52, 2, 50, 'Medicamentos', 'medicamentos', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(53, 2, 50, 'Consultas', 'consultas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(54, 2, 25, 'Educação', 'educacao', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(55, 2, 54, 'Escola', 'escola', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(56, 2, 54, 'Faculdade', 'Faculdade', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(57, 2, 54, 'Cursos', 'cursos', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(58, 2, 25, 'Compras', 'compras', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(59, 2, 58, 'Vestuário', 'vestuario', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(60, 2, 58, 'Eletrônicos', 'eletronicos', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(61, 2, 58, 'Presentes', 'presentes', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(62, 2, 25, 'Cartão de crédito', 'cartao-de-credito', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(63, 2, 25, 'Impostos / Taxas', 'impostos-taxas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(64, 2, 25, 'Outras despesas', 'outras-despesas', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(65, 2, 64, 'Doações', 'Doações', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(66, 2, 25, 'Pets', 'pets', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(67, 2, 25, 'Automóvel', 'automovel', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(68, 2, 67, 'Combustível', 'combustivel', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(69, 2, 67, 'Troca de óleo', 'troca-de-oleo', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(70, 2, 67, 'Pneu', 'pneu', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(71, 2, 67, 'Revisão', 'revisao', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(228, 2, 24, 'Aplicativo de recompensa', 'aplicativo-de-recompensa', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL),
(232, 2, 35, 'TEste', 'teste', 'TEste', NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_competencia`
--

CREATE TABLE `tb_competencia` (
  `id` int(10) UNSIGNED NOT NULL,
  `ano` int(11) NOT NULL,
  `mes` int(11) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_documentos_financeiros`
--

CREATE TABLE `tb_documentos_financeiros` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tipo` enum('pagar','receber') NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `valor` bigint(20) NOT NULL,
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

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_grupo_financeiro`
--

CREATE TABLE `tb_grupo_financeiro` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_grupo_financeiro_usuario`
--

CREATE TABLE `tb_grupo_financeiro_usuario` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `id_grupo` bigint(20) UNSIGNED NOT NULL,
  `aceito` enum('0','1') NOT NULL DEFAULT '0',
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_nota`
--

CREATE TABLE `tb_nota` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_autor` bigint(20) UNSIGNED NOT NULL,
  `assunto` varchar(255) DEFAULT NULL,
  `texto` text NOT NULL,
  `status` enum('draft','published','trash','inactive') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabela para inserção de notas e avisos';

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_planejamento`
--

CREATE TABLE `tb_planejamento` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `valor` int(11) NOT NULL,
  `data_prevista` date NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `compartilhado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_planejamento_transacao`
--

CREATE TABLE `tb_planejamento_transacao` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_planejamento` bigint(20) UNSIGNED NOT NULL,
  `id_transacao` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_projecao`
--

CREATE TABLE `tb_projecao` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `meses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`meses`)),
  `saldo_inicial` int(11) NOT NULL,
  `saldo_final` int(11) NOT NULL,
  `planejamento_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`planejamento_ids`)),
  `transacao_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`transacao_ids`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_transacao`
--

CREATE TABLE `tb_transacao` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `id_grupo` bigint(20) UNSIGNED DEFAULT NULL,
  `id_categoria` bigint(20) UNSIGNED NOT NULL,
  `descricao` varchar(200) NOT NULL,
  `valor` int(11) NOT NULL,
  `tipo` enum('receita','despesa') DEFAULT NULL,
  `data` date NOT NULL,
  `extras` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extras`)),
  `compartilhado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_user_tokens`
--

CREATE TABLE `tb_user_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tb_usuario_aplicativos`
--

CREATE TABLE `tb_usuario_aplicativos` (
  `id_usuario` bigint(20) UNSIGNED NOT NULL,
  `id_aplicativo` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(2, 'Alisson Guedes Pereira', 'alissonguedes87@gmail.com', NULL, '$2y$12$UUemMIxslCkVghTqocfC5OJfrduQeDIYmRH0T80Jgp8B9jstIfVL6', NULL, '2025-05-01 23:40:53', '2025-05-01 23:40:53'),
(9, 'Alisson', 'desenvolvimentowebmin@gmail.com', NULL, '$2y$12$DW2m3SayZyerqyTUJOT1MuTZkfV59bQoBuWT2.WoMsmT9w0zuIE6e', NULL, '2025-05-12 05:20:08', '2025-05-12 05:20:08'),
(15, 'Usuário Teste', 'usuarioteste@email.com', NULL, '$2y$12$hT6xrywYMrUgGq/b/NCYIeizAwWAH7Y0wNgrJ9CgPS.k6d/GLKV/q', NULL, '2025-10-01 03:19:37', '2025-10-01 03:19:37');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Índices de tabela `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Índices de tabela `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Índices de tabela `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Índices de tabela `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Índices de tabela `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Índices de tabela `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Índices de tabela `tb_aplicativos`
--
ALTER TABLE `tb_aplicativos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_aplicativos_id_usuario_foreign` (`id_usuario`),
  ADD KEY `tb_aplicativos_id_categoria_foreign` (`id_categoria`);

--
-- Índices de tabela `tb_cartao_credito`
--
ALTER TABLE `tb_cartao_credito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_cartao_credito_id_usuario_foreign` (`id_usuario`),
  ADD KEY `tb_cartao_credito_id_bandeira_foreign` (`id_bandeira`);

--
-- Índices de tabela `tb_cartao_credito_bandeira`
--
ALTER TABLE `tb_cartao_credito_bandeira`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `tb_carteira_digital`
--
ALTER TABLE `tb_carteira_digital`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_carteira_digital_id_usuario_foreign` (`id_usuario`);

--
-- Índices de tabela `tb_categoria`
--
ALTER TABLE `tb_categoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_categoria_id_usuario_foreign` (`id_usuario`),
  ADD KEY `tb_categoria_id_parent_foreign` (`id_parent`);

--
-- Índices de tabela `tb_competencia`
--
ALTER TABLE `tb_competencia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ano` (`ano`,`mes`);

--
-- Índices de tabela `tb_documentos_financeiros`
--
ALTER TABLE `tb_documentos_financeiros`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `tb_grupo_financeiro`
--
ALTER TABLE `tb_grupo_financeiro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_grupo_financeiro_id_usuario_foreign` (`id_usuario`);

--
-- Índices de tabela `tb_grupo_financeiro_usuario`
--
ALTER TABLE `tb_grupo_financeiro_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_grupo_financeiro_usuario_id_usuario_foreign` (`id_usuario`),
  ADD KEY `tb_grupo_financeiro_usuario_id_grupo_foreign` (`id_grupo`);

--
-- Índices de tabela `tb_nota`
--
ALTER TABLE `tb_nota`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tb_nota_id_autor` (`id_autor`);

--
-- Índices de tabela `tb_planejamento`
--
ALTER TABLE `tb_planejamento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_planejamento_id_usuario_foreign` (`id_usuario`);

--
-- Índices de tabela `tb_planejamento_transacao`
--
ALTER TABLE `tb_planejamento_transacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_planejamento_transacao_id_planejamento_foreign` (`id_planejamento`),
  ADD KEY `tb_planejamento_transacao_id_transacao_foreign` (`id_transacao`);

--
-- Índices de tabela `tb_projecao`
--
ALTER TABLE `tb_projecao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_projecao_id_usuario_foreign` (`id_usuario`);

--
-- Índices de tabela `tb_transacao`
--
ALTER TABLE `tb_transacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tb_transacao_id_usuario_foreign` (`id_usuario`),
  ADD KEY `tb_transacao_id_grupo_foreign` (`id_grupo`),
  ADD KEY `tb_transacao_id_categoria_foreign` (`id_categoria`);

--
-- Índices de tabela `tb_user_tokens`
--
ALTER TABLE `tb_user_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tb_user_tokens_token_unique` (`token`);

--
-- Índices de tabela `tb_usuario_aplicativos`
--
ALTER TABLE `tb_usuario_aplicativos`
  ADD KEY `fk_tb_usuario_aplicativos_IdUsuario` (`id_usuario`),
  ADD KEY `fk_tb_usuario_aplicativos_IdAplicativo` (`id_aplicativo`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_aplicativos`
--
ALTER TABLE `tb_aplicativos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_cartao_credito`
--
ALTER TABLE `tb_cartao_credito`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_cartao_credito_bandeira`
--
ALTER TABLE `tb_cartao_credito_bandeira`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_carteira_digital`
--
ALTER TABLE `tb_carteira_digital`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_categoria`
--
ALTER TABLE `tb_categoria`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

--
-- AUTO_INCREMENT de tabela `tb_competencia`
--
ALTER TABLE `tb_competencia`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_documentos_financeiros`
--
ALTER TABLE `tb_documentos_financeiros`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_grupo_financeiro`
--
ALTER TABLE `tb_grupo_financeiro`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_grupo_financeiro_usuario`
--
ALTER TABLE `tb_grupo_financeiro_usuario`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_nota`
--
ALTER TABLE `tb_nota`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_planejamento`
--
ALTER TABLE `tb_planejamento`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_planejamento_transacao`
--
ALTER TABLE `tb_planejamento_transacao`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_projecao`
--
ALTER TABLE `tb_projecao`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_transacao`
--
ALTER TABLE `tb_transacao`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tb_user_tokens`
--
ALTER TABLE `tb_user_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `tb_aplicativos`
--
ALTER TABLE `tb_aplicativos`
  ADD CONSTRAINT `tb_aplicativos_id_categoria_foreign` FOREIGN KEY (`id_categoria`) REFERENCES `tb_categoria` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tb_aplicativos_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_cartao_credito`
--
ALTER TABLE `tb_cartao_credito`
  ADD CONSTRAINT `tb_cartao_credito_id_bandeira_foreign` FOREIGN KEY (`id_bandeira`) REFERENCES `tb_cartao_credito_bandeira` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tb_cartao_credito_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_carteira_digital`
--
ALTER TABLE `tb_carteira_digital`
  ADD CONSTRAINT `tb_carteira_digital_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_categoria`
--
ALTER TABLE `tb_categoria`
  ADD CONSTRAINT `tb_categoria_id_parent_foreign` FOREIGN KEY (`id_parent`) REFERENCES `tb_categoria` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tb_categoria_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_grupo_financeiro`
--
ALTER TABLE `tb_grupo_financeiro`
  ADD CONSTRAINT `tb_grupo_financeiro_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_grupo_financeiro_usuario`
--
ALTER TABLE `tb_grupo_financeiro_usuario`
  ADD CONSTRAINT `tb_grupo_financeiro_usuario_id_grupo_foreign` FOREIGN KEY (`id_grupo`) REFERENCES `tb_grupo_financeiro` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tb_grupo_financeiro_usuario_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_nota`
--
ALTER TABLE `tb_nota`
  ADD CONSTRAINT `fk_tb_nota_id_autor` FOREIGN KEY (`id_autor`) REFERENCES `users` (`id`);

--
-- Restrições para tabelas `tb_planejamento`
--
ALTER TABLE `tb_planejamento`
  ADD CONSTRAINT `tb_planejamento_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_planejamento_transacao`
--
ALTER TABLE `tb_planejamento_transacao`
  ADD CONSTRAINT `tb_planejamento_transacao_id_planejamento_foreign` FOREIGN KEY (`id_planejamento`) REFERENCES `tb_planejamento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tb_planejamento_transacao_id_transacao_foreign` FOREIGN KEY (`id_transacao`) REFERENCES `tb_transacao` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_projecao`
--
ALTER TABLE `tb_projecao`
  ADD CONSTRAINT `tb_projecao_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_transacao`
--
ALTER TABLE `tb_transacao`
  ADD CONSTRAINT `tb_transacao_id_categoria_foreign` FOREIGN KEY (`id_categoria`) REFERENCES `tb_categoria` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tb_transacao_id_grupo_foreign` FOREIGN KEY (`id_grupo`) REFERENCES `tb_grupo_financeiro` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tb_transacao_id_usuario_foreign` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `tb_usuario_aplicativos`
--
ALTER TABLE `tb_usuario_aplicativos`
  ADD CONSTRAINT `fk_tb_usuario_aplicativos_IdAplicativo` FOREIGN KEY (`id_aplicativo`) REFERENCES `tb_aplicativos` (`id`),
  ADD CONSTRAINT `fk_tb_usuario_aplicativos_IdUsuario` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
