-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 12, 2021 at 06:24 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_eloisa`
--

-- --------------------------------------------------------

--
-- Table structure for table `abono_cliente`
--

CREATE TABLE `abono_cliente` (
  `idAbono` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `cantidadAbono` double NOT NULL,
  `fechaAbono` datetime NOT NULL DEFAULT current_timestamp(),
  `estatusAbono` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Table structure for table `catalogo_estatus`
--

CREATE TABLE `catalogo_estatus` (
  `estatus` int(11) NOT NULL,
  `descripcion` varchar(45) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Dumping data for table `catalogo_estatus`
--

INSERT INTO `catalogo_estatus` (`estatus`, `descripcion`) VALUES
(0, 'producto desactivado'),
(1, 'producto activado'),
(0, 'transaccion no pagada'),
(1, 'transaccion pagada'),
(2, 'Transaccion Cancelada'),
(0, 'Corte Terminado'),
(1, 'Corte Actual'),
(0, 'flagTicket desactivado'),
(1, 'flagTicket activado');

-- --------------------------------------------------------

--
-- Table structure for table `categoria`
--

CREATE TABLE `categoria` (
  `idCategoria` int(11) NOT NULL,
  `nombreCategoria` varchar(45) COLLATE utf8_spanish2_ci NOT NULL,
  `estatusCategoria` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Dumping data for table `categoria`
--

INSERT INTO `categoria` (`idCategoria`, `nombreCategoria`, `estatusCategoria`) VALUES
(1, 'Sabritas', 1),
(2, 'Refrescos', 1),
(3, 'Dulces', 1);

-- --------------------------------------------------------

--
-- Table structure for table `cliente`
--

CREATE TABLE `cliente` (
  `idCliente` int(11) NOT NULL,
  `nombreCliente` varchar(120) COLLATE utf8_spanish2_ci NOT NULL,
  `telefonoCliente` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `estatusCliente` int(11) NOT NULL DEFAULT 1,
  `saldoTotal` double NOT NULL,
  `saldoRestante` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Table structure for table `configuracion_pv`
--

CREATE TABLE `configuracion_pv` (
  `id_configuracion_pv` int(11) NOT NULL,
  `tipo_configuracion` varchar(20) COLLATE utf8_spanish2_ci NOT NULL,
  `estatus` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Dumping data for table `configuracion_pv`
--

INSERT INTO `configuracion_pv` (`id_configuracion_pv`, `tipo_configuracion`, `estatus`) VALUES
(1, 'Tienda', 1),
(2, 'Uniformes', 0);

-- --------------------------------------------------------

--
-- Table structure for table `corte_caja`
--

CREATE TABLE `corte_caja` (
  `idCorte` int(11) NOT NULL,
  `cantidadCorte` double NOT NULL,
  `inicioCorte` datetime NOT NULL DEFAULT current_timestamp(),
  `finCorte` datetime NOT NULL,
  `idUser` int(11) NOT NULL,
  `estatusCorte` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detalle_menu_tipo`
--

CREATE TABLE `detalle_menu_tipo` (
  `id_detalle_menu` int(11) NOT NULL,
  `idMenu` int(11) NOT NULL,
  `idTipoUser` int(11) NOT NULL,
  `estatus` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Dumping data for table `detalle_menu_tipo`
--

INSERT INTO `detalle_menu_tipo` (`id_detalle_menu`, `idMenu`, `idTipoUser`, `estatus`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 3, 1, 1),
(4, 4, 1, 1),
(5, 5, 1, 1),
(6, 6, 1, 1),
(7, 7, 1, 1),
(8, 8, 1, 1),
(9, 9, 1, 1),
(10, 10, 1, 1),
(11, 1, 2, 1),
(12, 3, 2, 1),
(13, 4, 2, 1),
(14, 5, 2, 1),
(15, 6, 2, 1),
(16, 10, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `flagtickets`
--

CREATE TABLE `flagtickets` (
  `idFlagTickets` int(11) NOT NULL,
  `flagTickets` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Dumping data for table `flagtickets`
--

INSERT INTO `flagtickets` (`idFlagTickets`, `flagTickets`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id_menu` int(11) NOT NULL,
  `descripcionMenu` varchar(40) COLLATE utf8_spanish2_ci NOT NULL,
  `icono` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `link` varchar(50) COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id_menu`, `descripcionMenu`, `icono`, `link`) VALUES
(1, 'PV', 'fas fa-cash-register', '/pv/add'),
(2, 'Transacciones', 'fas fa-exchange-alt', '/corteCaja/transacciones'),
(3, 'Pagos Pendientes', 'fas fa-file-invoice-dollar', '/clientes/pagos'),
(4, 'Inventario', 'fas fa-dolly-flatbed', '/inventario'),
(5, 'Productos', 'fas fa-gifts', '/productos/list'),
(6, 'Clientes', 'fas fa-money-check-alt', '/clientes/list'),
(7, 'Reportes', 'fas fa-chart-bar', '/reportes/'),
(8, 'Usuarios', 'fas fa-users', '/usuarios/list'),
(9, 'Configuración', 'fas fa-cog', '/corteCaja/configuracion'),
(10, 'Corte de Caja', 'fas fa-cash-register', '/corteCaja');

-- --------------------------------------------------------

--
-- Table structure for table `producto`
--

CREATE TABLE `producto` (
  `idProd` int(11) NOT NULL,
  `nombreProd` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `codigoProd` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `precioProd` double NOT NULL,
  `precioVentaProd` double NOT NULL,
  `cantidadProd` int(11) NOT NULL,
  `minimoStock` int(11) NOT NULL,
  `idCategoria` int(11) NOT NULL,
  `estatusProd` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('_DSzLrXNBvMJmTpk4FhIsi3fQwjpLTG9', 1634142221, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":1}}');

-- --------------------------------------------------------

--
-- Table structure for table `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `idTipoUser` int(11) NOT NULL,
  `descripcionTipo` varchar(50) COLLATE utf8_spanish2_ci NOT NULL,
  `estatusTipoUser` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Dumping data for table `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`idTipoUser`, `descripcionTipo`, `estatusTipoUser`) VALUES
(1, 'Admin', 1),
(2, 'Vendedor', 1);

-- --------------------------------------------------------

--
-- Table structure for table `transaccion`
--

CREATE TABLE `transaccion` (
  `idTransaccion` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL DEFAULT 0,
  `totalTransaccion` double NOT NULL,
  `fechaOperacion` datetime NOT NULL DEFAULT current_timestamp(),
  `estatusTransaccion` int(11) NOT NULL,
  `idCorte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaccion_detalle`
--

CREATE TABLE `transaccion_detalle` (
  `idTransaccionDetalle` int(11) NOT NULL,
  `idTransaccion` int(11) NOT NULL,
  `idProd` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `idUser` int(11) NOT NULL,
  `nombreUser` varchar(120) COLLATE utf8_spanish2_ci NOT NULL,
  `username` varchar(25) COLLATE utf8_spanish2_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_spanish2_ci NOT NULL,
  `estatusUser` int(11) NOT NULL DEFAULT 1,
  `tipoUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`idUser`, `nombreUser`, `username`, `password`, `estatusUser`, `tipoUsuario`) VALUES
(1, 'Administrador', 'admin', '$2a$10$ohxlIhQ2.RBUwJ3CCzgc0OvDGNhEV1jKt1GF08f0up7bbgiRAH.qS', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `abono_cliente`
--
ALTER TABLE `abono_cliente`
  ADD PRIMARY KEY (`idAbono`);

--
-- Indexes for table `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`idCategoria`);

--
-- Indexes for table `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`idCliente`);

--
-- Indexes for table `configuracion_pv`
--
ALTER TABLE `configuracion_pv`
  ADD PRIMARY KEY (`id_configuracion_pv`);

--
-- Indexes for table `corte_caja`
--
ALTER TABLE `corte_caja`
  ADD PRIMARY KEY (`idCorte`);

--
-- Indexes for table `detalle_menu_tipo`
--
ALTER TABLE `detalle_menu_tipo`
  ADD PRIMARY KEY (`id_detalle_menu`);

--
-- Indexes for table `flagtickets`
--
ALTER TABLE `flagtickets`
  ADD PRIMARY KEY (`idFlagTickets`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id_menu`);

--
-- Indexes for table `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`idProd`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD PRIMARY KEY (`idTipoUser`);

--
-- Indexes for table `transaccion`
--
ALTER TABLE `transaccion`
  ADD PRIMARY KEY (`idTransaccion`);

--
-- Indexes for table `transaccion_detalle`
--
ALTER TABLE `transaccion_detalle`
  ADD PRIMARY KEY (`idTransaccionDetalle`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUser`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `abono_cliente`
--
ALTER TABLE `abono_cliente`
  MODIFY `idAbono` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categoria`
--
ALTER TABLE `categoria`
  MODIFY `idCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cliente`
--
ALTER TABLE `cliente`
  MODIFY `idCliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `configuracion_pv`
--
ALTER TABLE `configuracion_pv`
  MODIFY `id_configuracion_pv` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `corte_caja`
--
ALTER TABLE `corte_caja`
  MODIFY `idCorte` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detalle_menu_tipo`
--
ALTER TABLE `detalle_menu_tipo`
  MODIFY `id_detalle_menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `flagtickets`
--
ALTER TABLE `flagtickets`
  MODIFY `idFlagTickets` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id_menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `producto`
--
ALTER TABLE `producto`
  MODIFY `idProd` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `idTipoUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `transaccion`
--
ALTER TABLE `transaccion`
  MODIFY `idTransaccion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaccion_detalle`
--
ALTER TABLE `transaccion_detalle`
  MODIFY `idTransaccionDetalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
