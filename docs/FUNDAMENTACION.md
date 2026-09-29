# Startup Relámpago — Opción 4: Registro y Autenticación de Usuarios

**Proyecto:** RN Inmobiliaria (tema del TP1: inmobiliaria de Posadas, Misiones)
**Módulo enriquecido con JavaScript:** pantalla de acceso (`acceso.html`) y la visibilidad por audiencia en todo el sitio.

---

## 1. Qué se implementó

| Archivo | Rol |
|---|---|
| `acceso.html` | Nueva pantalla con pestañas **Ingresar / Crear cuenta** y un panel de cuenta para el usuario autenticado. |
| `app.js` | Toda la lógica: eventos, validación, `fetch`, sesión y visibilidad por audiencia. Se incluye en todas las páginas. |
| `data/usuarios.json` | "Base de datos" local que hace de servidor simulado. |
| `style.css` | Estilos de pestañas, errores por campo, alertas, favoritos y aviso flotante. |
| Resto de páginas | El nav muestra **Ingresar** (visitante) o **Hola, Nombre · Salir** (usuario). |

### Cuentas de prueba

| E-mail | Contraseña |
|---|---|
| ana@rninmobiliaria.com | tierraroja26 |
| rodrigo@rninmobiliaria.com | posadas2026 |

> **Importante:** `fetch()` no funciona abriendo el HTML con doble clic (`file://`). Hay que servir el sitio, por ejemplo con la extensión **Live Server** de VS Code o con `python3 -m http.server`.

---

## 2. Requisitos transversales de JS

### 2.1 Desacoplamiento (`addEventListener`)

El HTML no tiene ningún `onclick` ni `onsubmit`. Todo se registra en `app.js` dentro de `DOMContentLoaded`:

```js
formLogin.addEventListener('submit', manejarLogin);
formRegistro.addEventListener('submit', manejarRegistro);
tab.addEventListener('click', () => activarPestana(tab.dataset.tab));
boton.addEventListener('click', manejarFavorito);
```

Cada manejador llama primero a `evento.preventDefault()` para **interceptar el envío** y que la página no se recargue.

### 2.2 Llamadas HTTP con `fetch` + `async/await`

```js
async function obtenerUsuarios() {
  const respuesta = await fetch('data/usuarios.json', { cache: 'no-store' });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const datos = await respuesta.json();
  ...
}
```

- `verificarCredenciales()` simula un `POST /api/login`: pide el JSON, busca el e-mail, compara la clave y **devuelve el usuario sin la contraseña**.
- `registrarUsuario()` simula un `POST /api/registro`: verifica que el e-mail no exista y guarda el nuevo usuario en `localStorage` (no se puede escribir un `.json` desde el navegador).
- Se agrega una demora de 700 ms para que se vea el estado de carga.
- Los errores de red se capturan con `try / catch` y se informan en pantalla.

---

## 3. Reto JS de la Opción 4

| Requisito | Cómo se cumple |
|---|---|
| Interceptar el envío del formulario de acceso | `addEventListener('submit', …)` + `preventDefault()` |
| Campos `type="password"` | Contraseña en login; contraseña y repetición en registro |
| Coincidencia de claves | `password2.value !== password.value` → "Las contraseñas no coinciden." |
| Longitud mínima | `LONGITUD_MINIMA = 8`, se valida en login y en registro |
| Llamada HTTP simulando verificación | `fetch('data/usuarios.json')` con `async/await` |
| Respuesta visual en pantalla | Alerta con 3 estados (**cargando**, **éxito**, **error**), botón deshabilitado con texto "Verificando…", errores debajo de cada campo con `aria-invalid` y foco en el primer campo con error |

Los formularios usan `novalidate` para que los mensajes los muestre nuestro JS (en español y con el estilo del sitio) y no el globo nativo del navegador.

---

## 4. Fundamentación U1 — Visibilidad mediante VSDM

VSDM es un método de diseño **centrado en la audiencia**: en lugar de partir de los datos o de las páginas, parte de **quiénes usan el sitio**, los agrupa en *clases de audiencia* y define **qué ve y qué puede hacer cada una**. En este módulo se usa para decidir la visibilidad entre la vista de **visitante** y la de **usuario autenticado**.

### 4.1 Declaración de misión

> Que cualquier persona pueda recorrer el catálogo de propiedades de RN Inmobiliaria sin barreras, y que quien cree una cuenta obtenga una experiencia personalizada (favoritos y solicitudes de compra más rápidas).

### 4.2 Modelado de audiencias

```
                 Visitante
          (toda persona que entra)
                     │  se registra / ingresa
                     ▼
            Usuario autenticado
     (hereda todo lo del visitante + extras)
```

El usuario autenticado es una **subclase** del visitante: puede hacer todo lo que hace el visitante y además tiene requisitos propios.

| Clase de audiencia | Características | Requisitos de información / funcionales |
|---|---|---|
| **Visitante** | Anónimo, llega desde redes o Google, está explorando. | Ver catálogo, fichas, precios, contacto y WhatsApp; poder crear una cuenta o ingresar. |
| **Usuario autenticado** | Ya está interesado, vuelve al sitio, quiere avanzar con una compra. | Todo lo anterior + guardar favoritos, ver sus datos, formulario de compra precargado, cerrar sesión. |

### 4.3 Matriz de visibilidad (resultado del diseño)

| Elemento | Visitante | Usuario autenticado |
|---|:---:|:---:|
| Catálogo, fichas, listado y contacto | ✅ | ✅ |
| Enlace **Ingresar** en el nav | ✅ | ❌ |
| Saludo **Hola, Nombre** + botón **Salir** en el nav | ❌ | ✅ |
| Formularios de ingreso / registro (`acceso.html`) | ✅ | ❌ |
| Panel **Mi cuenta** (`acceso.html`) | ❌ | ✅ |
| Cuentas de prueba (lateral de `acceso.html`) | ✅ | ❌ |
| Botón ♥ **favoritos** | Visible, pero invita a ingresar | Guarda / quita favoritos |
| Aviso "Ingresá y completamos tus datos" (`comprar.html`) | ✅ | ❌ |
| Nombre y e-mail precargados en `comprar.html` | ❌ | ✅ |

### 4.4 Cómo se traduce al código

La matriz se implementa de forma **declarativa** en el HTML con el atributo `data-vista`, y una única función en `app.js` la aplica:

```html
<li data-vista="visitante"><a href="acceso.html">Ingresar</a></li>
<li data-vista="usuario" hidden class="nav-usuario">…</li>
```

```js
function aplicarVista() {
  const audiencia = obtenerSesion() ? 'usuario' : 'visitante';
  document.querySelectorAll('[data-vista]').forEach((el) => {
    el.hidden = el.dataset.vista !== audiencia;
  });
  ...
}
```

Ventajas de este enfoque:

- **Separación de responsabilidades:** el HTML declara *a quién* va dirigido cada bloque; el JS solo decide *qué audiencia* está activa.
- **Escalable:** agregar un elemento exclusivo para usuarios es poner `data-vista="usuario"`, sin tocar JS.
- **Estado inicial seguro:** los elementos de usuario arrancan con `hidden`, así un visitante nunca los ve aunque el JS tarde en cargar.

La sesión se guarda en `sessionStorage` (dura mientras la pestaña esté abierta) y los favoritos en `localStorage`, separados por e-mail.

---

## 5. Limitaciones (es una simulación)

- Las contraseñas están en texto plano en un JSON público. En un sistema real se envían por HTTPS a un servidor que las compara contra un **hash** (bcrypt/argon2) y nunca se exponen al cliente.
- Ocultar elementos en el front-end es una decisión de **experiencia de usuario**, no de seguridad: la protección real de datos debe hacerse en el servidor.
- Los usuarios registrados se guardan solo en el navegador donde se crearon.
