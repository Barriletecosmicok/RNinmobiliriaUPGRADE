<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * config/sesion.php
 *
 * Gestión de sesiones del lado del servidor (OWASP A01 Control de acceso roto
 * y A07 Fallas de identificación y autenticación).
 *
 * Idea central: el navegador NO decide si alguien está autenticado. El cliente
 * sólo guarda una cookie con el identificador de sesión; los datos del usuario
 * viven en $_SESSION, en el servidor. Por eso un visitante no puede "fingir"
 * ser agente editando localStorage, como sí podía pasar en la versión de AE1.
 */
declare(strict_types=1);

require_once __DIR__ . '/respuesta.php';

/**
 * Arranca la sesión con parámetros de cookie endurecidos.
 * Hay que llamarla ANTES de escribir cualquier salida.
 */
function iniciarSesionSegura(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_set_cookie_params([
        'httponly' => true,   // JavaScript no puede leer la cookie: frena el robo por XSS
        'samesite' => 'Lax',  // la cookie no viaja en peticiones de otros sitios (CSRF)
        'path'     => '/',
        // 'secure' => true,  // activarlo cuando el sitio se publique con HTTPS
    ]);

    session_start();
}

/**
 * Guarda al usuario en la sesión después de un login correcto.
 * session_regenerate_id(true) cambia el identificador y borra el anterior:
 * si un atacante conocía el ID previo, deja de servirle (session fixation).
 */
function abrirSesionUsuario(array $usuario): void
{
    session_regenerate_id(true);

    $_SESSION['usuario'] = [
        'id'     => (int) $usuario['id'],
        'nombre' => $usuario['nombre'],
        'email'  => $usuario['email'],
        'rol'    => $usuario['rol'],
    ];
    $_SESSION['iniciada_en'] = time();
}

/** Cierra la sesión: vacía los datos, destruye el archivo y vence la cookie. */
function cerrarSesionUsuario(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }

    session_destroy();
}

/** Devuelve el usuario autenticado o null si la petición es anónima. */
function usuarioEnSesion(): ?array
{
    return $_SESSION['usuario'] ?? null;
}

/**
 * Puerta de entrada de todo recurso protegido.
 * Si la petición es anónima corta la ejecución con 401 Unauthorized, tal como
 * pide la consigna, y devuelve un JSON que la SPA usa para mandar al login.
 */
function exigirSesion(): array
{
    $usuario = usuarioEnSesion();

    if ($usuario === null) {
        errorJson(401, 'Necesitás iniciar sesión para acceder a este recurso.');
    }

    return $usuario;
}

/**
 * Exige además un rol determinado.
 * Diferencia importante para el coloquio: 401 es "no sé quién sos",
 * 403 es "sé quién sos y no te alcanza". Un cliente autenticado que intenta
 * borrar una propiedad recibe 403, no 401.
 */
function exigirRol(string $rol): array
{
    $usuario = exigirSesion();

    if ($usuario['rol'] !== $rol) {
        errorJson(403, 'Tu cuenta no tiene permisos para esta operación.');
    }

    return $usuario;
}
