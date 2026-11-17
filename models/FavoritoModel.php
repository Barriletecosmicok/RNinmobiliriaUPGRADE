<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * models/FavoritoModel.php
 *
 * Trazabilidad: UC8 Guardar propiedad favorita.
 *
 * Cambio respecto de la AE1: antes los favoritos vivían en el localStorage del
 * navegador, así que se perdían al cambiar de equipo y cualquiera podía
 * editarlos a mano. Ahora son filas de la tabla favoritos, atadas al usuario
 * por clave foránea, y sólo se tocan con una sesión activa en el servidor.
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class FavoritoModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    /** Ids de las propiedades que el usuario marcó. Es lo que pinta los corazones. */
    public function idsDeUsuario(int $usuarioId): array
    {
        $sentencia = $this->db->prepare(
            'SELECT propiedad_id
               FROM favoritos
              WHERE usuario_id = :usuario_id
              ORDER BY creado_en DESC'
        );
        $sentencia->execute([':usuario_id' => $usuarioId]);

        // Devuelve [1, 3] en vez de [['propiedad_id' => 1], ...]
        return array_map('intval', $sentencia->fetchAll(PDO::FETCH_COLUMN));
    }

    /** Listado con los datos visibles de cada propiedad favorita. */
    public function listarDeUsuario(int $usuarioId): array
    {
        $sentencia = $this->db->prepare(
            'SELECT p.id, p.slug, p.titulo, p.tipo, p.barrio, p.precio, p.superficie, p.ambientes
               FROM favoritos fa
               JOIN propiedades p ON p.id = fa.propiedad_id
              WHERE fa.usuario_id = :usuario_id
              ORDER BY fa.creado_en DESC'
        );
        $sentencia->execute([':usuario_id' => $usuarioId]);

        // MySQL devuelve DECIMAL como cadena para no perder precisión; se
        // convierte acá para que el JSON lleve un número y la SPA pueda
        // formatearlo con Intl.NumberFormat sin parsear.
        return array_map(static function (array $fila): array {
            $fila['id']         = (int) $fila['id'];
            $fila['precio']     = (float) $fila['precio'];
            $fila['superficie'] = (int) $fila['superficie'];
            $fila['ambientes']  = $fila['ambientes'] === null ? null : (int) $fila['ambientes'];

            return $fila;
        }, $sentencia->fetchAll());
    }

    /**
     * Marca una propiedad como favorita.
     * INSERT IGNORE apoyado en la clave UNIQUE (usuario_id, propiedad_id):
     * si ya estaba marcada, MySQL descarta el insert sin lanzar error.
     */
    public function agregar(int $usuarioId, int $propiedadId): bool
    {
        $sentencia = $this->db->prepare(
            'INSERT IGNORE INTO favoritos (usuario_id, propiedad_id)
             VALUES (:usuario_id, :propiedad_id)'
        );
        $sentencia->execute([
            ':usuario_id'   => $usuarioId,
            ':propiedad_id' => $propiedadId,
        ]);

        return $sentencia->rowCount() > 0;
    }

    /** Quita la marca. El usuario_id va en el WHERE: nadie borra favoritos ajenos. */
    public function quitar(int $usuarioId, int $propiedadId): bool
    {
        $sentencia = $this->db->prepare(
            'DELETE FROM favoritos
              WHERE usuario_id = :usuario_id
                AND propiedad_id = :propiedad_id'
        );
        $sentencia->execute([
            ':usuario_id'   => $usuarioId,
            ':propiedad_id' => $propiedadId,
        ]);

        return $sentencia->rowCount() > 0;
    }
}
