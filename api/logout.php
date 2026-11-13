<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * api/logout.php  —  POST /api/logout.php
 *
 * Cierra la sesión del lado del servidor. Se usa POST y no GET porque es una
 * operación que cambia el estado del sistema: un GET podría dispararse solo
 * desde una imagen o un prefetch del navegador.
 *
 * Salidas: 200 OK  sesión cerrada (también si no había ninguna abierta)
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/respuesta.php';
require_once __DIR__ . '/../config/sesion.php';

exigirMetodo(['POST']);
iniciarSesionSegura();

cerrarSesionUsuario();

exito(200, ['mensaje' => 'Sesión cerrada.']);
