# Estado de tareas — AE4 / TIFAS

Proyecto: RN Inmobiliaria · Paradigmas y Lenguajes de Programación III · UCP Posadas
Equipo: **Roa, Santino** · **Calamari, Santino** · **De Olivera, Jesús Emanuel**
Última actualización: 12/11/2026

Reparto por continuidad con la AE2: Calamari sigue con seguridad y sesión
(era su Opción 4 con VSDM), De Olivera sigue con la interfaz (era su Opción 6
con OOHDM) y Roa toma la base de datos y el CRUD, que es la parte nueva.

| # | Tarea | Responsable | Estado | Archivos |
|---|---|---|---|---|
| 1 | Rama `ae4-tifas` y estructura MVC desacoplada | Los tres | Terminada | `config/`, `models/`, `api/`, `public/`, `database/` |
| 2 | Script SQL de la base `rn_inmobiliaria` | Roa | Terminada | `database/rn_inmobiliaria.sql` |
| 3 | Conexión PDO Singleton | Calamari | Terminada | `config/conexion.php` |
| 4 | Respuestas JSON y códigos HTTP | Roa | Terminada | `config/respuesta.php` |
| 5 | Sesión del servidor y guardas de acceso | Calamari | Terminada | `config/sesion.php` |
| 6 | `UsuarioModel` | Calamari | Terminada | `models/UsuarioModel.php` |
| 7 | `PropiedadModel`, `FavoritoModel`, `SolicitudModel` | Roa | Terminada | `models/` |
| 8 | Endpoints de registro, login, logout y sesión | Calamari | Terminada | `api/registro.php`, `api/login.php`, `api/logout.php`, `api/sesion.php` |
| 9 | CRUD de propiedades restringido al rol agente | Roa | Terminada | `api/propiedades.php` |
| 10 | Endpoints de favoritos y solicitudes | Roa | Terminada | `api/favoritos.php`, `api/solicitudes.php` |
| 11 | SPA: `index.html` único con router por hash | De Olivera | Terminada | `public/index.html` |
| 12 | Cliente JS Vanilla desacoplado | De Olivera | Terminada | `public/js/app.js` |
| 13 | CSS de la SPA sobre el de la AE1 | De Olivera | Terminada | `public/css/estilos.css` |
| 14 | Accesibilidad WCAG 2.1 y regiones `aria-live` | De Olivera | Terminada | `public/index.html`, `public/css/estilos.css` |
| 15 | Prueba automática de la API (53 casos) | Calamari | Terminada | `docs/evidencias/prueba-api.sh` |
| 16 | Prueba funcional de la SPA (47 casos) | De Olivera | Terminada | `docs/evidencias/prueba-spa.js` |
| 17 | Auditoría Lighthouse de las 9 vistas | De Olivera | Terminada | `docs/evidencias/auditar-accesibilidad.js`, `docs/evidencias/lighthouse/` |
| 18 | Matriz de trazabilidad UC → endpoints → tablas | Calamari | Terminada | `docs/TRAZABILIDAD.md` |
| 19 | Ficha de autoevaluación ISO/IEC 25010 | Roa | Terminada | `docs/AUDITORIA-ISO-25010.md` |
| 20 | README con el despliegue en XAMPP | De Olivera | Terminada | `README.md` |
| 21 | Bitácora del equipo | Los tres | **En curso** | `docs/BITACORA.md` |
| 22 | Reflexión individual de cada integrante | Cada uno | **Pendiente** | `docs/BITACORA.md`, sección 4 |
| 23 | Verificar Lighthouse en la máquina del equipo | Los tres | **Pendiente** | Captura para el informe |
| 24 | Informe técnico final en PDF | Los tres | **Pendiente** | Capítulos 1, 2 y 3 |
| 25 | Presentación interactiva (herramienta de defensa) | De Olivera | **Primera versión lista** | `defensa/` |
| 25b | Guion de práctica y guía de estudio del coloquio | Los tres | **Pendiente** | Documentos aparte |
| 26 | Paquete .ZIP para el Campus Virtual | Los tres | **Pendiente** | Código más `.sql` |

## Lo que falta y de quién depende

- **Roa:** estudiar el CRUD y la persistencia línea por línea, y escribir su
  reflexión individual.
- **Calamari:** estudiar la remediación OWASP (BCRYPT, `$_SESSION`, PDO
  preparado) línea por línea, y escribir su reflexión individual.
- **De Olivera:** correr Lighthouse en Chrome DevTools sobre la máquina que se
  va a usar en el coloquio y guardar la captura del 100/100, y escribir su
  reflexión individual.
- **Los tres:** el informe en PDF y la práctica de la demostración por teclado,
  que es lo primero que se evalúa en la defensa.
