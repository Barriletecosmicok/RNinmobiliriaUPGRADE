<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * api/sesion.php  —  GET /api/sesion.php
 *
 * Le dice a la SPA quién está autenticado. Es la pieza que reemplaza al
 * sessionStorage de la AE1: al cargar la página, el cliente pregunta al
 * servidor por la sesión en vez de confiar en lo que tiene guardado el
 * navegador. De esto depende la visibilidad por audiencia del modelo VSDM
 * que ya se había diseñado en el Startup Relámpago.
 *
 * Salidas: 200 OK con { autenticado: true, usuario }
 *          200 OK con { autenticado: false } si la petición es anónima
 *
 * Devuelve 200 y no 401 porque preguntar "¿hay sesión?" es una consulta
 * legítima de cualquier visitante; el 401 queda para los recursos protegidos.
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/respuesta.php';
require_once __DIR__ . '/../config/sesion.php';
require_once __DIR__ . '/../models/FavoritoModel.php';

exigirMetodo(['GET']);
iniciarSesionSegura();

$usuario = usuarioEnSesion();

if ($usuario === null) {
    exito(200, ['autenticado' => false]);
}

try {
    // Se envían también los favoritos para que la primera pintada de las
    // tarjetas ya muestre los corazones marcados sin una segunda petición.
    $favoritos = (new FavoritoModel())->idsDeUsuario((int) $usuario['id']);

    exito(200, [
        'autenticado' => true,
        'usuario'     => $usuario,
        'favoritos'   => $favoritos,
    ]);
} catch (PDOException $error) {
    registrarFalla('sesion', $error);
    errorJson(500, 'No pudimos recuperar los datos de tu sesión.');
}
