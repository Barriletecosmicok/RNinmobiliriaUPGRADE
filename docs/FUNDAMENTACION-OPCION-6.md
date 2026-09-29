# Startup Relámpago — Opción 6: Galería Interactiva y Conmutador de Modo Oscuro/Claro

**Proyecto:** RN Inmobiliaria (tema del TP1: inmobiliaria de Posadas, Misiones)
**Módulo enriquecido con JavaScript:** sección *Propiedades destacadas* de `index.html` (galería) y el header de todas las páginas (conmutador de tema).

---

## 1. Qué se implementó

| Archivo | Rol |
|---|---|
| `data/propiedades.json` | Lista de propiedades (título, tipo, barrio, precio, fotos, si es destacada, link a la ficha). |
| `index.html` | La grilla de destacadas ya no está escrita a mano: se genera desde el JSON. Se agregaron los botones de control y el visor de fotos (`<dialog>`). |
| `app.js` | Carga con `fetch`, armado de tarjetas, filtros, resaltado, visor de fotos y cambio de tema. |
| `style.css` | Variables del tema oscuro, estilos de controles, tarjetas resaltadas y visor. |
| Todas las páginas | Botón ☾ / ☀ en el header para alternar el tema. |

> `fetch()` necesita que el sitio se sirva por HTTP (Live Server o `python3 -m http.server`). Abierto con doble clic (`file://`) la galería muestra un mensaje de error.

---

## 2. Reto JS de la Opción 6

| Requisito | Cómo se cumple |
|---|---|
| Escuchadores desacoplados en los botones de control | Todos los botones (filtros, resaltar, ver fotos, anterior/siguiente/cerrar, tema) se registran con `addEventListener` en `app.js`. No hay `onclick` en el HTML. |
| Cargar los destacados vía `fetch()` | `cargarGaleria()` hace `await fetch('data/propiedades.json')` y arma cada tarjeta con `createElement`. |
| Alternar el tema visual con `classList.toggle()` | `document.documentElement.classList.toggle('tema-oscuro')` |
| Destacar tarjetas con `classList.toggle()` | Botón **★ Resaltar destacadas** → `grilla.classList.toggle('modo-resaltado')`; filtros → `card.classList.toggle('is-oculta', …)` |

### 2.1 Carga asíncrona

```js
async function cargarGaleria() {
  try {
    const respuesta = await fetch(URL_PROPIEDADES, { cache: 'no-store' });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const datos = await respuesta.json();
    propiedades = datos.propiedades;
    grilla.replaceChildren(...propiedades.map(crearTarjeta));
  } catch (error) {
    estado.textContent = 'No pudimos cargar las propiedades…';
  }
}
```

Mientras carga se muestra "Cargando propiedades…"; al terminar, "Mostrando X de Y propiedades", que se actualiza con cada filtro.

### 2.2 Tema claro / oscuro

```js
function alternarTema() {
  const oscuro = document.documentElement.classList.toggle('tema-oscuro');
  localStorage.setItem('rn-tema', oscuro ? 'oscuro' : 'claro');
  actualizarBotonTema();
}
```

- En el CSS, `.tema-oscuro` **solo redefine las variables de color** (`--color-arena`, `--color-papel`, `--color-tinta`, …), así que todo el sitio cambia sin duplicar reglas.
- La elección se guarda en `localStorage` y se respeta en todas las páginas. La primera vez se usa la preferencia del sistema operativo (`prefers-color-scheme`).

### 2.3 Galería interactiva

- **Filtros** (Todas / Casas / Terrenos): agregan o quitan la clase `is-oculta` en cada tarjeta.
- **★ Resaltar destacadas**: agrega `modo-resaltado` a la grilla; las tarjetas con `destacada: true` se elevan con borde ocre y el resto se atenúa.
- **Ver fotos**: abre un visor modal (`<dialog>`) con botones anterior/siguiente, contador "2 / 6", flechas del teclado, <kbd>Esc</kbd> y click en el fondo para cerrar.
- Los **favoritos** (módulo de la Opción 4) siguen funcionando en las tarjetas nuevas gracias a la delegación de eventos.

---

## 3. Fundamentación U1 — Contextos navegacionales con OOHDM

OOHDM (*Object-Oriented Hypermedia Design Method*) separa el diseño de un sitio en cinco etapas:

1. Obtención de requerimientos
2. Diseño conceptual
3. **Diseño navegacional** ← foco de este módulo
4. Diseño de interfaz abstracta
5. Implementación

En el diseño navegacional se define **por dónde se mueve el usuario**: qué nodos ve, qué enlaces los unen y en qué **contexto navegacional** está. Un contexto es un **conjunto de nodos que se recorren juntos** (por ejemplo, "las casas" o "las fotos de esta propiedad"). El mismo objeto puede aparecer en varios contextos y verse o recorrerse distinto en cada uno.

### 3.1 Esquema conceptual (resumen)

```
┌──────────────────────┐ 1      tiene      * ┌──────────────┐
│      Propiedad       │─────────────────────│     Foto     │
├──────────────────────┤                     ├──────────────┤
│ titulo               │                     │ src          │
│ tipo (casa|terreno)  │                     │ alt          │
│ barrio               │                     └──────────────┘
│ precio               │
│ superficie           │
│ ambientes            │
│ destacada (sí/no)    │
└──────────────────────┘
```

### 3.2 Esquema de clases navegacionales

| Clase navegacional | Se muestra como | Atributos visibles |
|---|---|---|
| **Propiedad (resumen)** | Tarjeta en la galería | foto, tipo, título, barrio, precio, m², ambientes, ★ si es destacada |
| **Propiedad (ficha)** | Página `producto*.html` | todo lo anterior + descripción y características |
| **Foto** | Imagen en el visor | imagen, leyenda, posición "n / total" |

Enlaces: *Propiedad → Ficha* ("Ver ficha") y *Propiedad → Fotos* ("Ver fotos").

### 3.3 Esquema de contextos navegacionales

```
                        Menú principal (índice)
        ┌──────────────────┬───────────┴────────┬────────────────────┐
        ▼                  ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌──────────────────┐  ┌───────────────┐
│ Propiedades   │  │ Propiedades   │  │ Propiedades por  │  │ Todas las     │
│ destacadas    │  │ destacadas    │  │ tipo             │  │ propiedades   │
│ (inicio)      │  │ resaltadas    │  │  ├ Casas         │  │ (listado box /│
│               │  │ (destacada=sí)│  │  └ Terrenos      │  │  tabla)       │
└───────┬───────┘  └───────┬───────┘  └────────┬─────────┘  └───────┬───────┘
        └──────────────────┴─────────┬─────────┴────────────────────┘
                                     ▼
                        ┌─────────────────────────┐
                        │  Propiedad p            │
                        │  ├─► Ficha (nodo)       │
                        │  └─► Fotos de p         │
                        │       (recorrido guiado │
                        │        ‹ anterior │     │
                        │          siguiente ›)   │
                        └─────────────────────────┘
```

| Contexto | Criterio de pertenencia | Estructura de acceso | Cómo se navega | Implementación |
|---|---|---|---|---|
| **Propiedades destacadas** | Todas las del catálogo del inicio | Índice (grilla de tarjetas) | Libre: el usuario elige una tarjeta | `cargarGaleria()` con `fetch` |
| **Destacadas resaltadas** | `destacada = true` | Mismo índice, pero atenúa las que no pertenecen | Libre | `classList.toggle('modo-resaltado')` |
| **Propiedades por tipo: Casas / Terrenos** | `tipo = casa` / `tipo = terreno` (contexto agrupado por atributo) | Índice filtrado, con botones de chip como menú | Libre | `classList.toggle('is-oculta', …)` |
| **Todas las propiedades** | Todas | Índice en `listado_box.html` y `listado_tabla.html` | Libre | HTML estático (TP1) |
| **Fotos de la propiedad p** | Las fotos asociadas a *p* (contexto por relación) | Visor modal | **Recorrido guiado**: anterior / siguiente, con contador y sin salir del contexto | `abrirVisor()`, `moverVisor(±1)` |

### 3.4 Decisiones que salen del modelo

- **La misma propiedad cambia según el contexto** (clases *InContext* de OOHDM). En *Destacadas resaltadas*, una propiedad destacada se muestra elevada y con borde ocre. En *Casas*, un terreno directamente no forma parte del contexto y se oculta.
- **Recorrido guiado para las fotos.** Las fotos de una propiedad tienen un orden natural, así que se recorren con anterior/siguiente. En la primera foto se deshabilita "anterior" y en la última "siguiente": son los límites del contexto.
- **Cambiar de contexto no recarga la página.** Los filtros y el resaltado solo cambian clases CSS, así que el usuario no pierde su lugar.
- **El tema claro/oscuro no es un contexto.** Es una decisión de la **interfaz abstracta** (etapa 4): cambia *cómo* se ven los nodos, no *cuáles* se ven ni *cómo se llega* a ellos. Por eso se resolvió solo con variables CSS y aplica igual en todos los contextos.
