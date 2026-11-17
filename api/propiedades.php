<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * api/propiedades.php  —  recurso REST "propiedades"
 *
 * Controlador de los casos de uso del catálogo:
 *   UC1 Consultar catálogo de propiedades        GET  /api/propiedades.php
 *   UC2 Filtrar propiedades por tipo         GET  /api/propiedades.php?tipo=casa
 *   UC3 Ver ficha de una propiedad   GET  /api/propiedades.php?id=1
 *   UC9 Gestionar propiedades    POST / PUT / DELETE  (sólo rol agente)
 *
 * Control de acceso (OWASP A01): la lectura es pública porque el catálogo es
 * público, pero cualquier operación que escriba exige sesión con rol agente,
 * verificada en el servidor con $_SESSION. Que el botón "Eliminar" no se vea
 * en la interfaz no es seguridad: la seguridad está acá.
 *
 * Códigos: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized,
 *          403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Error
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/respuesta.php';
require_once __DIR__ . '/../config/sesion.php';
require_once __DIR__ . '/../models/PropiedadModel.php';

const TIPOS_VALIDOS = ['casa', 'terreno', 'departamento', 'local'];

$metodo = exigirMetodo(['GET', 'POST', 'PUT', 'DELETE']);
iniciarSesionSegura();

/**
 * Valida y normaliza los datos de una propiedad que llegan del panel del agente.
 *
 * @return array{0: array, 1: array} Datos normalizados y errores por campo.
 */
function validarPropiedad(array $datos): array
{
    $errores = [];

    $titulo = campoTexto($datos, 'titulo');
    if (mb_strlen($titulo) < 5 || mb_strlen($titulo) > 150) {
        $errores['titulo'] = 'El título debe tener entre 5 y 150 caracteres.';
    }

    $tipo = campoTexto($datos, 'tipo');
    if (!in_array($tipo, TIPOS_VALIDOS, true)) {
        $errores['tipo'] = 'El tipo debe ser casa, terreno, departamento o local.';
    }

    $barrio = campoTexto($datos, 'barrio');
    if ($barrio === '' || mb_strlen($barrio) > 120) {
        $errores['barrio'] = 'Indicá el barrio y la ciudad.';
    }

    // filter_var con FILTER_VALIDATE_* rechaza texto donde se espera un número.
    $precio = filter_var($datos['precio'] ?? null, FILTER_VALIDATE_FLOAT);
    if ($precio === false || $precio <= 0) {
        $errores['precio'] = 'El precio debe ser un número mayor que cero.';
    }

    $superficie = filter_var($datos['superficie'] ?? null, FILTER_VALIDATE_INT);
    if ($superficie === false || $superficie <= 0) {
        $errores['superficie'] = 'La superficie debe ser un número entero de metros cuadrados.';
    }

    // Los terrenos no tienen ambientes: el campo acepta null a propósito.
    $ambientes = null;
    if (isset($datos['ambientes']) && $datos['ambientes'] !== '' && $datos['ambientes'] !== null) {
        $ambientes = filter_var($datos['ambientes'], FILTER_VALIDATE_INT);
        if ($ambientes === false || $ambientes < 1) {
            $errores['ambientes'] = 'Los ambientes deben ser un número entero mayor que cero.';
        }
    }

    $descripcion = campoTexto($datos, 'descripcion');

    // El slug sale del título si el agente no lo escribe.
    $slug = campoTexto($datos, 'slug');
    if ($slug === '') {
        $slug = generarSlug($titulo);
    }
    if (!preg_match('/^[a-z0-9-]{3,80}$/', $slug)) {
        $errores['slug'] = 'El identificador sólo admite minúsculas, números y guiones.';
    }

    // Fotos: cada una necesita ruta y texto alternativo (WCAG 2.1, criterio 1.1.1).
    $fotos = [];
    if (isset($datos['fotos']) && is_array($datos['fotos'])) {
        foreach ($datos['fotos'] as $foto) {
            if (!is_array($foto)) {
                continue;
            }
            $ruta = campoTexto($foto, 'ruta');
            $alt  = campoTexto($foto, 'texto_alt');
            if ($ruta === '' || $alt === '') {
                $errores['fotos'] = 'Cada foto necesita su ruta y su texto alternativo.';
                break;
            }
            $fotos[] = ['ruta' => $ruta, 'texto_alt' => $alt];
        }
    }

    $normalizados = [
        'slug'        => $slug,
        'titulo'      => $titulo,
        'tipo'        => $tipo,
        'barrio'      => $barrio,
        'precio'      => $precio === false ? 0 : $precio,
        'superficie'  => $superficie === false ? 0 : $superficie,
        'ambientes'   => $ambientes,
        'descripcion' => $descripcion === '' ? null : $descripcion,
        'destacada'   => !empty($datos['destacada']),
        'activa'      => !isset($datos['activa']) || !empty($datos['activa']),
        'fotos'       => $fotos,
    ];

    return [$normalizados, $errores];
}

/** Convierte "Casa en Villa Sarita" en "casa-en-villa-sarita". */
function generarSlug(string $texto): string
{
    $sinTildes = iconv('UTF-8', 'ASCII//TRANSLIT', $texto);
    $sinTildes = $sinTildes === false ? $texto : $sinTildes;
    $minusculas = strtolower($sinTildes);
    $limpio = preg_replace('/[^a-z0-9]+/', '-', $minusculas) ?? '';

    return trim($limpio, '-');
}

/** Lee el id de la query string y lo valida como entero positivo. */
function idDeLaUrl(): ?int
{
    if (!isset($_GET['id'])) {
        return null;
    }

    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);

    return ($id === false || $id < 1) ? null : $id;
}

try {
    $modelo = new PropiedadModel();

    /* =============================== GET =============================== */
    if ($metodo === 'GET') {
        $id = idDeLaUrl();

        // Ficha individual (UC3)
        if (isset($_GET['id'])) {
            if ($id === null) {
                errorJson(400, 'El id de la propiedad no es válido.');
            }

            $propiedad = $modelo->buscarPorId($id);

            if ($propiedad === null) {
                errorJson(404, 'No encontramos esa propiedad.');
            }

            // Una propiedad dada de baja sólo la ve el agente.
            if ($propiedad['activa'] === false && (usuarioEnSesion()['rol'] ?? '') !== 'agente') {
                errorJson(404, 'No encontramos esa propiedad.');
            }

            exito(200, ['propiedad' => $propiedad]);
        }

        // Listado para el panel del agente: incluye las dadas de baja.
        if (isset($_GET['todas'])) {
            exigirRol('agente');
            exito(200, ['propiedades' => $modelo->listar(null, true)]);
        }

        // Catálogo público, con filtro opcional por tipo (UC1)
        $tipo = isset($_GET['tipo']) ? (string) $_GET['tipo'] : '';

        if ($tipo !== '' && $tipo !== 'todas' && !in_array($tipo, TIPOS_VALIDOS, true)) {
            errorJson(400, 'El tipo de propiedad solicitado no existe.');
        }

        $filtro = ($tipo === '' || $tipo === 'todas') ? null : $tipo;

        exito(200, ['propiedades' => $modelo->listar($filtro)]);
    }

    /* =============================== POST ============================== */
    if ($metodo === 'POST') {
        exigirRol('agente');

        [$datos, $errores] = validarPropiedad(leerCuerpoJson());

        if ($errores !== []) {
            errorJson(400, 'Revisá los datos de la propiedad.', $errores);
        }

        if ($modelo->existeSlug($datos['slug'])) {
            errorJson(409, 'Ya hay una propiedad con ese identificador.', ['slug' => 'Identificador repetido.']);
        }

        $id = $modelo->crear($datos, $datos['fotos']);

        // 201 Created: se creó un recurso nuevo y se informa dónde encontrarlo.
        header('Location: propiedades.php?id=' . $id);
        exito(201, ['propiedad' => $modelo->buscarPorId($id)]);
    }

    /* =============================== PUT =============================== */
    if ($metodo === 'PUT') {
        exigirRol('agente');

        $id = idDeLaUrl();
        if ($id === null) {
            errorJson(400, 'Falta el id de la propiedad a modificar.');
        }

        if ($modelo->buscarPorId($id) === null) {
            errorJson(404, 'No encontramos esa propiedad.');
        }

        [$datos, $errores] = validarPropiedad(leerCuerpoJson());

        if ($errores !== []) {
            errorJson(400, 'Revisá los datos de la propiedad.', $errores);
        }

        if ($modelo->existeSlug($datos['slug'], $id)) {
            errorJson(409, 'Ya hay otra propiedad con ese identificador.', ['slug' => 'Identificador repetido.']);
        }

        $modelo->actualizar($id, $datos, $datos['fotos']);

        exito(200, ['propiedad' => $modelo->buscarPorId($id)]);
    }

    /* ============================== DELETE ============================= */
    if ($metodo === 'DELETE') {
        exigirRol('agente');

        $id = idDeLaUrl();
        if ($id === null) {
            errorJson(400, 'Falta el id de la propiedad a eliminar.');
        }

        if (!$modelo->eliminar($id)) {
            errorJson(404, 'No encontramos esa propiedad.');
        }

        exito(200, ['mensaje' => 'Propiedad eliminada.', 'id' => $id]);
    }
} catch (PDOException $error) {
    // La excepción se registra completa en el log del servidor, pero al cliente
    // sólo le llega un mensaje genérico: nunca la consulta ni el nombre de la
    // tabla que falló (OWASP A09, exposición de información sensible).
    registrarFalla('propiedades/' . $metodo, $error);
    errorJson(500, 'Hubo un problema con la base de datos. Intentá de nuevo.');
}
