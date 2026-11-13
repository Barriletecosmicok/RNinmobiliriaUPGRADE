<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * models/SolicitudModel.php
 *
 * Trazabilidad: UC4 Completar formulario de compra.
 * Los campos son los mismos del formulario de comprar.html de la AE1
 * (nombre, teléfono, dirección, e-mail, medio de pago y una o más propiedades),
 * pero ahora el envío persiste en MySQL en lugar de perderse en un action="#".
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class SolicitudModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    /**
     * Alta de la solicitud y de las propiedades elegidas.
     *
     * Va en una transacción porque son dos tablas: si falla el renglón de una
     * propiedad, no puede quedar una solicitud huérfana sin propiedades.
     * ISO/IEC 25010 — Fiabilidad (madurez y recuperabilidad).
     *
     * @param array $datos        Campos del formulario ya validados.
     * @param int[] $propiedadIds Propiedades que marcó el cliente.
     */
    public function crear(array $datos, array $propiedadIds): int
    {
        try {
            $this->db->beginTransaction();

            $sentencia = $this->db->prepare(
                'INSERT INTO solicitudes
                    (usuario_id, nombre, telefono, direccion, email, medio_pago, mensaje)
                 VALUES
                    (:usuario_id, :nombre, :telefono, :direccion, :email, :medio_pago, :mensaje)'
            );
            $sentencia->execute([
                ':usuario_id' => $datos['usuario_id'],
                ':nombre'     => $datos['nombre'],
                ':telefono'   => $datos['telefono'],
                ':direccion'  => $datos['direccion'],
                ':email'      => $datos['email'],
                ':medio_pago' => $datos['medio_pago'],
                ':mensaje'    => $datos['mensaje'],
            ]);

            $solicitudId = (int) $this->db->lastInsertId();

            $renglon = $this->db->prepare(
                'INSERT INTO solicitud_propiedad (solicitud_id, propiedad_id)
                 VALUES (:solicitud_id, :propiedad_id)'
            );

            foreach ($propiedadIds as $propiedadId) {
                $renglon->execute([
                    ':solicitud_id' => $solicitudId,
                    ':propiedad_id' => (int) $propiedadId,
                ]);
            }

            $this->db->commit();

            return $solicitudId;
        } catch (PDOException $error) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            throw $error;
        }
    }

    /** Solicitudes que envió un cliente, con el título de cada propiedad. */
    public function listarDeUsuario(int $usuarioId): array
    {
        $sentencia = $this->db->prepare(
            'SELECT s.id, s.nombre, s.telefono, s.direccion, s.email,
                    s.medio_pago, s.mensaje, s.estado, s.creado_en,
                    p.id AS propiedad_id, p.titulo AS propiedad_titulo
               FROM solicitudes s
               LEFT JOIN solicitud_propiedad sp ON sp.solicitud_id = s.id
               LEFT JOIN propiedades p ON p.id = sp.propiedad_id
              WHERE s.usuario_id = :usuario_id
              ORDER BY s.creado_en DESC, p.id ASC'
        );
        $sentencia->execute([':usuario_id' => $usuarioId]);

        return $this->agruparPropiedades($sentencia->fetchAll());
    }

    /** Todas las solicitudes recibidas. Sólo para el rol agente. */
    public function listarTodas(): array
    {
        $sentencia = $this->db->prepare(
            'SELECT s.id, s.nombre, s.telefono, s.direccion, s.email,
                    s.medio_pago, s.mensaje, s.estado, s.creado_en,
                    p.id AS propiedad_id, p.titulo AS propiedad_titulo
               FROM solicitudes s
               LEFT JOIN solicitud_propiedad sp ON sp.solicitud_id = s.id
               LEFT JOIN propiedades p ON p.id = sp.propiedad_id
              ORDER BY s.creado_en DESC, p.id ASC'
        );
        $sentencia->execute();

        return $this->agruparPropiedades($sentencia->fetchAll());
    }

    /** Cambia el estado de seguimiento de una solicitud (pendiente, contactada, cerrada). */
    public function cambiarEstado(int $id, string $estado): bool
    {
        $sentencia = $this->db->prepare(
            'UPDATE solicitudes SET estado = :estado WHERE id = :id'
        );
        $sentencia->execute([':estado' => $estado, ':id' => $id]);

        return $sentencia->rowCount() > 0;
    }

    /** Igual que en PropiedadModel: una fila por propiedad se vuelve un arreglo. */
    private function agruparPropiedades(array $filas): array
    {
        $solicitudes = [];

        foreach ($filas as $fila) {
            $id = (int) $fila['id'];

            if (!isset($solicitudes[$id])) {
                $solicitudes[$id] = [
                    'id'          => $id,
                    'nombre'      => $fila['nombre'],
                    'telefono'    => $fila['telefono'],
                    'direccion'   => $fila['direccion'],
                    'email'       => $fila['email'],
                    'medio_pago'  => $fila['medio_pago'],
                    'mensaje'     => $fila['mensaje'],
                    'estado'      => $fila['estado'],
                    'creado_en'   => $fila['creado_en'],
                    'propiedades' => [],
                ];
            }

            if ($fila['propiedad_id'] !== null) {
                $solicitudes[$id]['propiedades'][] = [
                    'id'     => (int) $fila['propiedad_id'],
                    'titulo' => $fila['propiedad_titulo'],
                ];
            }
        }

        return array_values($solicitudes);
    }
}
