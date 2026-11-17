<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * api/login.php  —  POST /api/login.php
 *
 * Controlador del UC7 Iniciar y cerrar sesión.
 *
 * Entrada (JSON): { email, password }
 * Salidas: 200 OK             credenciales correctas, sesión abierta
 *          400 Bad Request    faltan datos
 *          401 Unauthorized   e-mail o contraseña incorrectos
 *          500 Internal Error falla de base de datos
 *
 * OWASP A02: la comparación la hace password_verify(), que vuelve a hashear
 * lo que escribió el usuario con la misma sal guardada en el hash y compara
 * en tiempo constante. Nunca se descifra nada: BCRYPT no es reversible.
 * OWASP A07: el mensaje de error es el mismo si el e-mail no existe o si la
 * contraseña está mal, así nadie puede usar el login para averiguar qué
 * e-mails están registrados (enumeración de usuarios).
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/respuesta.php';
require_once __DIR__ . '/../config/sesion.php';
require_once __DIR__ . '/../models/UsuarioModel.php';

exigirMetodo(['POST']);
iniciarSesionSegura();

$datos = leerCuerpoJson();

$email    = campoTexto($datos, 'email');
$password = isset($datos['password']) ? (string) $datos['password'] : '';

if ($email === '' || $password === '') {
    errorJson(400, 'Completá el e-mail y la contraseña.');
}

try {
    $modelo  = new UsuarioModel();
    $usuario = $modelo->buscarPorEmail($email);

    if ($usuario === null || !password_verify($password, $usuario['password'])) {
        errorJson(401, 'El e-mail o la contraseña no son correctos.');
    }

    // El hash no sale del servidor: se arma un arreglo sin la clave password.
    $publico = [
        'id'     => (int) $usuario['id'],
        'nombre' => $usuario['nombre'],
        'email'  => $usuario['email'],
        'rol'    => $usuario['rol'],
    ];

    // Renueva el identificador de sesión (session_regenerate_id) para evitar
    // fijación de sesión, y recién después guarda al usuario.
    abrirSesionUsuario($publico);

    exito(200, ['usuario' => $publico]);
} catch (PDOException $error) {
    registrarFalla('login', $error);
    errorJson(500, 'No pudimos verificar tus credenciales. Intentá de nuevo.');
}
