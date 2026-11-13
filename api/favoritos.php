<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * api/favoritos.php  —  recurso REST "favoritos"
 *
 * Controlador del UC8 Guardar propiedad favorita.
 *
 *   GET    /api/favoritos.php              propiedades favoritas del usuario
 *   POST   /api/favoritos.php              { propiedad_id }  marca una
 *   DELETE /api/favoritos.php?propiedad_id=1                 la desmarca
 *
 * Todo el recurso está protegido: la primera línea de cada rama llama a
 * exigirSesion(), que corta con 401 Unauthorized si la petición es anónima
 * (OWASP A01). El usuario_id NO viene del cliente, se toma de $_SESSION: así
 * nadie puede guardar o borrar favoritos en la cuenta de otra persona
 * (referencia directa insegura a objetos).
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/respuesta.php';
require_once __DIR__ . '/../config/sesion.php';
require_once __DIR__ . '/../models/FavoritoModel.php';
require_once __DIR__ . '/../models/PropiedadModel.php';

$metodo = exigirMetodo(['GET', 'POST', 'DELETE']);
iniciarSesionSegura();

$usuario   = exigirSesion();
$usuarioId = (int) $usuario['id'];

try {
    $modelo = new FavoritoModel();

    if ($metodo === 'GET') {
        exito(200, [
            'favoritos' => $modelo->listarDeUsuario($usuarioId),
            'ids'       => $modelo->idsDeUsuario($usuarioId),
        ]);
    }

    if ($metodo === 'POST') {
        $datos = leerCuerpoJson();
        $propiedadId = filter_var($datos['propiedad_id'] ?? null, FILTER_VALIDATE_INT);

        if ($propiedadId === false || $propiedadId < 1) {
            errorJson(400, 'Falta el id de la propiedad.');
        }

        // Se verifica que la propiedad exista antes de insertar: si no, la
        // clave foránea lanzaría una excepción y el cliente vería un 500.
        if (!(new PropiedadModel())->idsValidos([$propiedadId])) {
            errorJson(404, 'Esa propiedad no está disponible.');
        }

        $agregado = $modelo->agregar($usuarioId, $propiedadId);

        exito($agregado ? 201 : 200, [
            'mensaje' => $agregado ? 'Propiedad agregada a favoritos.' : 'Ya estaba en favoritos.',
            'ids'     => $modelo->idsDeUsuario($usuarioId),
        ]);
    }

    if ($metodo === 'DELETE') {
        $propiedadId = filter_var($_GET['propiedad_id'] ?? null, FILTER_VALIDATE_INT);

        if ($propiedadId === false || $propiedadId < 1) {
            errorJson(400, 'Falta el id de la propiedad.');
        }

        if (!$modelo->quitar($usuarioId, $propiedadId)) {
            errorJson(404, 'Esa propiedad no estaba entre tus favoritos.');
        }

        exito(200, [
            'mensaje' => 'Propiedad quitada de favoritos.',
            'ids'     => $modelo->idsDeUsuario($usuarioId),
        ]);
    }
} catch (PDOException $error) {
    registrarFalla('favoritos/' . $metodo, $error);
    errorJson(500, 'No pudimos actualizar tus favoritos. Intentá de nuevo.');
}
