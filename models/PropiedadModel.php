<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * models/PropiedadModel.php
 *
 * Acceso a datos de propiedades y de sus fotos.
 * Trazabilidad: UC1 Consultar catálogo de propiedades, UC3 Ver ficha de una propiedad y
 * UC9 Gestionar propiedades (alta, modificación y baja del agente).
 *
 * Decisión de diseño: en vez de armar el SQL con "if" y pegar fragmentos de
 * texto, cada variante del listado tiene su propia consulta completa y fija.
 * Así no existe ni una sola concatenación dentro de una sentencia SQL.
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class PropiedadModel
{
    /** Columnas que se devuelven siempre, más las de la foto por el LEFT JOIN. */
    private const COLUMNAS = '
        p.id, p.slug, p.titulo, p.tipo, p.barrio, p.precio, p.superficie,
        p.ambientes, p.descripcion, p.destacada, p.activa,
        f.id AS foto_id, f.ruta AS foto_ruta, f.texto_alt AS foto_alt, f.orden AS foto_orden';

    private const LISTAR_ACTIVAS = 'SELECT ' . self::COLUMNAS . '
          FROM propiedades p
          LEFT JOIN fotos f ON f.propiedad_id = p.id
         WHERE p.activa = 1
         ORDER BY p.destacada DESC, p.id ASC, f.orden ASC';

    private const LISTAR_ACTIVAS_POR_TIPO = 'SELECT ' . self::COLUMNAS . '
          FROM propiedades p
          LEFT JOIN fotos f ON f.propiedad_id = p.id
         WHERE p.activa = 1 AND p.tipo = :tipo
         ORDER BY p.destacada DESC, p.id ASC, f.orden ASC';

    /** El agente ve también las propiedades dadas de baja. */
    private const LISTAR_TODAS = 'SELECT ' . self::COLUMNAS . '
          FROM propiedades p
          LEFT JOIN fotos f ON f.propiedad_id = p.id
         ORDER BY p.destacada DESC, p.id ASC, f.orden ASC';

    private const BUSCAR_POR_ID = 'SELECT ' . self::COLUMNAS . '
          FROM propiedades p
          LEFT JOIN fotos f ON f.propiedad_id = p.id
         WHERE p.id = :id
         ORDER BY f.orden ASC';

    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    /**
     * Listado del catálogo.
     *
     * @param string|null $tipo             'casa' o 'terreno' para filtrar; null trae todo.
     * @param bool        $incluirInactivas true sólo para el panel del agente.
     */
    public function listar(?string $tipo = null, bool $incluirInactivas = false): array
    {
        if ($incluirInactivas) {
            $sentencia = $this->db->prepare(self::LISTAR_TODAS);
            $sentencia->execute();
        } elseif ($tipo !== null) {
            $sentencia = $this->db->prepare(self::LISTAR_ACTIVAS_POR_TIPO);
            $sentencia->execute([':tipo' => $tipo]);
        } else {
            $sentencia = $this->db->prepare(self::LISTAR_ACTIVAS);
            $sentencia->execute();
        }

        return $this->agruparFotos($sentencia->fetchAll());
    }

    /** Ficha completa de una propiedad con todas sus fotos. */
    public function buscarPorId(int $id): ?array
    {
        $sentencia = $this->db->prepare(self::BUSCAR_POR_ID);
        $sentencia->execute([':id' => $id]);

        $propiedades = $this->agruparFotos($sentencia->fetchAll());

        return $propiedades === [] ? null : $propiedades[0];
    }

    /** ¿Existe ese slug? Lo usa el alta para no violar la clave UNIQUE. */
    public function existeSlug(string $slug, ?int $exceptoId = null): bool
    {
        if ($exceptoId === null) {
            $sentencia = $this->db->prepare(
                'SELECT 1 FROM propiedades WHERE slug = :slug LIMIT 1'
            );
            $sentencia->execute([':slug' => $slug]);
        } else {
            $sentencia = $this->db->prepare(
                'SELECT 1 FROM propiedades WHERE slug = :slug AND id <> :id LIMIT 1'
            );
            $sentencia->execute([':slug' => $slug, ':id' => $exceptoId]);
        }

        return $sentencia->fetchColumn() !== false;
    }

    /** ¿Están todos esos ids en la base y publicados? Valida lo que llega del cliente. */
    public function idsValidos(array $ids): bool
    {
        $sentencia = $this->db->prepare(
            'SELECT 1 FROM propiedades WHERE id = :id AND activa = 1 LIMIT 1'
        );

        foreach ($ids as $id) {
            $sentencia->execute([':id' => (int) $id]);
            if ($sentencia->fetchColumn() === false) {
                return false;
            }
        }

        return true;
    }

    /**
     * Alta de propiedad (UC9). Inserta la propiedad y sus fotos dentro de una
     * transacción: si falla una foto, no queda una propiedad a medio cargar.
     */
    public function crear(array $datos, array $fotos): int
    {
        try {
            $this->db->beginTransaction();

            $sentencia = $this->db->prepare(
                'INSERT INTO propiedades
                    (slug, titulo, tipo, barrio, precio, superficie, ambientes, descripcion, destacada, activa)
                 VALUES
                    (:slug, :titulo, :tipo, :barrio, :precio, :superficie, :ambientes, :descripcion, :destacada, :activa)'
            );
            $sentencia->execute([
                ':slug'        => $datos['slug'],
                ':titulo'      => $datos['titulo'],
                ':tipo'        => $datos['tipo'],
                ':barrio'      => $datos['barrio'],
                ':precio'      => $datos['precio'],
                ':superficie'  => $datos['superficie'],
                ':ambientes'   => $datos['ambientes'],
                ':descripcion' => $datos['descripcion'],
                ':destacada'   => $datos['destacada'] ? 1 : 0,
                ':activa'      => $datos['activa'] ? 1 : 0,
            ]);

            $id = (int) $this->db->lastInsertId();
            $this->insertarFotos($id, $fotos);

            $this->db->commit();

            return $id;
        } catch (PDOException $error) {
            // Si algo falló, se deshace todo lo de esta transacción.
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            throw $error;
        }
    }

    /**
     * Modificación de propiedad (UC9).
     * Las fotos se reemplazan por completo: se borran las anteriores y se
     * insertan las nuevas, siempre dentro de la misma transacción.
     */
    public function actualizar(int $id, array $datos, ?array $fotos = null): bool
    {
        try {
            $this->db->beginTransaction();

            $sentencia = $this->db->prepare(
                'UPDATE propiedades
                    SET slug = :slug,
                        titulo = :titulo,
                        tipo = :tipo,
                        barrio = :barrio,
                        precio = :precio,
                        superficie = :superficie,
                        ambientes = :ambientes,
                        descripcion = :descripcion,
                        destacada = :destacada,
                        activa = :activa
                  WHERE id = :id'
            );
            $sentencia->execute([
                ':slug'        => $datos['slug'],
                ':titulo'      => $datos['titulo'],
                ':tipo'        => $datos['tipo'],
                ':barrio'      => $datos['barrio'],
                ':precio'      => $datos['precio'],
                ':superficie'  => $datos['superficie'],
                ':ambientes'   => $datos['ambientes'],
                ':descripcion' => $datos['descripcion'],
                ':destacada'   => $datos['destacada'] ? 1 : 0,
                ':activa'      => $datos['activa'] ? 1 : 0,
                ':id'          => $id,
            ]);

            if ($fotos !== null) {
                $borrado = $this->db->prepare('DELETE FROM fotos WHERE propiedad_id = :id');
                $borrado->execute([':id' => $id]);
                $this->insertarFotos($id, $fotos);
            }

            $this->db->commit();

            return true;
        } catch (PDOException $error) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            throw $error;
        }
    }

    /**
     * Baja física de la propiedad (UC9).
     * Las fotos, los favoritos y los renglones de solicitudes se borran solos
     * por las claves foráneas con ON DELETE CASCADE del script SQL.
     */
    public function eliminar(int $id): bool
    {
        $sentencia = $this->db->prepare('DELETE FROM propiedades WHERE id = :id');
        $sentencia->execute([':id' => $id]);

        return $sentencia->rowCount() > 0;
    }

    /** Inserta la lista de fotos reutilizando una sola sentencia preparada. */
    private function insertarFotos(int $propiedadId, array $fotos): void
    {
        if ($fotos === []) {
            return;
        }

        $sentencia = $this->db->prepare(
            'INSERT INTO fotos (propiedad_id, ruta, texto_alt, orden)
             VALUES (:propiedad_id, :ruta, :texto_alt, :orden)'
        );

        $orden = 1;
        foreach ($fotos as $foto) {
            $sentencia->execute([
                ':propiedad_id' => $propiedadId,
                ':ruta'         => $foto['ruta'],
                ':texto_alt'    => $foto['texto_alt'],
                ':orden'        => $orden,
            ]);
            $orden++;
        }
    }

    /**
     * El LEFT JOIN devuelve una fila por foto, así que la misma propiedad
     * aparece repetida. Acá se arma un único objeto por propiedad con un
     * arreglo "fotos" adentro, que es lo que espera la SPA.
     */
    private function agruparFotos(array $filas): array
    {
        $propiedades = [];

        foreach ($filas as $fila) {
            $id = (int) $fila['id'];

            if (!isset($propiedades[$id])) {
                $propiedades[$id] = [
                    'id'          => $id,
                    'slug'        => $fila['slug'],
                    'titulo'      => $fila['titulo'],
                    'tipo'        => $fila['tipo'],
                    'barrio'      => $fila['barrio'],
                    'precio'      => (float) $fila['precio'],
                    'superficie'  => (int) $fila['superficie'],
                    'ambientes'   => $fila['ambientes'] === null ? null : (int) $fila['ambientes'],
                    'descripcion' => $fila['descripcion'],
                    'destacada'   => (bool) $fila['destacada'],
                    'activa'      => (bool) $fila['activa'],
                    'fotos'       => [],
                ];
            }

            if ($fila['foto_id'] !== null) {
                $propiedades[$id]['fotos'][] = [
                    'id'        => (int) $fila['foto_id'],
                    'ruta'      => $fila['foto_ruta'],
                    'texto_alt' => $fila['foto_alt'],
                ];
            }
        }

        // array_values descarta las claves para que json_encode devuelva un
        // arreglo JSON [ ... ] y no un objeto { "1": ... }.
        return array_values($propiedades);
    }
}
