<?php
/**
 * RN Inmobiliaria — AE4 / TIFAS
 * models/UsuarioModel.php
 *
 * Acceso a datos puro de la tabla usuarios. No imprime nada, no sabe de JSON y
 * no decide códigos HTTP: eso es trabajo del controlador en /api.
 * Trazabilidad: UC6 Registrarse y UC7 Iniciar y cerrar sesión (AE1).
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/conexion.php';

final class UsuarioModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Conexion::obtener();
    }

    /**
     * Busca un usuario por e-mail, incluyendo el hash de la contraseña.
     * Lo usa login.php para pasárselo a password_verify().
     *
     * El e-mail viaja como parámetro :email, nunca pegado a la cadena SQL.
     * Si alguien escribe  ' OR 1=1 --  en el formulario, MySQL lo busca como
     * texto literal y no encuentra a nadie (OWASP A03).
     */
    public function buscarPorEmail(string $email): ?array
    {
        $sentencia = $this->db->prepare(
            'SELECT id, nombre, email, password, rol
               FROM usuarios
              WHERE email = :email
              LIMIT 1'
        );
        $sentencia->execute([':email' => $email]);

        $fila = $sentencia->fetch();

        return $fila === false ? null : $fila;
    }

    /** Versión sin el hash, para devolverle datos al cliente. */
    public function buscarPorId(int $id): ?array
    {
        $sentencia = $this->db->prepare(
            'SELECT id, nombre, email, rol
               FROM usuarios
              WHERE id = :id
              LIMIT 1'
        );
        $sentencia->execute([':id' => $id]);

        $fila = $sentencia->fetch();

        return $fila === false ? null : $fila;
    }

    /** ¿Ya hay una cuenta con ese e-mail? Evita chocar con la clave UNIQUE. */
    public function existeEmail(string $email): bool
    {
        $sentencia = $this->db->prepare(
            'SELECT 1 FROM usuarios WHERE email = :email LIMIT 1'
        );
        $sentencia->execute([':email' => $email]);

        return $sentencia->fetchColumn() !== false;
    }

    /**
     * Inserta un usuario nuevo y devuelve su id.
     * Recibe el hash ya calculado: el modelo guarda, el controlador hashea.
     */
    public function crear(string $nombre, string $email, string $hash, string $rol = 'cliente'): int
    {
        $sentencia = $this->db->prepare(
            'INSERT INTO usuarios (nombre, email, password, rol)
             VALUES (:nombre, :email, :password, :rol)'
        );
        $sentencia->execute([
            ':nombre'   => $nombre,
            ':email'    => $email,
            ':password' => $hash,
            ':rol'      => $rol,
        ]);

        return (int) $this->db->lastInsertId();
    }
}
