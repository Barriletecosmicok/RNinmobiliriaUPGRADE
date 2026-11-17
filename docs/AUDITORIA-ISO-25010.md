# Ficha de autoevaluación de calidad — ISO/IEC 25010

Proyecto: **RN Inmobiliaria — AE4 / TIFAS**
Equipo: Roa, Santino · Calamari, Santino · De Olivera, Jesús Emanuel
Fecha de la auditoría: noviembre de 2026

Cada característica se evalúa contra **evidencia concreta del código fuente**,
con archivo y línea, y contra el resultado de las pruebas automáticas. No se
declara "Cumple" sin algo que se pueda abrir y mirar.

---

## Matriz de auditoría

| # | Característica | Evidencia técnica verificada en el código | Estado |
|---|---|---|---|
| 1 | **Adecuación funcional** | Las operaciones CRUD de `api/propiedades.php` (POST línea 188, PUT línea 209, DELETE línea 237) y los POST de `api/registro.php` y `api/solicitudes.php` persisten en MySQL a través de PDO. Los nueve Casos de Uso tienen endpoint y prueba: ver `docs/TRAZABILIDAD.md`, sección 5. 53 de 53 casos de la API y 47 de 47 de la SPA pasan. | **Cumple** |
| 2 | **Eficiencia de desempeño** | Las respuestas son JSON sin recarga de página: el router de `public/js/app.js` (línea 1350, `atenderRuta`) cambia de vista sin volver a pedir el HTML. El listado del catálogo trae propiedades y fotos en **una sola consulta** con `LEFT JOIN` (`models/PropiedadModel.php`, líneas 21-47; el listado se arma en `listar()`, línea 63) en lugar de una consulta por propiedad. El panel lanza sus dos peticiones en paralelo con `Promise.all` (`app.js` línea 1267). Las imágenes del catálogo usan `loading="lazy"`. | **Cumple** |
| 3 | **Compatibilidad** | Cliente y servidor están desacoplados: `public/index.html` no tiene una línea de PHP ni un `<script>` embebido, y los endpoints no emiten HTML. El contrato es JSON con `header('Content-Type: application/json; charset=utf-8')` en `config/respuesta.php` línea 21. La API se puede consumir desde cualquier cliente: la prueba `docs/evidencias/prueba-api.sh` la ejerce con `curl`, sin navegador. | **Cumple** |
| 4 | **Fiabilidad** | Nueve bloques `try/catch (PDOException)` en los endpoints y los modelos. Las operaciones que tocan dos tablas van en transacción con `rollBack()` ante falla: `models/SolicitudModel.php` línea 37 y `models/PropiedadModel.php` líneas 132 y 176. Los códigos HTTP son semánticos y están verificados uno por uno en la prueba de la API (200, 201, 400, 401, 403, 404, 405, 409, 500). | **Cumple** |
| 5 | **Seguridad (OWASP)** | Contraseñas con BCRYPT: `password_hash()` en `api/registro.php` línea 70 y `password_verify()` en `api/login.php` línea 43. 25 sentencias preparadas con marcadores nombrados en los cuatro modelos, con `PDO::ATTR_EMULATE_PREPARES => false` (`config/conexion.php` línea 67). Sesión en el servidor con `session_regenerate_id(true)` (`config/sesion.php` línea 45) y guardas `exigirSesion()` (línea 80) y `exigirRol()` (línea 97). Los intentos de inyección SQL de los casos 17, 18 y 19 de la prueba de la API devuelven 401 y 400, no acceso. | **Cumple** |
| 6 | **Usabilidad / Accesibilidad** | Lighthouse da **100/100 en Accesibilidad en las 9 vistas auditadas**, incluidas las que exigen sesión de cliente y de agente (`docs/evidencias/salida-lighthouse.txt` y los reportes HTML en `docs/evidencias/lighthouse/`). Navegación completa por teclado verificada en los casos 05 a 12 de la prueba de la SPA. `:focus-visible` en `public/css/estilos.css` línea 97. 14 regiones `aria-live="polite"` en `public/index.html`. | **Cumple** |
| 7 | **Mantenibilidad** | Separación en capas: `config/` (infraestructura), `models/` (datos), `api/` (controladores), `public/` (vista). Un modelo por entidad y un endpoint por recurso. Nombres en español y en el dominio del negocio (`PropiedadModel`, `exigirRol`, `precioEnDolares`). Las credenciales de la base están en un único archivo. Versionado en Git con commits distribuidos entre los tres integrantes. | **Cumple** |

---

## Detalle por característica

### 1. Adecuación funcional

La pregunta es si el sistema hace lo que se esperaba de él. El alcance no lo
fijamos nosotros: lo fijaron los Casos de Uso de la AE1 y la consigna de la AE4.

- Los nueve Casos de Uso están implementados y probados. La tabla de la
  sección 5 de `docs/TRAZABILIDAD.md` dice qué caso prueba cada uno.
- El CRUD está completo sobre `propiedades`, que es la entidad central del
  requerimiento funcional, no sobre una entidad auxiliar elegida por
  comodidad.
- Las tres limitaciones que la AE2 dejó declaradas por escrito están
  resueltas. Esa es la medida más honesta de adecuación que tenemos: nos
  pusimos deberes y los cumplimos.

**Lo que no cumple:** no hay subida de archivos de imagen, y el formulario de
contacto general de la portada se quitó en lugar de implementarlo. Preferimos
no dejar un formulario que no guarda nada, que era precisamente el problema
del `action="#"` de la AE1.

### 2. Eficiencia de desempeño

- **Sin recargas.** Una sola carga de `index.html` y de `app.js` para toda la
  sesión de uso. Después sólo viajan JSON.
- **Una consulta por listado.** La tentación era pedir las propiedades y
  después, por cada una, sus fotos. Eso son cuatro consultas para tres
  propiedades y cuarenta y una para cuarenta. El `LEFT JOIN` de
  `PropiedadModel::listar()` trae todo junto y `agruparFotos()` lo reordena en
  PHP.
- **Peticiones en paralelo** donde no hay dependencia entre ellas.

**Lo que no cumple:** las imágenes pesan alrededor de 2 MB cada una, heredadas
de la AE1. No afecta la auditoría de accesibilidad, pero hundiría el puntaje de
Rendimiento. Comprimirlas es la primera mejora pendiente.

### 3. Compatibilidad

El desacoplamiento no es una declaración: es verificable. Si el HTML tuviera
PHP adentro, `prueba-api.sh` no podría ejercer la API con `curl` sin navegador,
y lo hace con 53 casos.

### 4. Fiabilidad

Lo importante acá es qué pasa cuando algo sale mal.

- Una `PDOException` nunca llega al cliente. Se registra completa en el log del
  servidor con `error_log()` y al usuario le llega un mensaje genérico con
  código 500. Es la contracara de exponer la consulta que falló, que le
  regalaría a un atacante el nombre de las tablas.
- Si la solicitud de compra se guarda pero falla el renglón de una propiedad,
  el `rollBack()` deshace todo. No queda una solicitud sin propiedades.
- Cada código HTTP está probado contra su caso: no "debería devolver 401" sino
  "el caso 08 devuelve 401".

### 5. Seguridad

Las tres remediaciones OWASP que pide la consigna, con su razón:

| OWASP | Qué se hizo | Por qué así |
|---|---|---|
| **A01 — Control de acceso roto** | `exigirSesion()` y `exigirRol()` al principio de cada rama protegida | Ocultar el botón en la interfaz no es seguridad. El caso 34 de la prueba de la SPA fuerza un `fetch` al endpoint del panel con una cuenta de cliente y recibe 403 |
| **A02 — Fallas criptográficas** | BCRYPT con `password_hash()` y `password_verify()` | BCRYPT es lento a propósito y lleva su propia sal. No se descifra: se vuelve a hashear y se compara |
| **A03 — Inyección** | PDO preparado con marcadores nombrados y `EMULATE_PREPARES` en `false` | Con la emulación apagada, los parámetros viajan separados de la sentencia y el motor nunca los lee como código |
| **A03 — XSS** | Todo dato del servidor entra al DOM con `.textContent` (`app.js` línea 82) | `textContent` escribe texto. Si una propiedad se llamara `<img onerror="...">`, se vería ese texto en pantalla, no se ejecutaría |
| **A07 — Fallas de identificación** | `session_regenerate_id(true)` tras el login y mensaje de error idéntico para e-mail inexistente y contraseña incorrecta | Lo primero frena la fijación de sesión; lo segundo evita que el login sirva para averiguar qué e-mails están registrados |

**Lo que no cumple:** no hay token anti-CSRF (la mitigación es `SameSite=Lax`),
no hay HTTPS en el entorno local y no hay límite de intentos de login, que
dejaría la puerta abierta a un ataque de fuerza bruta.

### 6. Usabilidad y accesibilidad

La característica que más refactorización exigió, y la respuesta a la pregunta
del coloquio sobre cuál fue.

El puntaje de Lighthouse arrancó en **92** y llegó a **100** después de
arreglar cuatro cosas:

1. **`<label>` con `aria-label`.** El menú hamburguesa de la AE1 usaba el truco
   del checkbox con un `<label aria-label="...">`. La regla
   `aria-prohibited-attr` lo rechaza: `label` no admite `aria-label`. Se
   reemplazó por un `<span class="solo-lectores">` con el texto adentro.
2. **Contraste insuficiente heredado de la paleta de la AE1.** El verde grisáceo
   `#6B7A6E` sobre papel daba 4,27:1 y el ocre `#C98A2C` daba 2,77:1; el mínimo
   de WCAG 2.1 para texto normal es 4,5:1. No alcanzaba con oscurecer los
   colores, porque el mismo ocre se usaba como **fondo** de la cinta
   "Destacada": oscurecerlo rompía ese contraste. Hubo que separar los tokens:
   `--color-ocre` para fondos y `--color-ocre-texto` para letras, más
   `--color-ocre-sobre-selva` para el texto que va sobre los bloques verdes.
3. **Nombre accesible que no contenía el texto visible.** Un botón que muestra
   "Ver 6 fotos" con `aria-label="Ver las fotos de ..."` falla la regla
   `label-content-name-mismatch`: quien usa control por voz dice lo que ve y el
   navegador no encuentra el control. Ahora el `aria-label` arranca con el texto
   visible.
4. **Orden de encabezados.** El catálogo saltaba de `h1` a los `h3` de las
   tarjetas. Se agregó el `h2` de la sección, oculto a la vista porque el banner
   ya dice de qué va la página, pero presente para el lector de pantalla.

Y una corrección que no venía de Lighthouse sino de nuestra propia prueba de
teclado: el router movía el foco al título **también en la primera carga**, así
que el primer `Tab` no caía en "Saltar al contenido" sino en el elemento
siguiente al título. Ahora el foco sólo se mueve en los cambios de vista
posteriores.

### 7. Mantenibilidad

Prueba práctica: agregar un tipo de propiedad nuevo toca tres lugares
localizados (el `ENUM` del script SQL, la constante `TIPOS_VALIDOS` de
`api/propiedades.php` y el objeto `ETIQUETAS_TIPO` de `app.js`). En la AE1,
agregar una propiedad significaba crear un archivo `.html` nuevo y copiar a
mano el encabezado completo.

**Lo que no cumple:** las credenciales de la base están escritas en
`config/conexion.php` en lugar de salir de un archivo de entorno fuera del
repositorio. Para XAMPP local alcanza; para un servidor de verdad, no.

---

## Resumen

| Característica | Estado | Evidencia principal |
|---|---|---|
| Adecuación funcional | Cumple | 53/53 API + 47/47 SPA |
| Eficiencia de desempeño | Cumple | JSON sin recargas, una consulta por listado |
| Compatibilidad | Cumple | API ejercida con `curl`, sin navegador |
| Fiabilidad | Cumple | 9 bloques `try/catch`, 3 transacciones con `rollBack` |
| Seguridad (OWASP) | Cumple | BCRYPT, 25 sentencias preparadas, `$_SESSION`, 401/403 probados |
| Usabilidad / Accesibilidad | Cumple | Lighthouse 100/100 en 9 vistas |
| Mantenibilidad | Cumple | Cuatro capas, un modelo por entidad, Git distribuido |

Las siete características cumplen. Las debilidades que encontramos quedaron
anotadas característica por característica y en las limitaciones del README,
porque un informe que sólo dice "Cumple" no es una auditoría.
