/* =====================================================================
   RN Inmobiliaria — AE4 / TIFAS
   public/js/app.js

   Cliente de la Single Page Application. JavaScript Vanilla, sin
   frameworks ni librerías externas.

   Qué cumple este archivo:
   · Desacoplamiento: el HTML no tiene un solo onclick. Todo evento se
     registra acá con addEventListener().
   · Asincronía no bloqueante: cada llamada al backend usa fetch() con
     async/await y maneja los errores con try/catch.
   · Mitigación de XSS (OWASP A03): los datos que llegan del servidor se
     escriben en el DOM con .textContent, nunca con .innerHTML. Si una
     propiedad se llamara <img onerror="...">, se vería como texto.
   · Accesibilidad: al cambiar de vista el foco va al título y el cambio
     se anuncia en una región aria-live.

   Organización del archivo:
     1. Constantes y estado          6. Sesión y visibilidad VSDM
     2. Utilidades del DOM           7. Tarjetas de propiedad
     3. Cliente HTTP                 8. Visor de fotos
     4. Mensajes y anuncios          9. Vistas (inicio, catálogo, ficha,
     5. Tema claro / oscuro             acceso, comprar, favoritos, panel)
                                    10. Router y arranque
   ===================================================================== */
(() => {
  'use strict';

  /* ===================================================================
     1. CONSTANTES Y ESTADO
     =================================================================== */

  // La SPA vive en /public y la API en /api: un nivel más arriba.
  const API = '../api';

  const CLAVE_TEMA = 'rn-tema';
  const LARGO_MINIMO_CLAVE = 8;

  // Estado en memoria. No guarda nada sensible: la verdad sobre la sesión
  // siempre la tiene el servidor en $_SESSION.
  const estado = {
    usuario: null,        // { id, nombre, email, rol } o null
    favoritos: [],        // ids de propiedades marcadas
    propiedades: [],      // último listado traído del catálogo
    fichaActual: null,    // propiedad abierta en la vista de ficha
    editando: null,       // id de la propiedad que el agente está editando
  };

  const formatoPrecio = new Intl.NumberFormat('es-AR');

  const ETIQUETAS_TIPO = {
    casa: 'Casa',
    terreno: 'Terreno',
    departamento: 'Departamento',
    local: 'Local comercial',
  };

  const ETIQUETAS_PAGO = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia bancaria',
    financiacion: 'Financiación con la inmobiliaria',
    'credito-hipotecario': 'Crédito hipotecario',
    tarjeta: 'Tarjeta de crédito',
  };

  /* ===================================================================
     2. UTILIDADES DEL DOM
     =================================================================== */

  const $ = (selector, raiz = document) => raiz.querySelector(selector);
  const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

  /**
   * Crea un elemento y le pone texto con textContent.
   * Centralizar la creación acá es lo que garantiza que en todo el
   * archivo no exista un solo .innerHTML con datos del servidor.
   */
  function crear(etiqueta, clase, texto) {
    const el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined && texto !== null) el.textContent = String(texto);
    return el;
  }

  /** Deja un contenedor vacío sin usar innerHTML = ''. */
  function vaciar(contenedor) {
    if (contenedor) contenedor.replaceChildren();
  }

  function precioEnDolares(valor) {
    return `USD ${formatoPrecio.format(Number(valor))}`;
  }

  function etiquetaTipo(tipo) {
    return ETIQUETAS_TIPO[tipo] || tipo;
  }

  function fechaLegible(texto) {
    if (!texto) return '';
    const fecha = new Date(texto.replace(' ', 'T'));
    return Number.isNaN(fecha.getTime())
      ? texto
      : fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  /* ===================================================================
     3. CLIENTE HTTP
     =================================================================== */

  /**
   * Hace una petición a la API y devuelve el código HTTP junto al cuerpo.
   *
   * No lanza excepción cuando el servidor responde 400 o 401: esos códigos
   * son respuestas legítimas que cada vista interpreta. Sí avisa cuando no
   * hay red o cuando el servidor devolvió algo que no es JSON.
   */
  async function pedir(ruta, opciones = {}) {
    const configuracion = {
      method: opciones.metodo || 'GET',
      // Manda la cookie de sesión de PHP. Es same-origin porque la SPA y la
      // API se sirven desde el mismo host (localhost).
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    };

    if (opciones.cuerpo !== undefined) {
      configuracion.headers['Content-Type'] = 'application/json; charset=utf-8';
      configuracion.body = JSON.stringify(opciones.cuerpo);
    }

    let respuesta;
    try {
      respuesta = await fetch(`${API}/${ruta}`, configuracion);
    } catch (error) {
      console.error('Fallo de red al pedir', ruta, error);
      return { codigo: 0, cuerpo: { ok: false, mensaje: 'No pudimos conectar con el servidor. Verificá que Apache y MySQL estén corriendo en XAMPP.' } };
    }

    let cuerpo;
    try {
      cuerpo = await respuesta.json();
    } catch (error) {
      console.error('La respuesta no era JSON válido', ruta, error);
      cuerpo = { ok: false, mensaje: 'El servidor devolvió una respuesta inesperada.' };
    }

    // 401 significa que la sesión se cayó o nunca existió: se sincroniza el
    // estado local para que la interfaz vuelva a mostrar la vista de visitante.
    if (respuesta.status === 401 && estado.usuario !== null) {
      estado.usuario = null;
      estado.favoritos = [];
      aplicarVista();
    }

    return { codigo: respuesta.status, cuerpo };
  }

  /* ===================================================================
     4. MENSAJES Y ANUNCIOS
     =================================================================== */

  /** Pinta una alerta de formulario (cargando / éxito / error). */
  function mostrarAlerta(id, tipo, mensaje) {
    const alerta = document.getElementById(id);
    if (!alerta) return;
    alerta.className = `form-alerta form-alerta--${tipo}`;
    alerta.textContent = mensaje;
    alerta.hidden = false;
  }

  function ocultarAlerta(id) {
    const alerta = document.getElementById(id);
    if (alerta) alerta.hidden = true;
  }

  /** Texto de un contenedor con aria-live: el lector de pantalla lo lee solo. */
  function estadoTexto(id, mensaje, esError = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = mensaje;
    el.classList.toggle('is-error', esError);
    el.hidden = false;
  }

  /** Marca un campo con error y lo asocia a su mensaje para el lector. */
  function marcarError(input, mensaje) {
    if (!input) return;
    const error = document.getElementById(`${input.id}-error`);
    input.setAttribute('aria-invalid', 'true');
    if (error) {
      error.textContent = mensaje;
      input.setAttribute('aria-describedby', error.id);
    }
  }

  function limpiarErrores(formulario) {
    $$('input, select, textarea', formulario).forEach((campo) => {
      campo.removeAttribute('aria-invalid');
      const error = document.getElementById(`${campo.id}-error`);
      if (error) error.textContent = '';
    });
    $$('.campo-error', formulario).forEach((p) => { p.textContent = ''; });
  }

  /** Vuelca en el formulario los errores por campo que devolvió la API. */
  function volcarErroresDelServidor(formulario, campos, prefijo) {
    if (!campos) return;
    Object.entries(campos).forEach(([nombre, mensaje]) => {
      const input = document.getElementById(`${prefijo}-${nombre.replace(/_/g, '-')}`);
      if (input) {
        marcarError(input, mensaje);
      } else {
        const suelto = document.getElementById(`${prefijo}-${nombre.replace(/_/g, '-')}-error`);
        if (suelto) suelto.textContent = mensaje;
      }
    });
    const primero = $('[aria-invalid="true"]', formulario);
    if (primero) primero.focus();
  }

  /** Deshabilita el botón de envío mientras se espera al servidor. */
  function botonCargando(formulario, cargando, textoCargando) {
    const boton = $('button[type="submit"]', formulario);
    if (!boton) return;
    if (!boton.dataset.textoOriginal) boton.dataset.textoOriginal = boton.textContent;
    boton.disabled = cargando;
    boton.textContent = cargando ? textoCargando : boton.dataset.textoOriginal;
  }

  /** Aviso flotante breve, reutilizable desde cualquier vista. */
  function mostrarAviso(texto, href, textoEnlace) {
    let aviso = document.getElementById('rn-aviso');
    if (!aviso) {
      aviso = crear('div', 'aviso-flotante');
      aviso.id = 'rn-aviso';
      aviso.setAttribute('role', 'status');
      aviso.setAttribute('aria-live', 'polite');
      document.body.appendChild(aviso);
    }
    vaciar(aviso);
    aviso.appendChild(crear('p', null, texto));
    if (href) {
      const enlace = crear('a', 'btn btn-primary btn-sm', textoEnlace);
      enlace.href = href;
      aviso.appendChild(enlace);
    }
    aviso.classList.add('is-visible');
    clearTimeout(aviso.dataset.temporizador);
    aviso.dataset.temporizador = setTimeout(() => aviso.classList.remove('is-visible'), 4500);
  }

  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ===================================================================
     5. TEMA CLARO / OSCURO   (viene de la Opción 6 del Startup Relámpago)
     =================================================================== */

  function temaGuardado() {
    try { return localStorage.getItem(CLAVE_TEMA); } catch { return null; }
  }

  function prefiereOscuro() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function aplicarTemaInicial() {
    const guardado = temaGuardado();
    const oscuro = guardado ? guardado === 'oscuro' : prefiereOscuro();
    document.documentElement.classList.toggle('tema-oscuro', oscuro);
  }

  function actualizarBotonTema() {
    const oscuro = document.documentElement.classList.contains('tema-oscuro');
    $$('[data-accion="alternar-tema"]').forEach((boton) => {
      boton.setAttribute('aria-pressed', String(oscuro));
      boton.setAttribute('aria-label', oscuro ? 'Activar modo claro' : 'Activar modo oscuro');
      boton.title = oscuro ? 'Modo claro' : 'Modo oscuro';
      const icono = $('.btn-tema-icono', boton);
      if (icono) icono.textContent = oscuro ? '☀' : '☾';
    });
  }

  function alternarTema() {
    const oscuro = document.documentElement.classList.toggle('tema-oscuro');
    try { localStorage.setItem(CLAVE_TEMA, oscuro ? 'oscuro' : 'claro'); } catch { /* sin persistencia */ }
    actualizarBotonTema();
  }

  // Se aplica antes de que el navegador pinte, para que no se vea el cambio.
  aplicarTemaInicial();

  /* ===================================================================
     6. SESIÓN Y VISIBILIDAD POR AUDIENCIA (VSDM)
     =================================================================== */

  /**
   * Le pregunta al servidor quién está autenticado.
   *
   * Diferencia clave con la AE2: antes la sesión se leía del sessionStorage
   * del navegador, así que el propio usuario podía inventarla. Ahora la
   * única fuente es api/sesion.php, que responde según $_SESSION.
   */
  async function sincronizarSesion() {
    const { cuerpo } = await pedir('sesion.php');
    if (cuerpo && cuerpo.autenticado) {
      estado.usuario = cuerpo.usuario;
      estado.favoritos = Array.isArray(cuerpo.favoritos) ? cuerpo.favoritos : [];
    } else {
      estado.usuario = null;
      estado.favoritos = [];
    }
    aplicarVista();
  }

  /** Audiencia actual del modelo VSDM: visitante, usuario o agente. */
  function audiencia() {
    if (estado.usuario === null) return 'visitante';
    return estado.usuario.rol === 'agente' ? 'agente' : 'usuario';
  }

  /**
   * Muestra u oculta cada elemento según la audiencia declarada en su
   * atributo data-vista. Un elemento puede servir a varias audiencias:
   * data-vista="usuario agente".
   */
  function aplicarVista() {
    const actual = audiencia();
    document.documentElement.dataset.audiencia = actual;

    $$('[data-vista]').forEach((el) => {
      const audiencias = el.dataset.vista.split(/\s+/);
      el.hidden = !audiencias.includes(actual);
    });

    if (estado.usuario) {
      $$('[data-usuario-nombre]').forEach((el) => {
        el.textContent = estado.usuario.nombre.split(' ')[0];
      });
      $$('[data-usuario-email]').forEach((el) => {
        el.textContent = estado.usuario.email;
      });
    }

    pintarFavoritos();
  }

  async function cerrarSesion() {
    await pedir('logout.php', { metodo: 'POST' });
    estado.usuario = null;
    estado.favoritos = [];
    aplicarVista();
    mostrarAviso('Cerraste sesión. ¡Te esperamos pronto!');
    irA('#/inicio');
  }

  /* ===================================================================
     7. TARJETAS DE PROPIEDAD  (compartidas por inicio, catálogo y favoritos)
     =================================================================== */

  /** Botón de favorito con su estado accesible (aria-pressed). */
  function crearBotonFavorito(propiedadId) {
    const marcado = estado.favoritos.includes(Number(propiedadId));
    const boton = crear('button', 'btn-favorito', '♥');
    boton.type = 'button';
    boton.dataset.favorito = String(propiedadId);
    boton.classList.toggle('is-activo', marcado);
    boton.setAttribute('aria-pressed', String(marcado));
    boton.setAttribute('aria-label', marcado ? 'Quitar de favoritos' : 'Agregar a favoritos');
    return boton;
  }

  function pintarFavoritos() {
    $$('.btn-favorito').forEach((boton) => {
      const marcado = estado.favoritos.includes(Number(boton.dataset.favorito));
      boton.classList.toggle('is-activo', marcado);
      boton.setAttribute('aria-pressed', String(marcado));
      boton.setAttribute('aria-label', marcado ? 'Quitar de favoritos' : 'Agregar a favoritos');
    });
  }

  /**
   * Arma la tarjeta de una propiedad.
   * Cada dato entra con textContent, así que nada de lo que venga de la
   * base de datos puede ejecutarse como HTML (OWASP A03, XSS).
   */
  function crearTarjeta(propiedad, opciones = {}) {
    const card = crear('article', 'card-propiedad');
    card.dataset.tipo = propiedad.tipo;
    card.dataset.id = String(propiedad.id);
    card.classList.toggle('es-destacada', Boolean(propiedad.destacada));

    const fotos = Array.isArray(propiedad.fotos) ? propiedad.fotos : [];

    if (fotos.length > 0) {
      const galeria = crear('div', 'card-galeria');
      const carrusel = crear('div', 'card-galeria-scroll');

      fotos.forEach((foto) => {
        const img = crear('img');
        img.src = foto.ruta;
        img.alt = foto.texto_alt;   // obligatorio: WCAG 2.1, criterio 1.1.1
        img.loading = 'lazy';
        img.width = 400;
        img.height = 260;
        carrusel.appendChild(img);
      });

      const textoVerFotos = fotos.length > 1 ? `Ver ${fotos.length} fotos` : 'Ver foto';
      const verFotos = crear('button', 'btn-ver-fotos', textoVerFotos);
      verFotos.type = 'button';
      verFotos.dataset.verFotos = String(propiedad.id);
      // El nombre accesible ARRANCA con el texto visible del botón. Si no lo
      // contiene, axe lo marca como label-content-name-mismatch: quien usa
      // control por voz dice "Ver fotos" y el navegador no encuentra el botón.
      verFotos.setAttribute('aria-label', `${textoVerFotos} de ${propiedad.titulo}`);

      galeria.append(carrusel, verFotos);
      card.appendChild(galeria);
    }

    card.appendChild(crear('span', 'badge', etiquetaTipo(propiedad.tipo)));
    card.appendChild(crearBotonFavorito(propiedad.id));

    const contenido = crear('div', 'card-contenido');
    const meta = crear('div', 'card-meta');
    meta.appendChild(crear('span', null, `${propiedad.superficie} m²`));
    if (propiedad.ambientes) {
      meta.appendChild(crear('span', null, `${propiedad.ambientes} ambientes`));
    }

    const ficha = crear('a', 'btn btn-outline btn-sm card-ver-ficha', 'Ver ficha');
    ficha.href = `#/propiedad/${propiedad.id}`;
    ficha.setAttribute('aria-label', `Ver ficha de ${propiedad.titulo}`);

    contenido.append(
      crear('h3', null, propiedad.titulo),
      crear('p', 'card-ubicacion', propiedad.barrio),
      crear('p', 'card-precio', precioEnDolares(propiedad.precio)),
      meta,
      ficha
    );

    card.appendChild(contenido);

    if (propiedad.destacada && !opciones.sinCinta) {
      card.appendChild(crear('span', 'cinta-destacada', '★ Destacada'));
    }

    return card;
  }

  /** Alterna el favorito contra la API. Necesita sesión activa. */
  async function alternarFavorito(boton) {
    const propiedadId = Number(boton.dataset.favorito);

    if (estado.usuario === null) {
      mostrarAviso('Ingresá a tu cuenta para guardar propiedades favoritas.', '#/acceso', 'Ingresar');
      return;
    }

    const yaEstaba = estado.favoritos.includes(propiedadId);
    boton.disabled = true;

    const respuesta = yaEstaba
      ? await pedir(`favoritos.php?propiedad_id=${propiedadId}`, { metodo: 'DELETE' })
      : await pedir('favoritos.php', { metodo: 'POST', cuerpo: { propiedad_id: propiedadId } });

    boton.disabled = false;

    if (respuesta.cuerpo && respuesta.cuerpo.ok) {
      estado.favoritos = respuesta.cuerpo.ids.map(Number);
      pintarFavoritos();
      mostrarAviso(yaEstaba ? 'Quitamos la propiedad de tus favoritos.' : 'Guardamos la propiedad en tus favoritos.');
      if (rutaActual().vista === 'favoritos') cargarFavoritos();
    } else {
      mostrarAviso(respuesta.cuerpo.mensaje || 'No pudimos actualizar tus favoritos.');
    }
  }

  /* ===================================================================
     8. VISOR DE FOTOS
        <dialog> nativo: el navegador atrapa el foco adentro mientras está
        abierto y lo cierra con Escape, sin código extra.
     =================================================================== */

  const visor = { fotos: [], indice: 0, titulo: '' };

  function mostrarFotoDelVisor() {
    const foto = visor.fotos[visor.indice];
    if (!foto) return;

    const imagen = $('#visor-imagen');
    imagen.src = foto.ruta;
    imagen.alt = foto.texto_alt;

    $('#visor-leyenda').textContent = foto.texto_alt;
    $('#visor-contador').textContent = `${visor.indice + 1} / ${visor.fotos.length}`;
    $('[data-visor="anterior"]').disabled = visor.indice === 0;
    $('[data-visor="siguiente"]').disabled = visor.indice === visor.fotos.length - 1;
  }

  function abrirVisor(propiedadId) {
    const id = Number(propiedadId);
    const propiedad = estado.propiedades.find((p) => Number(p.id) === id)
      || (estado.fichaActual && Number(estado.fichaActual.id) === id ? estado.fichaActual : null);

    if (!propiedad || !Array.isArray(propiedad.fotos) || propiedad.fotos.length === 0) return;

    visor.fotos = propiedad.fotos;
    visor.indice = 0;
    visor.titulo = propiedad.titulo;

    $('#visor-titulo').textContent = propiedad.titulo;
    mostrarFotoDelVisor();
    $('#visor').showModal();
  }

  function moverVisor(paso) {
    const siguiente = visor.indice + paso;
    if (siguiente < 0 || siguiente >= visor.fotos.length) return;
    visor.indice = siguiente;
    mostrarFotoDelVisor();
  }

  function registrarVisor() {
    const dialogo = $('#visor');
    if (!dialogo) return;

    $('[data-visor="cerrar"]', dialogo).addEventListener('click', () => dialogo.close());
    $('[data-visor="anterior"]', dialogo).addEventListener('click', () => moverVisor(-1));
    $('[data-visor="siguiente"]', dialogo).addEventListener('click', () => moverVisor(1));

    dialogo.addEventListener('keydown', (evento) => {
      if (evento.key === 'ArrowLeft') moverVisor(-1);
      if (evento.key === 'ArrowRight') moverVisor(1);
    });

    // Un clic en el fondo oscuro, fuera del contenido, cierra el visor.
    dialogo.addEventListener('click', (evento) => {
      if (evento.target === dialogo) dialogo.close();
    });
  }

  /* ===================================================================
     9. VISTAS
     =================================================================== */

  /* ---------------- 9.1 Portada  (UC1, UC2) ---------------- */

  /**
   * Trae el catálogo y pinta las tarjetas de la portada.
   * El filtro de la portada trabaja sobre lo que ya está en pantalla
   * (classList.toggle), igual que en la Opción 6 del Startup Relámpago.
   */
  async function cargarInicio() {
    const grilla = $('#grilla-inicio');
    estadoTexto('estado-inicio', 'Cargando propiedades…');
    grilla.setAttribute('aria-busy', 'true');

    const { codigo, cuerpo } = await pedir('propiedades.php');

    grilla.removeAttribute('aria-busy');

    if (codigo !== 200 || !cuerpo.ok) {
      vaciar(grilla);
      estadoTexto('estado-inicio', cuerpo.mensaje || 'No pudimos cargar las propiedades.', true);
      return;
    }

    estado.propiedades = cuerpo.propiedades;
    grilla.replaceChildren(...estado.propiedades.map((p) => crearTarjeta(p)));
    filtrarPortada(grilla.dataset.filtro || 'todas');
  }

  function filtrarPortada(filtro) {
    $$('[data-filtro-inicio]').forEach((boton) => {
      const activo = boton.dataset.filtroInicio === filtro;
      boton.classList.toggle('is-activo', activo);
      boton.setAttribute('aria-pressed', String(activo));
    });

    const grilla = $('#grilla-inicio');
    grilla.dataset.filtro = filtro;

    const tarjetas = $$('.card-propiedad', grilla);
    tarjetas.forEach((card) => {
      card.classList.toggle('is-oculta', filtro !== 'todas' && card.dataset.tipo !== filtro);
    });

    const visibles = tarjetas.filter((c) => !c.classList.contains('is-oculta')).length;
    estadoTexto('estado-inicio', `Mostrando ${visibles} de ${tarjetas.length} propiedades.`);
  }

  function alternarResaltado(boton) {
    const activo = $('#grilla-inicio').classList.toggle('modo-resaltado');
    boton.classList.toggle('is-activo', activo);
    boton.setAttribute('aria-pressed', String(activo));
  }

  /* ---------------- 9.2 Catálogo  (UC1, UC2) ---------------- */

  /**
   * Acá el filtro sí viaja al servidor: la consulta SQL devuelve sólo las
   * propiedades del tipo pedido. Es la diferencia con el filtro de la
   * portada, que es puramente visual.
   */
  async function cargarCatalogo(tipo = 'todas') {
    const grilla = $('#grilla-catalogo');
    estadoTexto('estado-catalogo', 'Cargando propiedades…');
    grilla.setAttribute('aria-busy', 'true');

    $$('[data-filtro-catalogo]').forEach((boton) => {
      const activo = boton.dataset.filtroCatalogo === tipo;
      boton.classList.toggle('is-activo', activo);
      boton.setAttribute('aria-pressed', String(activo));
    });

    const consulta = tipo === 'todas' ? 'propiedades.php' : `propiedades.php?tipo=${encodeURIComponent(tipo)}`;
    const { codigo, cuerpo } = await pedir(consulta);

    grilla.removeAttribute('aria-busy');

    if (codigo !== 200 || !cuerpo.ok) {
      vaciar(grilla);
      estadoTexto('estado-catalogo', cuerpo.mensaje || 'No pudimos cargar el catálogo.', true);
      return;
    }

    estado.propiedades = cuerpo.propiedades;

    if (estado.propiedades.length === 0) {
      vaciar(grilla);
      estadoTexto('estado-catalogo', 'Todavía no hay propiedades de ese tipo publicadas.');
      return;
    }

    grilla.replaceChildren(...estado.propiedades.map((p) => crearTarjeta(p)));
    estadoTexto('estado-catalogo', `Mostrando ${estado.propiedades.length} propiedades.`);
  }

  /* ---------------- 9.3 Ficha de propiedad  (UC3) ---------------- */

  async function cargarFicha(id) {
    const contenedor = $('#detalle-propiedad');
    vaciar(contenedor);
    estadoTexto('estado-ficha', 'Cargando la ficha…');

    const { codigo, cuerpo } = await pedir(`propiedades.php?id=${encodeURIComponent(id)}`);

    if (codigo === 404) {
      estadoTexto('estado-ficha', 'No encontramos esa propiedad. Puede que el agente la haya dado de baja.', true);
      return;
    }
    if (codigo !== 200 || !cuerpo.ok) {
      estadoTexto('estado-ficha', cuerpo.mensaje || 'No pudimos cargar la ficha.', true);
      return;
    }

    const propiedad = cuerpo.propiedad;
    estado.fichaActual = propiedad;
    $('#titulo-ficha').textContent = propiedad.titulo;
    estadoTexto('estado-ficha', `Ficha de ${propiedad.titulo}.`);

    /* ----- Columna de fotos ----- */
    const galeria = crear('div', 'producto-galeria');
    const fotos = Array.isArray(propiedad.fotos) ? propiedad.fotos : [];

    if (fotos.length > 0) {
      const principal = crear('div', 'producto-galeria-principal');
      fotos.forEach((foto) => {
        const img = crear('img');
        img.src = foto.ruta;
        img.alt = foto.texto_alt;
        img.width = 800;
        img.height = 520;
        principal.appendChild(img);
      });
      galeria.appendChild(principal);

      const verFotos = crear('button', 'btn btn-outline btn-sm',
        fotos.length > 1 ? `Abrir el visor (${fotos.length} fotos)` : 'Abrir el visor');
      verFotos.type = 'button';
      verFotos.dataset.verFotos = String(propiedad.id);
      galeria.appendChild(verFotos);
    } else {
      galeria.appendChild(crear('p', 'producto-galeria-ayuda', 'Esta propiedad todavía no tiene fotos cargadas.'));
    }

    /* ----- Columna de datos ----- */
    const info = crear('div', 'producto-info');
    info.append(
      crear('span', 'badge', etiquetaTipo(propiedad.tipo)),
      crear('h2', null, propiedad.titulo),
      crear('p', 'producto-ubicacion', propiedad.barrio),
      crear('p', 'producto-precio', precioEnDolares(propiedad.precio))
    );

    const meta = crear('div', 'producto-meta');
    const bloqueSuperficie = crear('div');
    bloqueSuperficie.append(crear('span', null, 'Superficie'), crear('span', null, `${propiedad.superficie} m²`));
    meta.appendChild(bloqueSuperficie);

    if (propiedad.ambientes) {
      const bloqueAmbientes = crear('div');
      bloqueAmbientes.append(crear('span', null, 'Ambientes'), crear('span', null, String(propiedad.ambientes)));
      meta.appendChild(bloqueAmbientes);
    }

    const bloqueTipo = crear('div');
    bloqueTipo.append(crear('span', null, 'Tipo'), crear('span', null, etiquetaTipo(propiedad.tipo)));
    meta.appendChild(bloqueTipo);
    info.appendChild(meta);

    if (propiedad.descripcion) {
      info.appendChild(crear('p', 'producto-descripcion', propiedad.descripcion));
    }

    const acciones = crear('div', 'producto-acciones');

    const comprar = crear('a', 'btn btn-primary', 'Quiero comprar esta propiedad');
    comprar.href = `#/comprar/${propiedad.id}`;
    acciones.appendChild(comprar);

    acciones.appendChild(crearBotonFavorito(propiedad.id));

    // UC5 — Contactar por WhatsApp, con el mensaje armado según la propiedad
    const texto = encodeURIComponent(`Hola RN Inmobiliaria. Me interesa la propiedad "${propiedad.titulo}" (${precioEnDolares(propiedad.precio)}).`);
    const whatsapp = crear('a', 'btn btn-outline', 'Consultar por WhatsApp');
    whatsapp.href = `https://wa.me/5493764170186?text=${texto}`;
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener';
    acciones.appendChild(whatsapp);

    info.appendChild(acciones);

    contenedor.append(galeria, info);
    pintarFavoritos();
  }

  /* ---------------- 9.4 Acceso: ingreso y registro  (UC6, UC7) ---------------- */

  function activarPestana(nombre) {
    $$('.auth-tab').forEach((tab) => {
      const activa = tab.dataset.tab === nombre;
      tab.classList.toggle('is-activa', activa);
      tab.setAttribute('aria-selected', String(activa));
      // Sólo la pestaña activa queda en el recorrido del Tab; entre pestañas
      // se navega con las flechas (patrón de tablist de WAI-ARIA).
      tab.tabIndex = activa ? 0 : -1;
    });
    $('#panel-login').hidden = nombre !== 'login';
    $('#panel-registro').hidden = nombre !== 'registro';
    ocultarAlerta('auth-alerta');
  }

  async function enviarLogin(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const email = formulario.elements.email;
    const password = formulario.elements.password;

    limpiarErrores(formulario);
    ocultarAlerta('auth-alerta');

    let valido = true;
    if (!emailValido(email.value.trim())) {
      marcarError(email, 'Ingresá un e-mail válido.');
      valido = false;
    }
    if (password.value.length < LARGO_MINIMO_CLAVE) {
      marcarError(password, `La contraseña debe tener al menos ${LARGO_MINIMO_CLAVE} caracteres.`);
      valido = false;
    }
    if (!valido) {
      mostrarAlerta('auth-alerta', 'error', 'Revisá los campos marcados.');
      $('[aria-invalid="true"]', formulario).focus();
      return;
    }

    botonCargando(formulario, true, 'Verificando…');
    mostrarAlerta('auth-alerta', 'cargando', 'Verificando tus credenciales en el servidor…');

    const { codigo, cuerpo } = await pedir('login.php', {
      metodo: 'POST',
      cuerpo: { email: email.value.trim(), password: password.value },
    });

    botonCargando(formulario, false);

    if (codigo === 200 && cuerpo.ok) {
      formulario.reset();
      mostrarAlerta('auth-alerta', 'exito', `¡Bienvenido/a, ${cuerpo.usuario.nombre}! Sesión iniciada.`);
      await sincronizarSesion();
      return;
    }

    // 401: el servidor no dice si falló el e-mail o la contraseña, a propósito.
    mostrarAlerta('auth-alerta', 'error', cuerpo.mensaje || 'No pudimos iniciar la sesión.');
    password.value = '';
    password.focus();
  }

  async function enviarRegistro(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const { nombre, email, password, password2 } = formulario.elements;

    limpiarErrores(formulario);
    ocultarAlerta('auth-alerta');

    let valido = true;
    if (nombre.value.trim().length < 3) {
      marcarError(nombre, 'Ingresá tu nombre completo.');
      valido = false;
    }
    if (!emailValido(email.value.trim())) {
      marcarError(email, 'Ingresá un e-mail válido.');
      valido = false;
    }
    if (password.value.length < LARGO_MINIMO_CLAVE) {
      marcarError(password, `Mínimo ${LARGO_MINIMO_CLAVE} caracteres.`);
      valido = false;
    }
    if (password2.value !== password.value) {
      marcarError(password2, 'Las contraseñas no coinciden.');
      valido = false;
    }
    if (!valido) {
      mostrarAlerta('auth-alerta', 'error', 'Revisá los campos marcados.');
      $('[aria-invalid="true"]', formulario).focus();
      return;
    }

    botonCargando(formulario, true, 'Creando cuenta…');
    mostrarAlerta('auth-alerta', 'cargando', 'Enviando tus datos al servidor…');

    const { codigo, cuerpo } = await pedir('registro.php', {
      metodo: 'POST',
      cuerpo: {
        nombre: nombre.value.trim(),
        email: email.value.trim(),
        password: password.value,
        password2: password2.value,
      },
    });

    botonCargando(formulario, false);

    if (codigo === 201 && cuerpo.ok) {
      formulario.reset();
      mostrarAlerta('auth-alerta', 'exito', `¡Cuenta creada! Bienvenido/a, ${cuerpo.usuario.nombre}.`);
      await sincronizarSesion();
      return;
    }

    mostrarAlerta('auth-alerta', 'error', cuerpo.mensaje || 'No pudimos crear la cuenta.');
    volcarErroresDelServidor(formulario, cuerpo.campos, 'reg');
    if (codigo === 409) marcarError(email, cuerpo.mensaje);
  }

  /* ---------------- 9.5 Solicitud de compra  (UC4) ---------------- */

  /** Casillas de propiedades del formulario, traídas del catálogo. */
  async function cargarPropiedadesParaCompra(preseleccion) {
    const contenedor = $('#compra-propiedades');
    vaciar(contenedor);
    estadoTexto('estado-compra', 'Cargando el catálogo…');

    const { codigo, cuerpo } = await pedir('propiedades.php');

    if (codigo !== 200 || !cuerpo.ok) {
      estadoTexto('estado-compra', cuerpo.mensaje || 'No pudimos cargar el catálogo.', true);
      return;
    }

    estado.propiedades = cuerpo.propiedades;

    cuerpo.propiedades.forEach((propiedad) => {
      const etiqueta = crear('label', 'producto-opcion');

      const casilla = crear('input');
      casilla.type = 'checkbox';
      casilla.name = 'propiedades';
      casilla.value = String(propiedad.id);
      if (preseleccion && Number(preseleccion) === Number(propiedad.id)) casilla.checked = true;

      const foto = Array.isArray(propiedad.fotos) ? propiedad.fotos[0] : null;
      if (foto) {
        const img = crear('img');
        img.src = foto.ruta;
        img.alt = foto.texto_alt;
        img.loading = 'lazy';
        img.width = 120;
        img.height = 90;
        etiqueta.append(casilla, img);
      } else {
        etiqueta.appendChild(casilla);
      }

      const info = crear('div', 'producto-opcion-info');
      info.append(
        crear('p', null, propiedad.titulo),
        crear('p', null, precioEnDolares(propiedad.precio))
      );
      etiqueta.appendChild(info);

      contenedor.appendChild(etiqueta);
    });

    estadoTexto('estado-compra', `${cuerpo.propiedades.length} propiedades disponibles para elegir.`);
  }

  /** Precarga nombre y e-mail de la cuenta, como ya hacía la AE2. */
  function precargarFormularioCompra() {
    if (!estado.usuario) return;
    const nombre = $('#compra-nombre');
    const email = $('#compra-email');
    if (nombre && !nombre.value) nombre.value = estado.usuario.nombre;
    if (email && !email.value) email.value = estado.usuario.email;
  }

  async function enviarCompra(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;

    limpiarErrores(formulario);
    ocultarAlerta('compra-alerta');

    const elegidas = $$('#compra-propiedades input[type="checkbox"]:checked').map((c) => Number(c.value));

    if (elegidas.length === 0) {
      $('#compra-propiedades-error').textContent = 'Elegí al menos una propiedad.';
      mostrarAlerta('compra-alerta', 'error', 'Falta elegir las propiedades que te interesan.');
      return;
    }

    botonCargando(formulario, true, 'Enviando…');
    mostrarAlerta('compra-alerta', 'cargando', 'Enviando la solicitud al servidor…');

    const { codigo, cuerpo } = await pedir('solicitudes.php', {
      metodo: 'POST',
      cuerpo: {
        nombre: formulario.elements.nombre.value.trim(),
        telefono: formulario.elements.telefono.value.trim(),
        direccion: formulario.elements.direccion.value.trim(),
        email: formulario.elements.email.value.trim(),
        medio_pago: formulario.elements.medio_pago.value,
        mensaje: formulario.elements.mensaje.value.trim(),
        propiedades: elegidas,
      },
    });

    botonCargando(formulario, false);

    if (codigo === 201 && cuerpo.ok) {
      mostrarAlerta('compra-alerta', 'exito', `${cuerpo.mensaje} Número de solicitud: ${cuerpo.solicitud_id}.`);
      $$('#compra-propiedades input[type="checkbox"]').forEach((c) => { c.checked = false; });
      formulario.elements.mensaje.value = '';
      formulario.elements.medio_pago.selectedIndex = 0;
      return;
    }

    mostrarAlerta('compra-alerta', 'error', cuerpo.mensaje || 'No pudimos registrar la solicitud.');
    volcarErroresDelServidor(formulario, cuerpo.campos, 'compra');
  }

  /* ---------------- 9.6 Favoritos  (UC8) ---------------- */

  async function cargarFavoritos() {
    if (estado.usuario === null) return;

    const grilla = $('#grilla-favoritos');
    estadoTexto('estado-favoritos', 'Cargando tus favoritos…');

    const { codigo, cuerpo } = await pedir('favoritos.php');

    if (codigo !== 200 || !cuerpo.ok) {
      vaciar(grilla);
      estadoTexto('estado-favoritos', cuerpo.mensaje || 'No pudimos cargar tus favoritos.', true);
      return;
    }

    estado.favoritos = cuerpo.ids.map(Number);

    if (cuerpo.favoritos.length === 0) {
      vaciar(grilla);
      estadoTexto('estado-favoritos', 'Todavía no marcaste ninguna propiedad. Buscá el corazón en las tarjetas del catálogo.');
      return;
    }

    grilla.replaceChildren(...cuerpo.favoritos.map((p) => crearTarjeta(p, { sinCinta: true })));
    estadoTexto('estado-favoritos', `Tenés ${cuerpo.favoritos.length} propiedades guardadas.`);
  }

  /* ---------------- 9.7 Panel del agente  (UC9) ---------------- */

  let contadorFotos = 0;

  /** Agrega una fila de foto al formulario, con labels propios y únicos. */
  function agregarFilaFoto(ruta = '', alt = '') {
    contadorFotos += 1;
    const numero = contadorFotos;
    const fila = crear('div', 'fila-foto');

    const idRuta = `prop-foto-ruta-${numero}`;
    const idAlt = `prop-foto-alt-${numero}`;

    const etiquetaRuta = crear('label', null, `Ruta de la foto ${numero}`);
    etiquetaRuta.setAttribute('for', idRuta);
    const campoRuta = crear('input');
    campoRuta.type = 'text';
    campoRuta.id = idRuta;
    campoRuta.className = 'foto-ruta';
    campoRuta.placeholder = 'img/casa-centro-fachada.png';
    campoRuta.value = ruta;

    const etiquetaAlt = crear('label', null, `Texto alternativo de la foto ${numero}`);
    etiquetaAlt.setAttribute('for', idAlt);
    const campoAlt = crear('input');
    campoAlt.type = 'text';
    campoAlt.id = idAlt;
    campoAlt.className = 'foto-alt';
    campoAlt.placeholder = 'Fachada de la casa de dos plantas';
    campoAlt.value = alt;

    const quitar = crear('button', 'btn-link', 'Quitar esta foto');
    quitar.type = 'button';
    quitar.dataset.accion = 'quitar-foto';

    fila.append(etiquetaRuta, campoRuta, etiquetaAlt, campoAlt, quitar);
    $('#prop-fotos').appendChild(fila);
  }

  function reiniciarFormularioPropiedad() {
    const formulario = $('#form-propiedad');
    formulario.reset();
    limpiarErrores(formulario);
    $('#prop-id').value = '';
    $('#prop-activa').checked = true;
    vaciar($('#prop-fotos'));
    agregarFilaFoto();
    estado.editando = null;
    $('#titulo-form-propiedad').textContent = 'Nueva propiedad';
    $('#prop-enviar').textContent = 'Crear propiedad';
    $('#prop-cancelar').hidden = true;
    ocultarAlerta('panel-alerta');
  }

  function cargarPropiedadEnFormulario(propiedad) {
    const formulario = $('#form-propiedad');
    limpiarErrores(formulario);

    $('#prop-id').value = String(propiedad.id);
    $('#prop-titulo').value = propiedad.titulo;
    $('#prop-tipo').value = propiedad.tipo;
    $('#prop-barrio').value = propiedad.barrio;
    $('#prop-precio').value = String(propiedad.precio);
    $('#prop-superficie').value = String(propiedad.superficie);
    $('#prop-ambientes').value = propiedad.ambientes === null ? '' : String(propiedad.ambientes);
    $('#prop-descripcion').value = propiedad.descripcion || '';
    $('#prop-destacada').checked = Boolean(propiedad.destacada);
    $('#prop-activa').checked = Boolean(propiedad.activa);

    vaciar($('#prop-fotos'));
    const fotos = Array.isArray(propiedad.fotos) ? propiedad.fotos : [];
    if (fotos.length === 0) {
      agregarFilaFoto();
    } else {
      fotos.forEach((foto) => agregarFilaFoto(foto.ruta, foto.texto_alt));
    }

    estado.editando = propiedad.id;
    $('#titulo-form-propiedad').textContent = `Editar: ${propiedad.titulo}`;
    $('#prop-enviar').textContent = 'Guardar cambios';
    $('#prop-cancelar').hidden = false;
    $('#prop-titulo').focus();
  }

  /** Lee el formulario del panel y arma el objeto que espera la API. */
  function leerFormularioPropiedad() {
    const fotos = $$('#prop-fotos .fila-foto')
      .map((fila) => ({
        ruta: $('.foto-ruta', fila).value.trim(),
        texto_alt: $('.foto-alt', fila).value.trim(),
      }))
      .filter((foto) => foto.ruta !== '' || foto.texto_alt !== '');

    const ambientes = $('#prop-ambientes').value.trim();

    return {
      titulo: $('#prop-titulo').value.trim(),
      tipo: $('#prop-tipo').value,
      barrio: $('#prop-barrio').value.trim(),
      precio: $('#prop-precio').value,
      superficie: $('#prop-superficie').value,
      ambientes: ambientes === '' ? null : ambientes,
      descripcion: $('#prop-descripcion').value.trim(),
      destacada: $('#prop-destacada').checked,
      activa: $('#prop-activa').checked,
      fotos,
    };
  }

  async function enviarPropiedad(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    limpiarErrores(formulario);

    const datos = leerFormularioPropiedad();
    const id = $('#prop-id').value;
    const esEdicion = id !== '';

    botonCargando(formulario, true, esEdicion ? 'Guardando…' : 'Creando…');
    mostrarAlerta('panel-alerta', 'cargando', esEdicion ? 'Guardando los cambios…' : 'Creando la propiedad…');

    const { codigo, cuerpo } = esEdicion
      ? await pedir(`propiedades.php?id=${encodeURIComponent(id)}`, { metodo: 'PUT', cuerpo: datos })
      : await pedir('propiedades.php', { metodo: 'POST', cuerpo: datos });

    botonCargando(formulario, false);

    if ((codigo === 200 || codigo === 201) && cuerpo.ok) {
      mostrarAlerta('panel-alerta', 'exito', esEdicion ? 'Guardamos los cambios.' : 'Creamos la propiedad.');
      reiniciarFormularioPropiedad();
      cargarPanel();
      return;
    }

    mostrarAlerta('panel-alerta', 'error', cuerpo.mensaje || 'No pudimos guardar la propiedad.');
    volcarErroresDelServidor(formulario, cuerpo.campos, 'prop');
  }

  async function eliminarPropiedad(id, titulo) {
    // confirm() es nativo y accesible; evita un borrado por un clic de más.
    if (!window.confirm(`¿Eliminar "${titulo}"? Se borran también sus fotos, sus favoritos y sus renglones de solicitudes.`)) {
      return;
    }

    const { codigo, cuerpo } = await pedir(`propiedades.php?id=${encodeURIComponent(id)}`, { metodo: 'DELETE' });

    if (codigo === 200 && cuerpo.ok) {
      mostrarAlerta('panel-alerta', 'exito', 'Propiedad eliminada.');
      if (estado.editando === Number(id)) reiniciarFormularioPropiedad();
      cargarPanel();
      return;
    }

    mostrarAlerta('panel-alerta', 'error', cuerpo.mensaje || 'No pudimos eliminar la propiedad.');
  }

  /** Tabla administrable de propiedades. */
  function pintarTablaPanel(propiedades) {
    const cuerpoTabla = $('#cuerpo-tabla-panel');
    vaciar(cuerpoTabla);

    propiedades.forEach((propiedad) => {
      const fila = crear('tr');

      const celdaTitulo = crear('th', 'tabla-titulo', propiedad.titulo);
      celdaTitulo.scope = 'row';
      fila.appendChild(celdaTitulo);

      fila.appendChild(crear('td', null, etiquetaTipo(propiedad.tipo)));
      fila.appendChild(crear('td', null, propiedad.barrio));
      fila.appendChild(crear('td', 'precio-tabla', precioEnDolares(propiedad.precio)));

      const celdaEstado = crear('td');
      celdaEstado.appendChild(crear('span', propiedad.activa ? 'badge-tabla' : 'badge-tabla badge-tabla--baja',
        propiedad.activa ? 'Publicada' : 'Dada de baja'));
      fila.appendChild(celdaEstado);

      const celdaAcciones = crear('td', 'celda-acciones');

      const editar = crear('button', 'btn btn-outline btn-sm', 'Editar');
      editar.type = 'button';
      editar.dataset.editar = String(propiedad.id);
      editar.setAttribute('aria-label', `Editar ${propiedad.titulo}`);

      const eliminar = crear('button', 'btn btn-peligro btn-sm', 'Eliminar');
      eliminar.type = 'button';
      eliminar.dataset.eliminar = String(propiedad.id);
      eliminar.dataset.titulo = propiedad.titulo;
      eliminar.setAttribute('aria-label', `Eliminar ${propiedad.titulo}`);

      celdaAcciones.append(editar, eliminar);
      fila.appendChild(celdaAcciones);

      cuerpoTabla.appendChild(fila);
    });
  }

  /** Tabla de solicitudes recibidas, con el selector de estado. */
  function pintarTablaSolicitudes(solicitudes) {
    const cuerpoTabla = $('#cuerpo-tabla-solicitudes');
    vaciar(cuerpoTabla);

    solicitudes.forEach((solicitud) => {
      const fila = crear('tr');

      fila.appendChild(crear('td', null, fechaLegible(solicitud.creado_en)));

      const celdaCliente = crear('th', 'tabla-titulo', solicitud.nombre);
      celdaCliente.scope = 'row';
      fila.appendChild(celdaCliente);

      const contacto = crear('td');
      contacto.append(crear('span', null, solicitud.telefono), crear('span', null, solicitud.email));
      contacto.classList.add('celda-contacto');
      fila.appendChild(contacto);

      const celdaPropiedades = crear('td');
      const lista = crear('ul', 'lista-compacta');
      solicitud.propiedades.forEach((p) => lista.appendChild(crear('li', null, p.titulo)));
      celdaPropiedades.appendChild(lista);
      fila.appendChild(celdaPropiedades);

      fila.appendChild(crear('td', null, ETIQUETAS_PAGO[solicitud.medio_pago] || solicitud.medio_pago));

      const celdaEstado = crear('td');
      const idSelect = `solicitud-estado-${solicitud.id}`;
      const etiqueta = crear('label', 'solo-lectores', `Estado de la solicitud de ${solicitud.nombre}`);
      etiqueta.setAttribute('for', idSelect);

      const select = crear('select', 'select-estado');
      select.id = idSelect;
      select.dataset.solicitud = String(solicitud.id);
      [['pendiente', 'Pendiente'], ['contactada', 'Contactada'], ['cerrada', 'Cerrada']]
        .forEach(([valor, texto]) => {
          const opcion = crear('option', null, texto);
          opcion.value = valor;
          if (solicitud.estado === valor) opcion.selected = true;
          select.appendChild(opcion);
        });

      celdaEstado.append(etiqueta, select);
      fila.appendChild(celdaEstado);

      cuerpoTabla.appendChild(fila);
    });
  }

  async function cambiarEstadoSolicitud(select) {
    const id = select.dataset.solicitud;
    const { codigo, cuerpo } = await pedir(`solicitudes.php?id=${encodeURIComponent(id)}`, {
      metodo: 'PATCH',
      cuerpo: { estado: select.value },
    });

    if (codigo === 200 && cuerpo.ok) {
      mostrarAviso(`Solicitud ${id} marcada como ${select.value}.`);
      return;
    }
    mostrarAlerta('panel-alerta', 'error', cuerpo.mensaje || 'No pudimos cambiar el estado.');
  }

  /** Carga las dos tablas del panel. Sólo tiene sentido para el agente. */
  async function cargarPanel() {
    if (audiencia() !== 'agente') return;

    estadoTexto('estado-panel', 'Cargando el listado…');
    estadoTexto('estado-solicitudes', 'Cargando las solicitudes…');

    // Las dos peticiones salen juntas: no dependen una de la otra.
    const [propiedades, solicitudes] = await Promise.all([
      pedir('propiedades.php?todas=1'),
      pedir('solicitudes.php?todas=1'),
    ]);

    if (propiedades.codigo === 200 && propiedades.cuerpo.ok) {
      pintarTablaPanel(propiedades.cuerpo.propiedades);
      estadoTexto('estado-panel', `${propiedades.cuerpo.propiedades.length} propiedades cargadas en el catálogo.`);
    } else {
      estadoTexto('estado-panel', propiedades.cuerpo.mensaje || 'No pudimos cargar el listado.', true);
    }

    if (solicitudes.codigo === 200 && solicitudes.cuerpo.ok) {
      pintarTablaSolicitudes(solicitudes.cuerpo.solicitudes);
      const cantidad = solicitudes.cuerpo.solicitudes.length;
      estadoTexto('estado-solicitudes', cantidad === 0
        ? 'Todavía no hay solicitudes de compra.'
        : `${cantidad} solicitudes recibidas.`);
    } else {
      estadoTexto('estado-solicitudes', solicitudes.cuerpo.mensaje || 'No pudimos cargar las solicitudes.', true);
    }
  }

  /* ===================================================================
     10. ROUTER Y ARRANQUE
     =================================================================== */

  const VISTAS = {
    inicio:      { seccion: 'vista-inicio',      titulo: 'titulo-inicio',      nombre: 'Inicio' },
    propiedades: { seccion: 'vista-propiedades', titulo: 'titulo-propiedades', nombre: 'Propiedades en venta' },
    propiedad:   { seccion: 'vista-propiedad',   titulo: 'titulo-ficha',       nombre: 'Ficha de la propiedad' },
    acceso:      { seccion: 'vista-acceso',      titulo: 'titulo-acceso',      nombre: 'Tu cuenta' },
    comprar:     { seccion: 'vista-comprar',     titulo: 'titulo-comprar',     nombre: 'Solicitud de compra' },
    favoritos:   { seccion: 'vista-favoritos',   titulo: 'titulo-favoritos',   nombre: 'Mis favoritos' },
    panel:       { seccion: 'vista-panel',       titulo: 'titulo-panel',       nombre: 'Panel del agente' },
    404:         { seccion: 'vista-404',         titulo: 'titulo-404',         nombre: 'Página no encontrada' },
  };

  /** Lee el hash y lo parte en vista y parámetro: #/propiedad/3 → { propiedad, 3 } */
  function rutaActual() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const partes = hash.split('/').filter((p) => p !== '');
    const vista = partes[0] || 'inicio';
    return {
      vista: Object.prototype.hasOwnProperty.call(VISTAS, vista) ? vista : '404',
      parametro: partes[1] || null,
    };
  }

  /* En la primera carga el foco NO se mueve: así el primer Tab del usuario
     cae en el enlace "Saltar al contenido", como en cualquier página normal.
     Recién en los cambios de vista posteriores el foco va al título, porque
     ahí sí hace falta avisar que la pantalla cambió. */
  let primeraRuta = true;

  function irA(hash) {
    if (window.location.hash === hash) {
      atenderRuta();
    } else {
      window.location.hash = hash;
    }
  }

  /** Marca el ítem del menú que corresponde a la vista activa. */
  function marcarMenu(vista) {
    $$('.main-nav a[data-ruta]').forEach((enlace) => {
      const activo = enlace.dataset.ruta === vista;
      enlace.classList.toggle('active', activo);
      if (activo) {
        enlace.setAttribute('aria-current', 'page');
      } else {
        enlace.removeAttribute('aria-current');
      }
    });
  }

  /**
   * Muestra la vista que pide el hash y carga sus datos.
   *
   * Accesibilidad: después de cambiar de vista el foco pasa al título y el
   * nombre de la sección se escribe en la región aria-live, porque en una
   * SPA el navegador no avisa que cambió la página.
   */
  async function atenderRuta() {
    const { vista, parametro } = rutaActual();

    Object.values(VISTAS).forEach(({ seccion }) => {
      const el = document.getElementById(seccion);
      if (el) el.hidden = true;
    });

    const destino = VISTAS[vista];
    const seccion = document.getElementById(destino.seccion);
    if (seccion) seccion.hidden = false;

    marcarMenu(vista);

    // Cierra el menú hamburguesa si quedó abierto al navegar en celular.
    const menu = $('#menu-toggle');
    if (menu) menu.checked = false;

    window.scrollTo({ top: 0, behavior: 'auto' });

    const titulo = document.getElementById(destino.titulo);
    if (titulo && !primeraRuta) titulo.focus();

    if (!primeraRuta) {
      $('#anuncio-ruta').textContent = `Sección: ${destino.nombre}`;
    }
    primeraRuta = false;
    document.title = vista === 'inicio'
      ? 'RN Inmobiliaria — Propiedades en venta en Posadas, Misiones'
      : `${destino.nombre} — RN Inmobiliaria`;

    switch (vista) {
      case 'inicio':
        await cargarInicio();
        break;
      case 'propiedades':
        await cargarCatalogo(parametro || 'todas');
        break;
      case 'propiedad':
        if (parametro === null) {
          irA('#/propiedades');
          return;
        }
        await cargarFicha(parametro);
        break;
      case 'acceso':
        activarPestana('login');
        break;
      case 'comprar':
        if (estado.usuario !== null) {
          precargarFormularioCompra();
          await cargarPropiedadesParaCompra(parametro);
        }
        break;
      case 'favoritos':
        await cargarFavoritos();
        break;
      case 'panel':
        await cargarPanel();
        break;
      default:
        break;
    }
  }

  /** Registro de todos los eventos. Única puerta de entrada a la interfaz. */
  function registrarEventos() {
    // --- Tema ---
    $$('[data-accion="alternar-tema"]').forEach((boton) => {
      boton.addEventListener('click', alternarTema);
    });
    actualizarBotonTema();

    // --- Cierre de sesión ---
    $$('[data-accion="cerrar-sesion"]').forEach((boton) => {
      boton.addEventListener('click', cerrarSesion);
    });

    // --- Portada ---
    $$('[data-filtro-inicio]').forEach((boton) => {
      boton.addEventListener('click', () => filtrarPortada(boton.dataset.filtroInicio));
    });
    const resaltar = $('[data-accion="resaltar-destacadas"]');
    if (resaltar) resaltar.addEventListener('click', () => alternarResaltado(resaltar));

    // --- Catálogo ---
    $$('[data-filtro-catalogo]').forEach((boton) => {
      boton.addEventListener('click', () => cargarCatalogo(boton.dataset.filtroCatalogo));
    });

    // --- Pestañas de acceso: clic y flechas del teclado (patrón WAI-ARIA) ---
    const pestanas = $$('.auth-tab');
    pestanas.forEach((tab, indice) => {
      tab.addEventListener('click', () => activarPestana(tab.dataset.tab));
      tab.addEventListener('keydown', (evento) => {
        if (evento.key !== 'ArrowRight' && evento.key !== 'ArrowLeft') return;
        evento.preventDefault();
        const paso = evento.key === 'ArrowRight' ? 1 : -1;
        const siguiente = pestanas[(indice + paso + pestanas.length) % pestanas.length];
        activarPestana(siguiente.dataset.tab);
        siguiente.focus();
      });
    });

    // --- Formularios ---
    const formLogin = $('#form-login');
    if (formLogin) formLogin.addEventListener('submit', enviarLogin);

    const formRegistro = $('#form-registro');
    if (formRegistro) formRegistro.addEventListener('submit', enviarRegistro);

    const formCompra = $('#form-compra');
    if (formCompra) formCompra.addEventListener('submit', enviarCompra);

    const formPropiedad = $('#form-propiedad');
    if (formPropiedad) formPropiedad.addEventListener('submit', enviarPropiedad);

    // --- Panel: fotos dinámicas y cancelar edición ---
    const agregarFoto = $('[data-accion="agregar-foto"]');
    if (agregarFoto) agregarFoto.addEventListener('click', () => agregarFilaFoto());

    const cancelar = $('[data-accion="cancelar-edicion"]');
    if (cancelar) cancelar.addEventListener('click', reiniciarFormularioPropiedad);

    /* Delegación de eventos sobre document: los botones de las tarjetas y de
       las tablas se crean DESPUÉS de cargar la página, así que no se les
       puede asignar un listener de entrada. Se escucha una sola vez acá y
       se identifica el origen del clic con closest(). */
    document.addEventListener('click', (evento) => {
      const favorito = evento.target.closest('.btn-favorito');
      if (favorito) { alternarFavorito(favorito); return; }

      const verFotos = evento.target.closest('[data-ver-fotos]');
      if (verFotos) { abrirVisor(verFotos.dataset.verFotos); return; }

      const editar = evento.target.closest('[data-editar]');
      if (editar) {
        const id = Number(editar.dataset.editar);
        const propiedad = estado.propiedades.find((p) => Number(p.id) === id);
        if (propiedad) {
          cargarPropiedadEnFormulario(propiedad);
        } else {
          pedir(`propiedades.php?id=${id}`).then(({ cuerpo }) => {
            if (cuerpo.ok) cargarPropiedadEnFormulario(cuerpo.propiedad);
          });
        }
        return;
      }

      const eliminar = evento.target.closest('[data-eliminar]');
      if (eliminar) { eliminarPropiedad(eliminar.dataset.eliminar, eliminar.dataset.titulo); return; }

      const quitarFoto = evento.target.closest('[data-accion="quitar-foto"]');
      if (quitarFoto) {
        const filas = $$('#prop-fotos .fila-foto');
        if (filas.length > 1) {
          quitarFoto.closest('.fila-foto').remove();
        } else {
          mostrarAviso('Dejá al menos una fila de foto; podés borrar su contenido.');
        }
      }
    });

    // El cambio de estado de una solicitud también se delega.
    document.addEventListener('change', (evento) => {
      const select = evento.target.closest('.select-estado');
      if (select) cambiarEstadoSolicitud(select);
    });

    // --- Router ---
    window.addEventListener('hashchange', atenderRuta);

    registrarVisor();
  }

  /**
   * Arranque. El orden importa: primero se pregunta por la sesión, porque
   * de eso depende qué audiencia ve la interfaz, y después se atiende la
   * ruta que pidió el usuario en la URL.
   */
  async function iniciar() {
    registrarEventos();
    reiniciarFormularioPropiedad();

    if (window.location.hash === '') {
      window.history.replaceState(null, '', '#/inicio');
    }

    await sincronizarSesion();
    await atenderRuta();
  }

  document.addEventListener('DOMContentLoaded', iniciar);
})();
