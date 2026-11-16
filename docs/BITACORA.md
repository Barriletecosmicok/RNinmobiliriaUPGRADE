# Bitácora de desarrollo — AE4 / TIFAS

Proyecto: RN Inmobiliaria
Materia: Paradigmas y Lenguajes de Programación III — Ing. Sicardi Dante
Equipo: Roa, Santino · Calamari, Santino · De Olivera, Jesús Emanuel

---

## 1. Sesiones de trabajo

| Fecha | Tarea | Quién | Qué se hizo | Problema que apareció | Evidencia | Resultado |
|---|---|---|---|---|---|---|
| 12/11/2026 | Lectura de la consigna y relevamiento del punto de partida | Los tres | Se releyó la consigna de la AE4 y se revisó el repositorio tal como quedó después del Startup Relámpago: siete HTML estáticos, `app.js`, `style.css` y dos archivos JSON como "base de datos" | La AE2 había dejado tres limitaciones escritas (contraseñas en texto plano, seguridad sólo en el navegador, datos por navegador). Había que decidir si se arrancaba de cero o se evolucionaba | `README.md`, tabla de la sección "Qué es esto" | Se decidió evolucionar: las tres limitaciones pasaron a ser los objetivos de la AE4 |
| 12/11/2026 | Recuperación de la línea base de Casos de Uso | Los tres | Se recuperó el informe corregido de la AE1 y se tomaron los cinco Casos de Uso especificados (UC1 a UC5) como línea base | El código tenía una numeración provisoria que no coincidía con la del informe de la AE1 | `docs/TRAZABILIDAD.md`, sección 1 | Se renumeraron las referencias de los 12 archivos. UC6, UC7 y UC8 formalizan lo de la AE2 y UC9 es el único caso nuevo |
| 12/11/2026 | Diseño y creación de la base de datos | Roa | Seis tablas en InnoDB con claves foráneas, `password VARCHAR(255)` y datos de prueba migrados desde `data/propiedades.json` | Al importar por consola los acentos quedaron como "BenÃ­tez": el cliente de `mysql` interpretaba los bytes UTF-8 como latin1 | `database/rn_inmobiliaria.sql`, línea 27 | Se agregó `SET NAMES utf8mb4;` al script. Queda resuelto para quien lo importe, sin depender de cómo tenga configurado su cliente |
| 12/11/2026 | Capa de infraestructura | Calamari | `conexion.php` con PDO Singleton, `respuesta.php` con las cabeceras y los códigos HTTP, `sesion.php` con el arranque de sesión y las guardas | Había que decidir qué código devolver cuando el usuario sí está autenticado pero su rol no alcanza | `config/sesion.php`, línea 97 | Se usa 401 para la petición anónima, como pide la consigna, y 403 para el rol insuficiente, que es lo que define el estándar HTTP |
| 12/11/2026 | Modelos de acceso a datos | Roa y Calamari | Cuatro modelos con 25 sentencias preparadas y marcadores nombrados. Las operaciones de dos tablas van en transacción | El listado del catálogo pedía una consulta por propiedad para traer sus fotos | `models/PropiedadModel.php`, líneas 21 a 47 | Se resolvió con un `LEFT JOIN` y el reagrupado en PHP: una sola consulta para todo el listado |
| 12/11/2026 | Endpoints REST | Roa y Calamari | Siete endpoints con BCRYPT, `session_regenerate_id(true)`, validación en el servidor y `try/catch` de `PDOException` | — | `api/` | Los siete devuelven JSON con código HTTP semántico |
| 12/11/2026 | Prueba de la API | Calamari | 53 casos con `curl`: válidos, inválidos, anónimos, de rol insuficiente y tres intentos de inyección SQL | — | `docs/evidencias/salida-prueba-api.txt` | **53 de 53**. Los intentos de inyección devuelven 401 y 400, nunca acceso |
| 12/11/2026 | Conversión de la maqueta en SPA | De Olivera | Las siete páginas de la AE1 pasaron a ser siete `<section>` de un único `index.html`, con router por hash. Se conservaron las estructuras semánticas y el CSS | Al entrar directo a `#/propiedad/3`, el visor de fotos no tenía el listado cargado | `public/js/app.js`, función `abrirVisor` | El visor busca primero en el listado y, si no está, usa la propiedad de la ficha abierta. Queda anotado en las limitaciones del README |
| 12/11/2026 | Cliente JavaScript | De Olivera | Router, cliente `fetch` con `async/await`, render con `.textContent`, delegación de eventos para los elementos creados después de la carga | — | `public/js/app.js` | Cero `innerHTML` con datos del servidor y cero `onclick` en el HTML |
| 12/11/2026 | Prueba funcional de la SPA | De Olivera | 47 casos con Chrome en modo headless, operando la interfaz con Tab y Enter | El test marcaba como error los 403 y 400 que él mismo provoca a propósito | `docs/evidencias/salida-prueba-spa.txt` | Se separaron las excepciones de JavaScript (deben ser cero) de los códigos de error esperados. **47 de 47** |
| 12/11/2026 | Auditoría de accesibilidad | De Olivera | Lighthouse sobre las nueve vistas, incluidas las que exigen sesión, pasándole la cookie `PHPSESSID` de un cliente y de un agente | Arrancó en **92/100** con cuatro fallas: `aria-label` en un `<label>`, dos contrastes por debajo de 4,5:1, un nombre accesible que no contenía el texto visible y un salto de `h1` a `h3` | `docs/evidencias/lighthouse/` | **100/100 en las nueve vistas**. El detalle de cada arreglo está en `docs/AUDITORIA-ISO-25010.md`, característica 6 |
| 12/11/2026 | Prueba de teclado | De Olivera | Se verificó que el primer Tab caiga en "Saltar al contenido" | No caía: el router movía el foco al título también en la primera carga | `public/js/app.js`, variable `primeraRuta` | El foco ahora sólo se mueve en los cambios de vista posteriores |
| 12/11/2026 | Documentación | Los tres | README con el despliegue en XAMPP, matriz de trazabilidad y ficha ISO/IEC 25010 con archivo y línea de cada evidencia | — | `README.md`, `docs/TRAZABILIDAD.md`, `docs/AUDITORIA-ISO-25010.md` | Las 17 citas de archivo y línea de la ficha se verificaron una por una |
| 15/11/2026 | Presentación interactiva para la defensa | De Olivera (pidió y definió la idea), el asistente la armó | Pantalla dividida con la aplicación real y un panel de código. Los fragmentos se cortan de los archivos reales con un script, no se copian a mano. Tiene casos de uso, una sección por integrante, pruebas, ISO y repositorio | La computadora de presentación tiene 4 GB de RAM y no aguanta abrir Visual Studio Code durante la defensa. Al elegir un caso desde los chips, la ruta de la página lo pisaba y volvía al anterior; al cerrar sesión pasaba lo mismo por la redirección automática | `defensa/`, 34 comprobaciones con Chrome sin ventana | Los 67 fragmentos coinciden con los archivos. Se corrigieron los dos problemas de navegación y se agregó una ventana de 0,6 s que da prioridad a la acción del usuario |
| 16/11/2026 | Presentación: secciones por integrante reemplazadas por un recorrido | De Olivera (lo pidió, para que se vea como una presentación con un hilo), el asistente lo armó | Las tres pestañas por persona pasaron a una sola, "El recorrido": 18 láminas con una idea cada una, ordenadas de la base de datos al navegador. Cada lámina dice qué resuelve y muestra su código real. | Ninguno | Prueba en navegador: 18 comprobaciones, sin errores de JS ni desborde horizontal en 1366x768 y 390x844 | Hecho |
| 16/11/2026 | Presentación rehecha según la dinámica del coloquio (punto 7 de la consigna) | De Olivera (pidió que responda solo a eso y conserve página y código), el asistente la armó | Seis secciones pasaron a tres: demostración por teclado con contador de Tab, Enter y mouse; evidencia de auditoría; interrogatorio con los tres temas de la consigna. La explicación de OWASP resalta el código línea por línea. | Con la página al 42 % del ancho el menú se volvía hamburguesa; se ensanchó la columna a 660 px mínimo | Prueba en Chrome sin ventana: Tab y Enter marcan los pasos, mouse en 0, 10 pasos de PDO y los de BCRYPT y sesión anclados a líneas reales, sin errores de JS | Hecho |
---

## 2. Producción propia y uso del asistente

Esta sección existe para que quede claro qué parte del trabajo hizo cada uno.

**Lo que aportó el asistente (Claude):** el código base de las cuatro capas
(`config/`, `models/`, `api/`, `public/`), el script SQL, las tres pruebas
automáticas y el borrador de los tres documentos. También detectó y corrigió
los cuatro problemas de accesibilidad que bajaban el puntaje de Lighthouse, el
problema de codificación al importar la base y el del foco en la primera carga.

**Lo que tiene que hacer el equipo antes del coloquio:**

1. Levantar el proyecto en XAMPP en la máquina propia y comprobar que la base
   importa y que el sitio responde en `http://localhost/`.
2. Correr las tres pruebas automáticas y verificar que dan los mismos números.
3. Correr Lighthouse desde Chrome DevTools y guardar la captura del 100/100.
   La auditoría automática ya dio 100, pero la consigna pide la captura de
   DevTools y la defensa se hace proyectando esa herramienta.
4. Leer y entender su parte, línea por línea. En el coloquio cada uno responde
   por **todo** el trabajo, no sólo por lo suyo: hay que poder explicar la
   remediación OWASP y la trazabilidad desde los Casos de Uso de la AE1.
5. Escribir su propia reflexión individual en la sección 4, con sus palabras.

**Reparto para estudiar y defender:**

| Integrante | Su parte | Lo que más le van a preguntar |
|---|---|---|
| Calamari, Santino | `config/sesion.php`, `config/conexion.php`, `UsuarioModel`, endpoints de autenticación | Por qué BCRYPT y no un cifrado reversible; qué hace `session_regenerate_id(true)`; por qué el mismo mensaje de error para e-mail inexistente y contraseña incorrecta |
| Roa, Santino | Script SQL, los tres modelos de datos, `propiedades.php`, `favoritos.php`, `solicitudes.php` | Por qué `EMULATE_PREPARES` en `false`; qué pasa si falla una transacción a mitad de camino; por qué `favoritos` es una tabla y no una columna |
| De Olivera, Jesús | `index.html`, `app.js`, `estilos.css`, las dos pruebas del frontend | Por qué `.textContent` y no `.innerHTML`; qué hace `aria-live="polite"`; qué característica ISO exigió más refactorización y por qué |

---

## 3. Decisiones de diseño que hubo que tomar

| Decisión | Alternativas que se miraron | Por qué se eligió esta |
|---|---|---|
| Router por hash (`#/propiedades`) | History API con URLs limpias | El hash no necesita reglas de reescritura en Apache. Con la History API, recargar `/propiedades` en XAMPP da 404 salvo que se configure un `.htaccess` |
| 403 para el rol insuficiente | Usar 401 para todo, como lista la consigna | 401 significa "no sé quién sos" y 403 "sé quién sos y no te alcanza". Se implementaron los dos y la diferencia quedó documentada en el README |
| Baja física con `DELETE` más baja lógica con `activa` | Sólo una de las dos | La consigna pide la "D" del CRUD, así que el `DELETE` real tiene que existir. La baja lógica se agregó porque borrar una propiedad con solicitudes históricas asociadas destruye información del negocio |
| Se quitó el formulario de contacto de la portada | Dejarlo con `action="#"` como en la AE1 | Un formulario que no guarda nada es exactamente el problema que esta entrega vino a resolver. Se reemplazó por el botón de WhatsApp y el enlace a la solicitud de compra |
| Dos tokens de color, uno para texto y otro para fondo | Oscurecer el color original | El ocre se usaba como color de letra y como fondo de la cinta "Destacada". Oscurecerlo arreglaba el primer caso y rompía el segundo |
| El filtro de la portada es visual y el del catálogo va al servidor | Que los dos vayan al servidor | El de la portada es el de la Opción 6 de la AE2 y se conserva para mostrar la evolución. El del catálogo demuestra UC2 resuelto con SQL |

---

## 4. Reflexión individual

> Cada integrante escribe su propia reflexión, con sus palabras. No la escribe
> el asistente. Dos o tres párrafos: qué hiciste, qué te costó, qué aprendiste
> y qué harías distinto.

### Roa, Santino

_(a completar)_

### Calamari, Santino

_(a completar)_

### De Olivera, Jesús Emanuel

_(a completar)_
