# Registro de archivos — AE4 / TIFAS

Quién hizo cada archivo, dónde está y para qué sirve. El asistente (Claude)
propuso el código base y los documentos; cada integrante lo ejecutó, lo revisó y
puede explicarlo (ver `docs/BITACORA.md`, sección 2).

| Archivo o carpeta | Quién | Para qué sirve |
|---|---|---|
| `config/conexion.php` | Calamari | Conexión PDO única (Singleton) con sentencias preparadas reales |
| `config/respuesta.php` | Roa | Cabeceras JSON, códigos HTTP y lectura del cuerpo |
| `config/sesion.php` | Calamari | Sesión del servidor, cookie endurecida y guardas 401 y 403 |
| `models/UsuarioModel.php` | Calamari | Acceso a la tabla `usuarios` |
| `models/PropiedadModel.php` | Roa | Propiedades y fotos, con transacciones |
| `models/FavoritoModel.php` | Roa | Favoritos de cada usuario |
| `models/SolicitudModel.php` | Roa | Solicitudes de compra, con transacción |
| `api/registro.php`, `login.php`, `logout.php`, `sesion.php` | Calamari | Endpoints de cuentas y sesión |
| `api/propiedades.php` | Roa | CRUD de propiedades |
| `api/favoritos.php`, `api/solicitudes.php` | Roa | Endpoints de favoritos y solicitudes |
| `public/index.html` | De Olivera | Único HTML con todas las vistas de la SPA |
| `public/js/app.js` | De Olivera | Router por hash, cliente `fetch` y dibujo del DOM |
| `public/css/estilos.css` | De Olivera | Estilos de la AE1 más vistas nuevas, foco y modo oscuro |
| `public/img/` | Equipo | Fotografías de las propiedades (vienen de la AE1) |
| `database/rn_inmobiliaria.sql` | Roa | Seis tablas y datos de prueba |
| `docs/TRAZABILIDAD.md` | Calamari | Casos de uso, endpoints y tablas |
| `docs/AUDITORIA-ISO-25010.md` | Roa | Ficha de autoevaluación con archivo y línea de cada evidencia |
| `docs/FUNDAMENTACION-OPCION4.md`, `docs/FUNDAMENTACION-OPCION-6.md` | Calamari y De Olivera | Fundamentación heredada de la AE2 |
| `docs/BITACORA.md` | Los tres | Bitácora de sesiones, decisiones y reflexión individual |
| `docs/informe/Informe_Tecnico_Final_AE4_RN_Inmobiliaria.pdf` | Los tres | Informe técnico final |
| `docs/evidencias/prueba-api.sh` y su salida | Calamari | 53 casos de la API |
| `docs/evidencias/prueba-spa.js` y su salida | De Olivera | 47 casos de la SPA |
| `docs/evidencias/auditar-accesibilidad.js`, `lighthouse/` | De Olivera | Lighthouse en las 9 vistas |
| `defensa/` | De Olivera | Herramienta de presentación para el coloquio |
| `README.md` | De Olivera | Descripción, arquitectura y despliegue en XAMPP |
| `ESTADO_TAREAS.md` | Los tres | Estado de cada tarea |
| `REGISTRO_ARCHIVOS.md` | De Olivera | Este archivo |
| `.gitignore` | De Olivera | Excluye dependencias y archivos temporales |
