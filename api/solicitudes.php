<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * api/solicitudes.php  —  recurso REST "solicitudes de compra"
 *
 * Controlador del UC4 Completar formulario de compra.
 *
 *   POST  /api/solicitudes.php            el cliente envía la solicitud
 *   GET   /api/solicitudes.php            el cliente ve las suyas
 *   GET   /api/solicitudes.php?todas=1    el agente ve todas (rol agente)
 *   PATCH /api/solicitudes.php?id=1       el agente cambia el estado
 *
 * En la AE1 este formulario tenía action="#": los datos no iban a ningún lado.
 * Ahora el envío viaja por fetch() y queda registrado en dos tablas dentro de
 * una transacción. Exige sesión activa, igual que los favoritos.
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/respuesta.php';
require_once __DIR__ . '/../config/sesion.php';
require_once __DIR__ . '/../models/SolicitudModel.php';
require_once __DIR__ . '/../models/PropiedadModel.php';

const MEDIOS_PAGO = ['efectivo', 'transferencia', 'financiacion', 'credito-hipotecario', 'tarjeta'];
const ESTADOS     = ['pendiente', 'contactada', 'cerrada'];

$metodo = exigirMetodo(['GET', 'POST', 'PATCH']);
iniciarSesionSegura();

try {
    $modelo = new SolicitudModel();

    /* =============================== GET =============================== */
    if ($metodo === 'GET') {
        if (isset($_GET['todas'])) {
            exigirRol('agente');
            exito(200, ['solicitudes' => $modelo->listarTodas()]);
        }

        $usuario = exigirSesion();
        exito(200, ['solicitudes' => $modelo->listarDeUsuario((int) $usuario['id'])]);
    }

    /* =============================== POST ============================== */
    if ($metodo === 'POST') {
        $usuario = exigirSesion();
        $datos   = leerCuerpoJson();

        $errores = [];

        $nombre = campoTexto($datos, 'nombre');
        if (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 100) {
            $errores['nombre'] = 'Escribí tu nombre y apellido.';
        }

        $telefono = campoTexto($datos, 'telefono');
        if (!preg_match('/^[0-9+()\s-]{8,40}$/', $telefono)) {
            $errores['telefono'] = 'Ingresá un teléfono válido (entre 8 y 40 caracteres).';
        }

        $direccion = campoTexto($datos, 'direccion');
        if (mb_strlen($direccion) < 5 || mb_strlen($direccion) > 200) {
            $errores['direccion'] = 'Indicá calle, número y barrio.';
        }

        $email = campoTexto($datos, 'email');
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errores['email'] = 'Ingresá un e-mail válido.';
        }

        $medioPago = campoTexto($datos, 'medio_pago');
        if (!in_array($medioPago, MEDIOS_PAGO, true)) {
            $errores['medio_pago'] = 'Elegí un medio de pago de la lista.';
        }

        // El formulario de la AE1 permite marcar una o más propiedades.
        $propiedades = [];
        if (isset($datos['propiedades']) && is_array($datos['propiedades'])) {
            foreach ($datos['propiedades'] as $valor) {
                $id = filter_var($valor, FILTER_VALIDATE_INT);
                if ($id !== false && $id > 0) {
                    $propiedades[] = $id;
                }
            }
            $propiedades = array_values(array_unique($propiedades));
        }

        if ($propiedades === []) {
            $errores['propiedades'] = 'Elegí al menos una propiedad.';
        } elseif (!(new PropiedadModel())->idsValidos($propiedades)) {
            $errores['propiedades'] = 'Alguna de las propiedades elegidas ya no está publicada.';
        }

        $mensaje = campoTexto($datos, 'mensaje');

        if ($errores !== []) {
            errorJson(400, 'Revisá los datos del formulario.', $errores);
        }

        $id = $modelo->crear([
            'usuario_id' => (int) $usuario['id'],
            'nombre'     => $nombre,
            'telefono'   => $telefono,
            'direccion'  => $direccion,
            'email'      => $email,
            'medio_pago' => $medioPago,
            'mensaje'    => $mensaje === '' ? null : $mensaje,
        ], $propiedades);

        exito(201, [
            'solicitud_id' => $id,
            'mensaje'      => 'Recibimos tu solicitud. Nos vamos a contactar a la brevedad.',
        ]);
    }

    /* ============================== PATCH ============================== */
    if ($metodo === 'PATCH') {
        exigirRol('agente');

        $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
        if ($id === false || $id < 1) {
            errorJson(400, 'Falta el id de la solicitud.');
        }

        $estado = campoTexto(leerCuerpoJson(), 'estado');
        if (!in_array($estado, ESTADOS, true)) {
            errorJson(400, 'El estado debe ser pendiente, contactada o cerrada.');
        }

        if (!$modelo->cambiarEstado($id, $estado)) {
            errorJson(404, 'No encontramos esa solicitud.');
        }

        exito(200, ['mensaje' => 'Estado actualizado.', 'id' => $id, 'estado' => $estado]);
    }
} catch (PDOException $error) {
    registrarFalla('solicitudes/' . $metodo, $error);
    errorJson(500, 'No pudimos registrar la solicitud. Intentá de nuevo.');
}
