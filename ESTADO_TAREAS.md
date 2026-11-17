# Estado de tareas — AE4 / TIFAS

Proyecto: RN Inmobiliaria · Paradigmas y Lenguajes de Programación III · UCP Posadas
Equipo: **Roa, Santino** · **Calamari, Santino** · **De Olivera, Jesús Emanuel**
Última actualización: 16/11/2026

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
| 21 | Bitácora del equipo | Los tres | Terminada | `docs/BITACORA.md` |
| 22 | Reflexión individual de cada integrante | Cada uno | **Borrador listo: cada uno la ajusta con sus palabras** | `docs/BITACORA.md`, sección 4 |
| 23 | Verificar Lighthouse en la máquina del equipo | Los tres | **Pendiente** | Captura para el informe |
| 24 | Informe técnico final en PDF | Los tres | Terminada (v2, alineada con la defensa) | `docs/informe/Informe_Tecnico_Final_AE4_RN_Inmobiliaria.pdf` |
| 25 | Presentación interactiva (herramienta de defensa) | De Olivera | **Lista (v3: estructura del coloquio)** | `defensa/` |
| 25b | Guía de estudio del coloquio | Los tres | Terminada | Documento aparte (Claude Docs) |
| 26 | Paquete .ZIP para el Campus Virtual | Los tres | Armado, falta el OK del equipo | `RN_Inmobiliaria_AE4_entrega.zip` |
| 27 | Registro de archivos y `.gitignore` | De Olivera | Terminada | `REGISTRO_ARCHIVOS.md`, `.gitignore` |

## Reparto de la defensa

Además del reparto del trabajo (arriba), en el coloquio cada uno explica una
parte distinta para cubrir los tres temas de la consigna. La tabla completa está
en el informe, sección «Reparto del trabajo», y en `README.md`.

## Lo que falta y de quién depende

- **Los tres:** leer la reflexión individual de `docs/BITACORA.md` (sección 4),
  corregirla con sus palabras y dar el OK a la lista de archivos del ZIP.
- **Los tres:** probar la demostración por teclado en la máquina del coloquio,
  con la base recién importada, y guardar la captura de Lighthouse en DevTools.
- **Antes de subir a GitHub:** el historial tiene 14 commits de De Olivera y 7 de
  cada uno de los otros dos. La consigna pide una distribución equitativa.
