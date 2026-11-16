# RN Inmobiliaria — AE4 / TIFAS

Sistema web de gestión de venta de propiedades para RN Inmobiliaria, una
inmobiliaria de Posadas, Misiones.

**Universidad de la Cuenca del Plata — Sede Posadas**
Ingeniería en Sistemas de Información
Paradigmas y Lenguajes de Programación III — Ing. Sicardi Dante

**Equipo:** Roa, Santino · Calamari, Santino · De Olivera, Jesús Emanuel

---

## Qué es esto

Una *Single Page Application* en JavaScript Vanilla que consume una API REST
escrita en PHP sobre MySQL. Es la cuarta etapa de un mismo proyecto:

| Etapa | Qué se entregó | Con qué |
|---|---|---|
| **AE1** | Maqueta estática de siete páginas, responsive, con los cinco Casos de Uso especificados | HTML5 + CSS3 |
| **AE2** (Startup Relámpago) | Registro y autenticación simulados (Opción 4, VSDM) y galería interactiva con modo oscuro (Opción 6, OOHDM) | JavaScript Vanilla + `fetch` sobre archivos JSON |
| **AE4** | Esta entrega: backend real, base de datos, seguridad OWASP y accesibilidad auditada | PHP 8 + PDO + MySQL + JS Vanilla |

La AE2 cerraba con tres limitaciones declaradas por escrito. La AE4 existe
para resolverlas:

| Limitación declarada en la AE2 | Cómo se resolvió en la AE4 |
|---|---|
| "Las contraseñas están en texto plano en un JSON público" | Se guardan como hash BCRYPT de 60 caracteres con `password_hash()`; se verifican con `password_verify()` |
| "Ocultar elementos en el navegador no protege datos; la seguridad real debe estar en el servidor" | Cada endpoint protegido valida `$_SESSION` y corta con 401 o 403 antes de tocar la base |
| "Las cuentas nuevas y los favoritos se guardan solo en el navegador donde se crearon" | Usuarios, favoritos y solicitudes viven en MySQL y siguen al usuario a cualquier dispositivo |

---

## Arquitectura

Patrón **Modelo-Vista-Controlador desacoplado**. El cliente y el servidor se
hablan únicamente por HTTP con cuerpos JSON: la vista no sabe nada de SQL y el
servidor no genera ni una línea de HTML.

```
RNinmobiliriaUPGRADE/
│
├── config/                       Infraestructura compartida
│   ├── conexion.php              Conexión PDO única (Singleton) a MySQL
│   ├── respuesta.php             Cabeceras JSON, códigos HTTP y lectura del cuerpo
│   └── sesion.php                Arranque de sesión, login, logout y guardas de acceso
│
├── models/                       MODELO — acceso a datos puro, todo con PDO preparado
│   ├── UsuarioModel.php          usuarios
│   ├── PropiedadModel.php        propiedades + fotos
│   ├── FavoritoModel.php         favoritos
│   └── SolicitudModel.php        solicitudes + solicitud_propiedad
│
├── api/                          CONTROLADOR — endpoints REST, uno por recurso
│   ├── registro.php              POST    crear cuenta
│   ├── login.php                 POST    iniciar sesión
│   ├── logout.php                POST    cerrar sesión
│   ├── sesion.php                GET     ¿quién está autenticado?
│   ├── propiedades.php           GET POST PUT DELETE   catálogo y CRUD del agente
│   ├── favoritos.php             GET POST DELETE       favoritos del usuario
│   └── solicitudes.php           GET POST PATCH        solicitudes de compra
│
├── public/                       VISTA — la SPA, evolución de la maqueta de AE1
│   ├── index.html                Único HTML: todas las vistas del router
│   ├── css/
│   │   └── estilos.css           El CSS de la AE1 más lo que agregó la SPA
│   ├── js/
│   │   └── app.js                Router, cliente fetch y render del DOM
│   └── img/                      Fotografías de las propiedades
│
├── database/
│   └── rn_inmobiliaria.sql       Script completo: crea la base y carga datos de prueba
│
├── docs/
│   ├── TRAZABILIDAD.md           Casos de Uso de AE1 → endpoints → tablas → vistas
│   ├── AUDITORIA-ISO-25010.md    Ficha de autoevaluación de calidad
│   ├── FUNDAMENTACION-OPCION4.md Informe VSDM de la AE2 (Calamari)
│   ├── FUNDAMENTACION-OPCION-6.md     Informe OOHDM de la AE2 (De Olivera)
│   └── evidencias/               Pruebas automáticas y sus salidas
│
├── ESTADO_TAREAS.md              Estado de cada tarea y quién la hizo
└── README.md                     Este archivo
```

### Por qué una sola página

En la AE1 cada pantalla era un archivo `.html` y cambiar de sección recargaba
todo el sitio. Ahora hay un único `index.html` con una `<section>` por vista.
El router lee el hash de la URL y muestra la que corresponde:

| Hash | Vista | Caso de Uso |
|---|---|---|
| `#/inicio` | Portada con destacadas | UC1, UC2 |
| `#/propiedades` | Catálogo completo con filtros | UC1, UC2 |
| `#/propiedad/:id` | Ficha de una propiedad | UC3, UC5 |
| `#/acceso` | Ingreso y registro | UC6, UC7 |
| `#/comprar` | Solicitud de compra | UC4 |
| `#/favoritos` | Propiedades guardadas | UC8 |
| `#/panel` | Panel del agente | UC9 |

---

## Cómo levantarlo en XAMPP

### 1. Copiar el proyecto en htdocs

Clonalo o descomprimilo dentro de la carpeta `htdocs` de XAMPP, de modo que
quede así:

```
C:\xampp\htdocs\RNinmobiliriaUPGRADE\
```

En Linux o macOS la ruta suele ser `/opt/lampp/htdocs/` o
`/Applications/XAMPP/htdocs/`.

### 2. Arrancar Apache y MySQL

Abrí el **XAMPP Control Panel** y tocá **Start** en `Apache` y en `MySQL`.
Los dos tienen que quedar en verde.

### 3. Crear la base de datos

Son dos caminos, cualquiera sirve.

**Con phpMyAdmin (recomendado):**

1. Entrá a <http://localhost/phpmyadmin>
2. Pestaña **Importar**
3. **Seleccionar archivo** → `database/rn_inmobiliaria.sql`
4. Abajo, **Importar**

El script borra la base `rn_inmobiliaria` si ya existía, la vuelve a crear con
sus seis tablas y carga tres propiedades con sus fotos y dos usuarios de prueba.

**Por consola:**

```bash
mysql --default-character-set=utf8mb4 -u root -p < database/rn_inmobiliaria.sql
```

El parámetro `--default-character-set=utf8mb4` importa: sin él, algunos
clientes de consola interpretan mal los acentos y "Benítez" queda guardado
como "BenÃ­tez".

### 4. Revisar los datos de conexión

Si tu MySQL de XAMPP tiene contraseña para `root`, abrí
`config/conexion.php` y completá la constante `CLAVE`:

```php
private const USUARIO = 'root';
private const CLAVE   = '';     // poné acá la contraseña si configuraste una
```

### 5. Abrir el sitio

<http://localhost/RNinmobiliriaUPGRADE/public/>

> El sitio **no funciona** abriendo `index.html` con doble clic. Con el
> protocolo `file://` el navegador bloquea `fetch()` y PHP no se ejecuta.
> Tiene que ir por Apache, es decir por `http://localhost/`.

### Cuentas de prueba

| E-mail | Contraseña | Rol | Qué puede hacer |
|---|---|---|---|
| `ana@rninmobiliaria.com` | `tierraroja26` | cliente | Guardar favoritos y enviar solicitudes |
| `rodrigo@rninmobiliaria.com` | `posadas2026` | agente | Todo lo anterior más el CRUD de propiedades y el seguimiento de solicitudes |

En la base las dos contraseñas están hasheadas con BCRYPT. Los hashes del
script se generaron con `password_hash('tierraroja26', PASSWORD_BCRYPT)`.

---

## Inventario de la API

Todos los endpoints devuelven `Content-Type: application/json; charset=utf-8`
y una propiedad `ok` que dice si la operación salió bien.

| Método | URL | Entrada | Salidas | Acceso |
|---|---|---|---|---|
| GET | `/api/propiedades.php` | — | 200 · 500 | Público |
| GET | `/api/propiedades.php?tipo=casa` | — | 200 · 400 · 500 | Público |
| GET | `/api/propiedades.php?id=1` | — | 200 · 400 · 404 · 500 | Público |
| GET | `/api/propiedades.php?todas=1` | — | 200 · 401 · 403 | Agente |
| POST | `/api/propiedades.php` | `titulo, tipo, barrio, precio, superficie, ambientes, descripcion, destacada, activa, fotos[]` | 201 · 400 · 401 · 403 · 409 · 500 | Agente |
| PUT | `/api/propiedades.php?id=1` | igual que POST | 200 · 400 · 401 · 403 · 404 · 409 · 500 | Agente |
| DELETE | `/api/propiedades.php?id=1` | — | 200 · 400 · 401 · 403 · 404 · 500 | Agente |
| POST | `/api/registro.php` | `nombre, email, password, password2` | 201 · 400 · 409 · 500 | Público |
| POST | `/api/login.php` | `email, password` | 200 · 400 · 401 · 500 | Público |
| POST | `/api/logout.php` | — | 200 | Público |
| GET | `/api/sesion.php` | — | 200 · 500 | Público |
| GET | `/api/favoritos.php` | — | 200 · 401 · 500 | Con sesión |
| POST | `/api/favoritos.php` | `propiedad_id` | 201 · 200 · 400 · 401 · 404 · 500 | Con sesión |
| DELETE | `/api/favoritos.php?propiedad_id=1` | — | 200 · 400 · 401 · 404 · 500 | Con sesión |
| GET | `/api/solicitudes.php` | — | 200 · 401 · 500 | Con sesión |
| GET | `/api/solicitudes.php?todas=1` | — | 200 · 401 · 403 · 500 | Agente |
| POST | `/api/solicitudes.php` | `nombre, telefono, direccion, email, medio_pago, mensaje, propiedades[]` | 201 · 400 · 401 · 500 | Con sesión |
| PATCH | `/api/solicitudes.php?id=1` | `estado` | 200 · 400 · 401 · 403 · 404 · 500 | Agente |

### Sobre el 401 y el 403

La consigna pide 401 para las peticiones anónimas y así está implementado.
Se agregó el 403 para un caso distinto: un usuario **que sí inició sesión**
pero cuyo rol no alcanza. La diferencia es la que define el estándar HTTP:
401 es "no sé quién sos", 403 es "sé quién sos y no te alcanza". Un cliente
autenticado que intenta borrar una propiedad recibe 403.

---

## Base de datos

Seis tablas en InnoDB con `utf8mb4_unicode_ci`.

```
usuarios (id, nombre, email UNIQUE, password, rol, creado_en)
    │
    ├──< favoritos (usuario_id, propiedad_id)  UNIQUE(usuario_id, propiedad_id)
    │         │
    └──< solicitudes (usuario_id, nombre, telefono, direccion, email,
         │            medio_pago, mensaje, estado, creado_en)
         │
         └──< solicitud_propiedad (solicitud_id, propiedad_id)
                    │
propiedades (id, slug UNIQUE, titulo, tipo, barrio, precio, superficie,
    │        ambientes, descripcion, destacada, activa, creado_en, actualizado_en)
    │
    └──< fotos (propiedad_id, ruta, texto_alt, orden)
```

Decisiones que vale aclarar:

- `password` es `VARCHAR(255)` y no `VARCHAR(60)`: hoy BCRYPT devuelve 60
  caracteres, pero si mañana se cambia a Argon2 el hash es más largo y la
  columna no habría que migrarla.
- `propiedades.activa` permite la **baja lógica**: la propiedad deja de
  publicarse pero no se borra, así las solicitudes históricas siguen teniendo
  sentido. El `DELETE` del panel es una baja física y arrastra en cascada las
  fotos, los favoritos y los renglones de solicitudes.
- `fotos.texto_alt` es `NOT NULL` a propósito. Una foto sin texto alternativo
  rompe el criterio 1.1.1 de WCAG 2.1, así que la base no la deja entrar.
- `solicitud_propiedad` existe porque el formulario de compra de la AE1
  permitía marcar más de una propiedad: es una relación de muchos a muchos.

---

## Pruebas automáticas

Las tres se corren con el proyecto servido y la base importada. Sus salidas
están guardadas en `docs/evidencias/`.

```bash
# 1. API REST: 53 casos (válidos, inválidos, anónimos e inyección SQL)
BASE=http://localhost/RNinmobiliriaUPGRADE/api bash docs/evidencias/prueba-api.sh

# 2. SPA de punta a punta: 47 casos, incluida la operación por teclado
npm install puppeteer-core
node docs/evidencias/prueba-spa.js

# 3. Accesibilidad con Lighthouse en las 9 vistas
npm install -g lighthouse
node docs/evidencias/auditar-accesibilidad.js
```

| Prueba | Resultado | Evidencia |
|---|---|---|
| API REST | 53 / 53 | `docs/evidencias/salida-prueba-api.txt` |
| SPA funcional | 47 / 47 | `docs/evidencias/salida-prueba-spa.txt` |
| Lighthouse accesibilidad | 100/100 en 9 de 9 vistas | `docs/evidencias/lighthouse/` |

---

## Accesibilidad

La interfaz se opera completa con `Tab` y `Enter`, sin tocar el mouse.

- El primer `Tab` cae en **Saltar al contenido principal**.
- Todo control interactivo es un `<button>` o un `<a>` nativo. No hay un solo
  `<div>` con `click`.
- El foco se ve siempre: `:focus-visible` dibuja un contorno ocre de 3 px.
- Al cambiar de vista el foco pasa al título y la sección se anuncia en una
  región `aria-live="polite"`. En la primera carga el foco **no** se mueve,
  para que el primer `Tab` siga llegando al enlace de salto.
- Los 14 contenedores que reciben respuestas de la API tienen
  `aria-live="polite"`, así el lector de pantalla lee el resultado del `fetch`
  sin que haya que ir a buscarlo.
- El visor de fotos es un `<dialog>` nativo: el navegador encierra el foco
  adentro y lo cierra con `Escape`.
- Todos los colores de texto llegan a 4,5:1 de contraste. Para lograrlo hubo
  que separar los tokens de color de texto de los de fondo: el mismo ocre que
  funciona como fondo de una cinta no sirve como color de letra sobre papel.

---

## Presentación interactiva para la defensa

La carpeta `defensa/` tiene una herramienta aparte para el coloquio. No es parte del producto: no toca `public/`, `api/` ni `models/`.

Muestra la aplicación real en un lado y el código en el otro. Al tocar un botón o un formulario de la página, el panel pasa solo a la cadena de esa función: el HTML, el evento y el `fetch`, el endpoint PHP y el modelo con su consulta SQL, siempre con archivo y número de línea. La pestaña "En vivo" registra los pedidos reales con su respuesta. Además tiene una sección por integrante, las pruebas con sus resultados, la auditoría ISO y el reparto de commits.

Para abrirla hay que servirla desde el mismo servidor que la SPA, porque necesita leer el iframe de la aplicación:

```
http://localhost/<carpeta>/defensa/            (XAMPP)
http://localhost:8080/defensa/                 (php -S localhost:8080 -t .)
```

Los fragmentos de código no están copiados a mano: `defensa/generar.py` los corta de los archivos reales y los guarda en `defensa/datos.js`, junto con los resultados de `docs/evidencias/` y el reparto de commits de `git log`. Si se cambia el código, se regenera con:

```
python3 defensa/generar.py
```

Si algún fragmento deja de encontrarse, el script falla y dice cuál. Las seis secciones son Inicio, Casos de uso, El recorrido (18 láminas que siguen el camino de un dato: base de datos, servidor, navegador y calidad), Pruebas, ISO 25010 y Repositorio. Atajos: `1` a `6` cambian de sección, `←` `→` cambian de caso de uso o de lámina, `V` alterna página, dividido y código, `?` muestra la ayuda.

## Limitaciones conocidas

Las decimos nosotros antes de que las encuentre la cátedra:

1. **Sin HTTPS.** La cookie de sesión se emite sin el atributo `secure`,
   porque en `http://localhost` el navegador la descartaría. La línea está en
   `config/sesion.php`, comentada y lista para activar al publicar.
2. **Sin token anti-CSRF.** La mitigación actual es `SameSite=Lax` en la
   cookie, que alcanza para los casos habituales pero no reemplaza un token
   por formulario.
3. **Las fotos se cargan por ruta, no por subida de archivo.** El panel del
   agente pide la ruta del archivo y su texto alternativo; no hay un
   `<input type="file">` con validación de tipo y tamaño, que es trabajo
   suficiente para una entrega propia.
4. **El visor de fotos de la portada depende del listado ya cargado.** Si se
   entra directo a una ficha por su hash, el visor usa la propiedad de esa
   ficha; funciona, pero son dos caminos distintos para lo mismo.
5. **Las imágenes pesan.** Los PNG del catálogo vienen de la AE1 y rondan los
   2 MB cada uno. No afecta la auditoría de accesibilidad, pero sí al puntaje
   de Rendimiento de Lighthouse.
