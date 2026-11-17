<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * api/registro.php  —  POST /api/registro.php
 *
 * Controlador del UC6 Registrarse.
 *
 * Entrada  (JSON): { nombre, email, password, password2 }
 * Salidas: 201 Created        cuenta creada y sesión abierta
 *          400 Bad Request    faltan datos o no pasan la validación
 *          409 Conflict       ya existe una cuenta con ese e-mail
 *          500 Internal Error falla de base de datos
 *
 * OWASP A02 (Fallas criptográficas): la contraseña se guarda con
 * password_hash() usando BCRYPT. En la base queda un hash de 60 caracteres;
 * el texto plano no se escribe en ningún lado, ni en la base ni en el log.
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/respuesta.php';
require_once __DIR__ . '/../config/sesion.php';
require_once __DIR__ . '/../models/UsuarioModel.php';

exigirMetodo(['POST']);
iniciarSesionSegura();

$datos = leerCuerpoJson();

$nombre    = campoTexto($datos, 'nombre');
$email     = campoTexto($datos, 'email');
$password  = isset($datos['password'])  ? (string) $datos['password']  : '';
$password2 = isset($datos['password2']) ? (string) $datos['password2'] : '';

/* ------------------------------------------------------------------
   Validación en el servidor.
   El front también valida, pero esa validación es ayuda para el usuario,
   no una defensa: cualquiera puede mandar un POST sin pasar por el
   formulario. La única validación que cuenta es esta.
   ------------------------------------------------------------------ */
$errores = [];

if (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 100) {
    $errores['nombre'] = 'El nombre debe tener entre 3 y 100 caracteres.';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {
    $errores['email'] = 'Ingresá un e-mail válido.';
}

if (strlen($password) < 8) {
    $errores['password'] = 'La contraseña debe tener al menos 8 caracteres.';
}

if ($password !== $password2) {
    $errores['password2'] = 'Las contraseñas no coinciden.';
}

if ($errores !== []) {
    errorJson(400, 'Revisá los datos del formulario.', $errores);
}

try {
    $modelo = new UsuarioModel();

    if ($modelo->existeEmail($email)) {
        errorJson(409, 'Ya existe una cuenta con ese e-mail. Probá ingresar.');
    }

    // PASSWORD_BCRYPT con el costo por defecto (10).
    $hash = password_hash($password, PASSWORD_BCRYPT);

    $id = $modelo->crear($nombre, $email, $hash, 'cliente');

    $usuario = [
        'id'     => $id,
        'nombre' => $nombre,
        'email'  => $email,
        'rol'    => 'cliente',
    ];

    // Se deja la sesión iniciada para que el usuario no tenga que loguearse
    // inmediatamente después de registrarse.
    abrirSesionUsuario($usuario);

    exito(201, ['usuario' => $usuario]);
} catch (PDOException $error) {
    registrarFalla('registro', $error);
    errorJson(500, 'No pudimos crear la cuenta. Intentá de nuevo en unos minutos.');
}
