<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * config/respuesta.php
 *
 * Funciones compartidas por todos los endpoints para hablar JSON y devolver
 * códigos de estado HTTP con significado. Están acá para no repetir la misma
 * cabecera en los siete archivos de /api (ISO 25010 — Mantenibilidad).
 */
declare(strict_types=1);

/**
 * Cierra la petición devolviendo JSON con su código HTTP.
 *
 * @param int   $codigo Código de estado: 200, 201, 400, 401, 403, 404, 500...
 * @param array $cuerpo Datos que se serializan con json_encode().
 */
function responder(int $codigo, array $cuerpo): void
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    // X-Content-Type-Options evita que el navegador "adivine" otro tipo de
    // contenido y ejecute la respuesta como si fuera HTML (OWASP A05).
    header('X-Content-Type-Options: nosniff');

    echo json_encode($cuerpo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Respuesta de error con un mensaje pensado para mostrarle al usuario.
 * Nunca incluye el detalle técnico de la excepción: ese se registra en el log
 * del servidor con error_log() y no se filtra al cliente (OWASP A09).
 */
function errorJson(int $codigo, string $mensaje, array $campos = []): void
{
    $cuerpo = ['ok' => false, 'mensaje' => $mensaje];
    if ($campos !== []) {
        $cuerpo['campos'] = $campos;
    }
    responder($codigo, $cuerpo);
}

/** Respuesta exitosa: agrega ok = true al cuerpo. */
function exito(int $codigo, array $cuerpo = []): void
{
    responder($codigo, array_merge(['ok' => true], $cuerpo));
}

/**
 * Lee el cuerpo de la petición cuando viene como JSON (lo que manda fetch()).
 * Si el JSON está mal formado corta con 400 Bad Request.
 */
function leerCuerpoJson(): array
{
    $crudo = file_get_contents('php://input');

    if ($crudo === false || trim($crudo) === '') {
        return [];
    }

    $datos = json_decode($crudo, true);

    if (!is_array($datos)) {
        errorJson(400, 'El cuerpo de la petición no es un JSON válido.');
    }

    return $datos;
}

/**
 * Verifica que el método HTTP usado esté entre los permitidos por el endpoint.
 * Si no lo está responde 405 Method Not Allowed y anuncia los válidos.
 */
function exigirMetodo(array $permitidos): string
{
    $metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    if (!in_array($metodo, $permitidos, true)) {
        header('Allow: ' . implode(', ', $permitidos));
        errorJson(405, 'Método HTTP no permitido en este recurso.');
    }

    return $metodo;
}

/**
 * Devuelve un campo de texto del arreglo recibido, ya recortado.
 * Centralizar la lectura evita el clásico "Undefined array key" y deja la
 * validación de cada endpoint más corta de leer.
 */
function campoTexto(array $datos, string $clave): string
{
    return isset($datos[$clave]) && is_scalar($datos[$clave])
        ? trim((string) $datos[$clave])
        : '';
}

/** Registra el detalle técnico de una excepción en el log del servidor. */
function registrarFalla(string $contexto, Throwable $error): void
{
    error_log(sprintf('[RN-API][%s] %s', $contexto, $error->getMessage()));
}
