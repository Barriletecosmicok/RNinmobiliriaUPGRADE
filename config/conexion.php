<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * config/conexion.php
 *
 * Conexión única (patrón Singleton) a MySQL mediante PDO.
 *
 * ¿Por qué Singleton? Cada endpoint de /api necesita la base, pero abrir una
 * conexión nueva por cada modelo desperdicia recursos del servidor. Con este
 * patrón la primera llamada crea la conexión y las siguientes reutilizan
 * exactamente el mismo objeto PDO durante la vida de la petición.
 *
 * ISO/IEC 25010 — Mantenibilidad: los datos de acceso viven en un solo lugar.
 * ISO/IEC 25010 — Fiabilidad: ERRMODE_EXCEPTION obliga a manejar los errores
 * con try/catch en vez de dejarlos pasar en silencio.
 */
declare(strict_types=1);

final class Conexion
{
    /** Datos de acceso del entorno local XAMPP (root sin contraseña por defecto). */
    private const HOST    = 'localhost';
    private const PUERTO  = 3306;
    private const BASE    = 'rn_inmobiliaria';
    private const USUARIO = 'root';
    private const CLAVE   = '';

    /** Única instancia de PDO de toda la aplicación. */
    private static ?PDO $instancia = null;

    /** Constructor privado: nadie puede hacer "new Conexion()" desde afuera. */
    private function __construct()
    {
    }

    /** Clonar también queda prohibido, así no aparece una segunda instancia. */
    private function __clone()
    {
    }

    /**
     * Devuelve la conexión PDO. La crea sólo la primera vez que se la pide.
     *
     * @throws PDOException si el servidor MySQL no responde o la base no existe.
     *                      Cada endpoint la captura y responde 500 sin filtrar
     *                      datos internos del servidor (OWASP A09).
     */
    public static function obtener(): PDO
    {
        if (self::$instancia === null) {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
                self::HOST,
                self::PUERTO,
                self::BASE
            );

            self::$instancia = new PDO($dsn, self::USUARIO, self::CLAVE, [
                // Los errores de SQL se convierten en excepciones PDOException.
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                // Cada fila llega como arreglo asociativo, listo para json_encode().
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                // Prepared statements REALES del motor, no emulados por el driver.
                // Es la defensa de fondo contra inyección SQL (OWASP A03): los
                // parámetros viajan separados de la sentencia y el motor nunca
                // los interpreta como código.
                PDO::ATTR_EMULATE_PREPARES   => false,
                // Los INT y DECIMAL llegan como números, no como cadenas.
                PDO::ATTR_STRINGIFY_FETCHES  => false,
            ]);
        }

        return self::$instancia;
    }
}
