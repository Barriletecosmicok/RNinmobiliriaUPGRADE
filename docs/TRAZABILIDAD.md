# Trazabilidad: de los Casos de Uso de la AE1 a la arquitectura de la AE4

Este documento responde una exigencia concreta de la consigna: **cada endpoint
de la API y cada tabla de MySQL tiene que justificar su existencia trazando una
relación directa con los Casos de Uso aprobados al inicio de la asignatura.**

La línea base son los cinco Casos de Uso especificados en el informe corregido
de la AE1 (sección 4.2), con un único actor: el **Usuario (comprador)**.

---

## 1. Los Casos de Uso, etapa por etapa

| Nº | Caso de Uso | Dónde nació | Actor |
|---|---|---|---|
| **UC1** | Consultar catálogo de propiedades | AE1 | Usuario (comprador) |
| **UC2** | Filtrar propiedades por tipo | AE1 | Usuario (comprador) |
| **UC3** | Ver ficha de una propiedad | AE1 | Usuario (comprador) |
| **UC4** | Completar formulario de compra | AE1 | Usuario (comprador) |
| **UC5** | Contactar por WhatsApp | AE1 | Usuario (comprador) |
| **UC6** | Registrarse | AE2 — Opción 4 (VSDM) | Visitante |
| **UC7** | Iniciar y cerrar sesión | AE2 — Opción 4 (VSDM) | Visitante / Usuario autenticado |
| **UC8** | Guardar propiedad favorita | AE2 — Opción 4 (VSDM) | Usuario autenticado |
| **UC9** | Gestionar propiedades | **AE4** | Agente |

UC1 a UC5 están especificados con actor, descripción, precondición, flujo
principal y postcondición en el informe de la AE1. UC6, UC7 y UC8 se
implementaron en la AE2 como parte del reto Startup Relámpago, donde se
documentaron por audiencia (modelo VSDM) sin numerarse como casos de uso; acá
se los numera para poder trazarlos.

**UC9 es el único caso de uso nuevo de la AE4.** Aparece porque la consigna
pide operaciones CRUD completas, y un CRUD necesita alguien que lo ejecute. Ese
alguien ya estaba insinuado desde la AE2: el archivo `data/usuarios.json`
contemplaba el rol `agente` para Rodrigo Núñez, pero ese rol no hacía nada. La
AE4 le da su trabajo: administrar el catálogo que hasta ahora se editaba a mano
en un archivo JSON.

### Cómo evolucionó cada Caso de Uso

| Nº | En la AE1 (estático) | En la AE2 (JS + JSON) | En la AE4 (SPA + API + MySQL) |
|---|---|---|---|
| UC1 | Tarjetas escritas a mano en `listado_box.html` y `listado_tabla.html` | `fetch` a `data/propiedades.json` y `createElement` | `GET /api/propiedades.php` consulta la tabla `propiedades` con `LEFT JOIN fotos` |
| UC2 | Filtro con CSS puro: radios ocultos más el selector `:has()` | Filtro en el cliente con `classList.toggle('is-oculta')` | El filtro del catálogo viaja al servidor: `WHERE p.tipo = :tipo`. La portada conserva el filtro visual de la AE2 |
| UC3 | Un archivo `.html` por propiedad, escrito a mano | La ficha seguía siendo un archivo aparte | `GET /api/propiedades.php?id=1` y la vista `#/propiedad/:id`. Agregar una propiedad ya no implica crear un archivo |
| UC4 | `<form action="#">`: los datos no iban a ningún lado | Precarga de nombre y e-mail desde `sessionStorage` | `POST /api/solicitudes.php` persiste en `solicitudes` y `solicitud_propiedad` dentro de una transacción |
| UC5 | Enlace `wa.me` con mensaje fijo | Igual que en la AE1 | El mensaje se arma con el título y el precio reales que devuelve la API |
| UC6 | No existía | `registrarUsuario()` guardaba el usuario en `localStorage`, con la contraseña en texto plano | `POST /api/registro.php` inserta en `usuarios` con hash BCRYPT |
| UC7 | No existía | `verificarCredenciales()` comparaba contra un JSON público | `POST /api/login.php` con `password_verify()` y `$_SESSION` en el servidor |
| UC8 | No existía | Favoritos en `localStorage`, por navegador | Tabla `favoritos` atada al usuario por clave foránea |
| UC9 | No existía | No existía | `POST`, `PUT` y `DELETE` sobre `/api/propiedades.php`, restringidos al rol agente |

---

## 2. Cada endpoint justificado

| Endpoint | Método | Caso de Uso | Por qué existe | Tablas que toca |
|---|---|---|---|---|
| `api/propiedades.php` | GET | UC1 | El catálogo es la pantalla de entrada del recorrido de compra especificado en la AE1 | `propiedades`, `fotos` |
| `api/propiedades.php?tipo=` | GET | UC2 | La AE1 ya ofrecía filtrar por Casas y Terrenos; ahora el filtro lo resuelve la consulta SQL | `propiedades`, `fotos` |
| `api/propiedades.php?id=` | GET | UC3 | Reemplaza a los tres archivos `producto*.html` escritos a mano | `propiedades`, `fotos` |
| `api/propiedades.php?todas=1` | GET | UC9 | El agente necesita ver también las propiedades dadas de baja, que el catálogo público oculta | `propiedades`, `fotos` |
| `api/propiedades.php` | POST | UC9 | Alta de propiedad: la "C" del CRUD | `propiedades`, `fotos` |
| `api/propiedades.php?id=` | PUT | UC9 | Modificación: la "U" del CRUD | `propiedades`, `fotos` |
| `api/propiedades.php?id=` | DELETE | UC9 | Baja: la "D" del CRUD | `propiedades` y, en cascada, `fotos`, `favoritos`, `solicitud_propiedad` |
| `api/registro.php` | POST | UC6 | Sin cuenta no hay favoritos ni seguimiento de solicitudes | `usuarios` |
| `api/login.php` | POST | UC7 | Abre la sesión que habilita todo lo que la AE2 llamó "audiencia usuario autenticado" | `usuarios` |
| `api/logout.php` | POST | UC7 | La AE2 ya tenía el botón "Salir" en todas las páginas; ahora cierra la sesión del servidor | — |
| `api/sesion.php` | GET | UC7 | Es la fuente de verdad de la visibilidad VSDM: reemplaza al `sessionStorage` del navegador | `favoritos` |
| `api/favoritos.php` | GET | UC8 | Lista las propiedades guardadas, que antes vivían sólo en el navegador | `favoritos`, `propiedades` |
| `api/favoritos.php` | POST | UC8 | Marca una propiedad como favorita | `favoritos` |
| `api/favoritos.php?propiedad_id=` | DELETE | UC8 | Desmarca. El corazón de la AE1 alternaba estado: ahora el estado persiste | `favoritos` |
| `api/solicitudes.php` | POST | UC4 | Es el `action` que al formulario de compra de la AE1 le faltaba | `solicitudes`, `solicitud_propiedad` |
| `api/solicitudes.php` | GET | UC4 | El cliente puede ver qué envió y en qué estado está | `solicitudes`, `solicitud_propiedad`, `propiedades` |
| `api/solicitudes.php?todas=1` | GET | UC9 | De nada sirve registrar solicitudes si el agente no las puede leer | `solicitudes`, `solicitud_propiedad`, `propiedades` |
| `api/solicitudes.php?id=` | PATCH | UC9 | El agente marca la solicitud como contactada o cerrada: cierra el circuito de la postcondición de UC4 | `solicitudes` |

No hay ningún endpoint que no resuelva un Caso de Uso, y no hay Caso de Uso sin
endpoint, salvo **UC5 (Contactar por WhatsApp)**, que por su naturaleza no pasa
por el servidor: es un enlace `https://wa.me/...` que el cliente arma con los
datos que ya trajo la API.

---

## 3. Cada tabla justificada

| Tabla | Caso de Uso que la exige | Por qué no se podía evitar |
|---|---|---|
| `usuarios` | UC6, UC7 | Sin una tabla de usuarios no hay con qué comparar la contraseña en el servidor, que es justamente la limitación que la AE2 dejó anotada |
| `propiedades` | UC1, UC2, UC3, UC9 | Es la entidad central del requerimiento funcional de la AE1: la gestión de venta de propiedades |
| `fotos` | UC3 | La ficha de la AE1 mostraba una galería de varias fotos por propiedad. Una propiedad tiene muchas fotos, así que son dos tablas |
| `favoritos` | UC8 | Un usuario marca muchas propiedades y una propiedad la marcan muchos usuarios: relación de muchos a muchos. La clave `UNIQUE(usuario_id, propiedad_id)` evita el favorito duplicado |
| `solicitudes` | UC4 | Guarda exactamente los campos del formulario de `comprar.html`: nombre, teléfono, dirección, e-mail y medio de pago |
| `solicitud_propiedad` | UC4 | El formulario de la AE1 dice "elegí una o más propiedades". Esa frase es, en el modelo relacional, una tabla intermedia |

Columnas que también responden a un requisito y no a un gusto:

| Columna | De dónde sale |
|---|---|
| `usuarios.password VARCHAR(255)` | La consigna de la AE4 lo pide explícitamente para alojar el hash BCRYPT |
| `usuarios.rol` | El `data/usuarios.json` de la AE2 ya distinguía `cliente` de `agente`; UC9 le da sentido |
| `propiedades.slug` | Los identificadores legibles de la AE1 (`villa-sarita`, `itaembe-guazu`) se conservan para no romper las rutas de las imágenes |
| `propiedades.activa` | Permite la baja lógica: el agente despublica sin destruir el historial de solicitudes |
| `propiedades.destacada` | La portada de la AE1 tenía una sección de "Propiedades destacadas" y la AE2 un botón para resaltarlas |
| `fotos.texto_alt` | Criterio 1.1.1 de WCAG 2.1. Es `NOT NULL` para que la base impida una foto sin alternativa textual |
| `solicitudes.estado` | Materializa la postcondición de UC4: "lista para ser procesada por la inmobiliaria" |

---

## 4. Casos de Uso contra vistas de la SPA

| Nº | Vista | Ruta | Qué dispara |
|---|---|---|---|
| UC1 | Portada y Catálogo | `#/inicio`, `#/propiedades` | `GET propiedades.php` |
| UC2 | Catálogo (chips de filtro) | `#/propiedades` | `GET propiedades.php?tipo=` |
| UC3 | Ficha | `#/propiedad/:id` | `GET propiedades.php?id=` |
| UC4 | Solicitud de compra | `#/comprar` | `POST solicitudes.php` |
| UC5 | Ficha (botón de WhatsApp) | `#/propiedad/:id` | Enlace `wa.me`, sin servidor |
| UC6 | Acceso, pestaña "Crear cuenta" | `#/acceso` | `POST registro.php` |
| UC7 | Acceso, pestaña "Ingresar" | `#/acceso` | `POST login.php`, `POST logout.php` |
| UC8 | Favoritos y corazón de las tarjetas | `#/favoritos` | `GET/POST/DELETE favoritos.php` |
| UC9 | Panel del agente | `#/panel` | `POST/PUT/DELETE propiedades.php`, `PATCH solicitudes.php` |

---

## 5. Dónde está probado cada Caso de Uso

| Nº | Prueba de la API | Prueba de la SPA |
|---|---|---|
| UC1 | Casos 01, 02 | Casos 01-04, 18 |
| UC2 | Casos 02, 03 | Casos 19, 20 |
| UC3 | Casos 04, 05, 06 | Casos 21-23 |
| UC4 | Casos 28, 29, 30, 31 | Casos 28-32 |
| UC5 | — (no pasa por el servidor) | Caso 24 |
| UC6 | Casos 47, 48, 49, 50 | — |
| UC7 | Casos 13-18, 20, 21, 51, 52 | Casos 09-17, 35, 36 |
| UC8 | Casos 22-27 | Casos 25, 26, 27 |
| UC9 | Casos 32-46 | Casos 33-45 |

Las salidas completas están en `docs/evidencias/salida-prueba-api.txt` y
`docs/evidencias/salida-prueba-spa.txt`.
