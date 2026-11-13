-- =====================================================================
-- RN Inmobiliaria — AE4 / TIFAS
-- Paradigmas y Lenguajes de Programación III — UCP Sede Posadas
-- Script de creación de la base de datos y carga de datos de prueba
--
-- Uso en XAMPP:
--   1) Abrir phpMyAdmin (http://localhost/phpmyadmin)
--   2) Pestaña "Importar" y seleccionar este archivo
--   o desde la consola:  mysql -u root -p < database/rn_inmobiliaria.sql
--
-- Las contraseñas se guardan en VARCHAR(255) porque password_hash() con
-- BCRYPT devuelve 60 caracteres y el algoritmo puede cambiar de largo.
-- Nunca se guarda la contraseña en texto plano.
-- =====================================================================

DROP DATABASE IF EXISTS rn_inmobiliaria;
CREATE DATABASE rn_inmobiliaria
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE rn_inmobiliaria;

-- Declara en qué codificación están los textos de ESTE archivo.
-- Sin esta línea, un cliente de consola configurado en latin1 (el caso del
-- mysql.exe de XAMPP en varias instalaciones de Windows) interpreta mal los
-- bytes UTF-8 y los acentos quedan guardados como "BenÃ­tez" en lugar de
-- "Benítez". Nos pasó al importar y así se corrigió.
SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- usuarios — UC6 Registrarse, UC7 Iniciar y cerrar sesión
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  password   VARCHAR(255) NOT NULL COMMENT 'Hash BCRYPT generado con password_hash()',
  rol        ENUM('cliente','agente') NOT NULL DEFAULT 'cliente',
  creado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- propiedades — UC1 Consultar catálogo de propiedades, UC3 Ver ficha de una propiedad, UC9 Gestionar
-- ---------------------------------------------------------------------
CREATE TABLE propiedades (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(80)  NOT NULL COMMENT 'Identificador legible heredado de la maqueta AE1',
  titulo        VARCHAR(150) NOT NULL,
  tipo          ENUM('casa','terreno','departamento','local') NOT NULL,
  barrio        VARCHAR(120) NOT NULL,
  precio        DECIMAL(12,2) UNSIGNED NOT NULL COMMENT 'Precio en dólares',
  superficie    SMALLINT UNSIGNED NOT NULL COMMENT 'Metros cuadrados',
  ambientes     TINYINT UNSIGNED NULL COMMENT 'NULL en terrenos baldíos',
  descripcion   TEXT NULL,
  destacada     BOOLEAN NOT NULL DEFAULT FALSE,
  activa        BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Baja lógica: la ficha deja de publicarse',
  creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_propiedades_slug (slug),
  KEY idx_propiedades_tipo (tipo),
  KEY idx_propiedades_destacada (destacada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- fotos — galería de cada propiedad (OOHDM: contexto "fotos de una propiedad")
-- ---------------------------------------------------------------------
CREATE TABLE fotos (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  propiedad_id  INT UNSIGNED NOT NULL,
  ruta          VARCHAR(200) NOT NULL,
  texto_alt     VARCHAR(200) NOT NULL COMMENT 'WCAG 2.1 — criterio 1.1.1 Contenido no textual',
  orden         TINYINT UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_fotos_propiedad (propiedad_id),
  CONSTRAINT fk_fotos_propiedad FOREIGN KEY (propiedad_id)
    REFERENCES propiedades (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- favoritos — UC8 Guardar propiedad favorita (requiere sesión activa)
-- ---------------------------------------------------------------------
CREATE TABLE favoritos (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id    INT UNSIGNED NOT NULL,
  propiedad_id  INT UNSIGNED NOT NULL,
  creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_favorito (usuario_id, propiedad_id),
  CONSTRAINT fk_favoritos_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_favoritos_propiedad FOREIGN KEY (propiedad_id)
    REFERENCES propiedades (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- solicitudes — UC4 Completar formulario de compra
-- Los campos salen del formulario de comprar.html de la AE1
-- ---------------------------------------------------------------------
CREATE TABLE solicitudes (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id  INT UNSIGNED NULL COMMENT 'NULL si el usuario se dio de baja',
  nombre      VARCHAR(100) NOT NULL,
  telefono    VARCHAR(40)  NOT NULL,
  direccion   VARCHAR(200) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  medio_pago  ENUM('efectivo','transferencia','financiacion','credito-hipotecario','tarjeta') NOT NULL,
  mensaje     TEXT NULL,
  estado      ENUM('pendiente','contactada','cerrada') NOT NULL DEFAULT 'pendiente',
  creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_solicitudes_usuario (usuario_id),
  KEY idx_solicitudes_estado (estado),
  CONSTRAINT fk_solicitudes_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- solicitud_propiedad — el formulario permite elegir una o más propiedades
-- ---------------------------------------------------------------------
CREATE TABLE solicitud_propiedad (
  solicitud_id  INT UNSIGNED NOT NULL,
  propiedad_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (solicitud_id, propiedad_id),
  KEY idx_sp_propiedad (propiedad_id),
  CONSTRAINT fk_sp_solicitud FOREIGN KEY (solicitud_id)
    REFERENCES solicitudes (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_sp_propiedad FOREIGN KEY (propiedad_id)
    REFERENCES propiedades (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- DATOS DE PRUEBA
-- Los dos usuarios son los mismos que usaba data/usuarios.json en la AE1,
-- pero ahora la contraseña está hasheada con BCRYPT (costo 10).
--   ana@rninmobiliaria.com     / tierraroja26  (rol cliente)
--   rodrigo@rninmobiliaria.com / posadas2026   (rol agente)
-- =====================================================================
INSERT INTO usuarios (nombre, email, password, rol) VALUES
  ('Ana Benítez',   'ana@rninmobiliaria.com',     '$2y$10$caWd6u5Nu1090wamg9RDleHwOdVwQWMGTzdU4prSOQL8CVCCU5pSq', 'cliente'),
  ('Rodrigo Núñez', 'rodrigo@rninmobiliaria.com', '$2y$10$ocyEiZNMddFEE4p2997twOxv/yPo8gArmnulUHAUuwykX868QUH6e', 'agente');

INSERT INTO propiedades (slug, titulo, tipo, barrio, precio, superficie, ambientes, descripcion, destacada) VALUES
  ('villa-sarita',  'Casa 3 ambientes con pileta en Villa Sarita', 'casa',    'Villa Sarita, Posadas',   85000.00, 120, 3,
   'Casa de tres ambientes con pileta, galería y garage cubierto en Villa Sarita.', TRUE),
  ('itaembe-guazu', 'Terreno baldío en Itaembé Guazú',             'terreno', 'Itaembé Guazú, Posadas',  22000.00, 300, NULL,
   'Terreno baldío con todos los servicios en la zona de mayor crecimiento de Posadas.', FALSE),
  ('barrio-centro', 'Casa 2 plantas en Barrio Centro',             'casa',    'Centro, Posadas',         75000.00,  90, 3,
   'Casa de dos plantas a cuadras de la peatonal, con patio interno y living comedor amplio.', TRUE);

INSERT INTO fotos (propiedad_id, ruta, texto_alt, orden) VALUES
  (1, 'img/casa-villa-sarita-dormitorio.png', 'Dormitorio principal con techo de madera',          1),
  (1, 'img/casa-villa-sarita-cocina.png',     'Cocina y comedor integrados con isla central',      2),
  (1, 'img/casa-villa-sarita-pileta.png',     'Pileta en el patio de la propiedad',                3),
  (1, 'img/casa-villa-sarita-vestidor.png',   'Vestidor amplio con estantes de madera',            4),
  (1, 'img/casa-villa-sarita-garage.png',     'Garage y área de lavado con espacio para auto',     5),
  (1, 'img/casa-villa-sarita-galeria.png',    'Galería exterior con plantas',                      6),
  (2, 'img/terreno-itaembe-guazu.png',        'Vista del espacio exterior del terreno en Itaembé Guazú', 1),
  (3, 'img/casa-centro-fachada.png',          'Fachada de la casa de dos plantas',                 1),
  (3, 'img/casa-centro-patio.png',            'Patio interno con plantas',                         2),
  (3, 'img/casa-centro-living.png',           'Living comedor amplio',                             3);

-- Favorito de ejemplo: Ana guardó la casa de Villa Sarita
INSERT INTO favoritos (usuario_id, propiedad_id) VALUES (1, 1);
