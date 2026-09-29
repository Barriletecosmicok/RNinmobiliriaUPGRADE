/* =========================================================
   RN Inmobiliaria — app.js
   Módulo de Registro y Autenticación de Usuarios

   Requisitos del reto:
   1. Desacoplamiento: todos los eventos se capturan con addEventListener
      (el HTML no tiene atributos onclick / onsubmit).
   2. Asincronía: las credenciales se verifican con fetch() + async/await
      contra el archivo local data/usuarios.json (servidor simulado).
   3. VSDM: la visibilidad de cada elemento depende de la audiencia
      (visitante vs. usuario autenticado) mediante el atributo data-vista.

   Galería Interactiva y Modo Oscuro/Claro:
   4. Las propiedades destacadas se cargan con fetch() desde
      data/propiedades.json y se filtran / resaltan con classList.toggle().
   5. El tema visual se alterna con classList.toggle('tema-oscuro').
   ========================================================= */

const URL_USUARIOS = 'data/usuarios.json';
const CLAVE_SESION = 'rn-sesion';
const CLAVE_REGISTRADOS = 'rn-usuarios-registrados';
const CLAVE_FAVORITOS = 'rn-favoritos';
const CLAVE_TEMA = 'rn-tema';
const URL_PROPIEDADES = 'data/propiedades.json';
const LONGITUD_MINIMA = 8;
const DEMORA_RED_MS = 700; // latencia simulada del "servidor"

/* ---------------------------------------------------------
   Almacenamiento seguro (puede fallar en modo privado)
   --------------------------------------------------------- */
function leerJSON(storage, clave, porDefecto) {
  try {
    const valor = storage.getItem(clave);
    return valor ? JSON.parse(valor) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardarJSON(storage, clave, valor) {
  try {
    storage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* sin almacenamiento: la app sigue funcionando sin persistencia */
  }
}

function borrar(storage, clave) {
  try {
    storage.removeItem(clave);
  } catch {
    /* nada que hacer */
  }
}

/* ---------------------------------------------------------
   Sesión
   --------------------------------------------------------- */
function obtenerSesion() {
  return leerJSON(sessionStorage, CLAVE_SESION, null);
}

function iniciarSesion(usuario) {
  guardarJSON(sessionStorage, CLAVE_SESION, usuario);
}

function cerrarSesion() {
  borrar(sessionStorage, CLAVE_SESION);
}

/* ---------------------------------------------------------
   "Servidor" simulado con fetch + async/await
   --------------------------------------------------------- */
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

async function obtenerUsuarios() {
  const respuesta = await fetch(URL_USUARIOS, { cache: 'no-store' });
  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  // Se suman los usuarios que se registraron desde este navegador
  const registrados = leerJSON(localStorage, CLAVE_REGISTRADOS, []);
  return [...datos.usuarios, ...registrados];
}

// Simula POST /api/login → { ok, usuario } | { ok: false, mensaje }
async function verificarCredenciales(email, password) {
  await esperar(DEMORA_RED_MS);
  const usuarios = await obtenerUsuarios();
  const usuario = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!usuario || usuario.password !== password) {
    return { ok: false, mensaje: 'El e-mail o la contraseña no son correctos.' };
  }
  // Nunca se devuelve la clave al cliente
  const { password: _omitida, ...publico } = usuario;
  return { ok: true, usuario: publico };
}

// Simula POST /api/registro → { ok, usuario } | { ok: false, mensaje }
async function registrarUsuario(nombre, email, password) {
  await esperar(DEMORA_RED_MS);
  const usuarios = await obtenerUsuarios();

  if (usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, mensaje: 'Ya existe una cuenta con ese e-mail. Probá ingresar.' };
  }

  const nuevo = { id: Date.now(), nombre, email, password, rol: 'cliente' };
  const registrados = leerJSON(localStorage, CLAVE_REGISTRADOS, []);
  registrados.push(nuevo);
  guardarJSON(localStorage, CLAVE_REGISTRADOS, registrados);

  const { password: _omitida, ...publico } = nuevo;
  return { ok: true, usuario: publico };
}

/* ---------------------------------------------------------
   VSDM: aplicar la vista según la audiencia
   --------------------------------------------------------- */
function aplicarVista() {
  const sesion = obtenerSesion();
  const audiencia = sesion ? 'usuario' : 'visitante';

  document.documentElement.dataset.audiencia = audiencia;

  document.querySelectorAll('[data-vista]').forEach((el) => {
    el.hidden = el.dataset.vista !== audiencia;
  });

  if (sesion) {
    document.querySelectorAll('[data-usuario-nombre]').forEach((el) => {
      el.textContent = sesion.nombre.split(' ')[0];
    });
    document.querySelectorAll('[data-usuario-email]').forEach((el) => {
      el.textContent = sesion.email;
    });
  }

  actualizarFavoritos();
  precargarFormularioCompra();
}

/* ---------------------------------------------------------
   Respuesta visual y validación de campos
   --------------------------------------------------------- */
function mostrarAlerta(tipo, mensaje) {
  const alerta = document.getElementById('auth-alerta');
  if (!alerta) return;
  alerta.className = `form-alerta form-alerta--${tipo}`;
  alerta.textContent = mensaje;
  alerta.hidden = false;
}

function ocultarAlerta() {
  const alerta = document.getElementById('auth-alerta');
  if (alerta) alerta.hidden = true;
}

function marcarError(input, mensaje) {
  const error = document.getElementById(`${input.id}-error`);
  input.setAttribute('aria-invalid', 'true');
  if (error) {
    error.textContent = mensaje;
    input.setAttribute('aria-describedby', error.id);
  }
}

function limpiarErrores(form) {
  form.querySelectorAll('input').forEach((input) => {
    input.removeAttribute('aria-invalid');
    const error = document.getElementById(`${input.id}-error`);
    if (error) error.textContent = '';
  });
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setCargando(form, cargando, textoCargando) {
  const boton = form.querySelector('button[type="submit"]');
  if (!boton.dataset.textoOriginal) boton.dataset.textoOriginal = boton.textContent;
  boton.disabled = cargando;
  boton.textContent = cargando ? textoCargando : boton.dataset.textoOriginal;
}

/* ---------------------------------------------------------
   Manejadores de formularios (interceptan el submit)
   --------------------------------------------------------- */
async function manejarLogin(evento) {
  evento.preventDefault();
  const form = evento.currentTarget;
  const email = form.elements.email;
  const password = form.elements.password;

  limpiarErrores(form);
  ocultarAlerta();

  let valido = true;
  if (!emailValido(email.value.trim())) {
    marcarError(email, 'Ingresá un e-mail válido.');
    valido = false;
  }
  if (password.value.length < LONGITUD_MINIMA) {
    marcarError(password, `La contraseña debe tener al menos ${LONGITUD_MINIMA} caracteres.`);
    valido = false;
  }
  if (!valido) {
    mostrarAlerta('error', 'Revisá los campos marcados.');
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  setCargando(form, true, 'Verificando…');
  mostrarAlerta('cargando', 'Verificando credenciales con el servidor…');

  try {
    const resultado = await verificarCredenciales(email.value.trim(), password.value);
    if (resultado.ok) {
      iniciarSesion(resultado.usuario);
      mostrarAlerta('exito', `¡Bienvenido/a, ${resultado.usuario.nombre}! Sesión iniciada.`);
      form.reset();
      await esperar(1200);
      aplicarVista();
    } else {
      mostrarAlerta('error', resultado.mensaje);
      password.value = '';
      password.focus();
    }
  } catch (error) {
    mostrarAlerta('error', 'No pudimos conectar con el servidor. Abrí el sitio con un servidor local (por ej. Live Server) e intentá de nuevo.');
    console.error('Error al verificar credenciales:', error);
  } finally {
    setCargando(form, false);
  }
}

async function manejarRegistro(evento) {
  evento.preventDefault();
  const form = evento.currentTarget;
  const { nombre, email, password, password2 } = form.elements;

  limpiarErrores(form);
  ocultarAlerta();

  let valido = true;
  if (nombre.value.trim().length < 3) {
    marcarError(nombre, 'Ingresá tu nombre completo.');
    valido = false;
  }
  if (!emailValido(email.value.trim())) {
    marcarError(email, 'Ingresá un e-mail válido.');
    valido = false;
  }
  if (password.value.length < LONGITUD_MINIMA) {
    marcarError(password, `Mínimo ${LONGITUD_MINIMA} caracteres.`);
    valido = false;
  }
  if (password2.value !== password.value) {
    marcarError(password2, 'Las contraseñas no coinciden.');
    valido = false;
  }
  if (!valido) {
    mostrarAlerta('error', 'Revisá los campos marcados.');
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  setCargando(form, true, 'Creando cuenta…');
  mostrarAlerta('cargando', 'Enviando datos al servidor…');

  try {
    const resultado = await registrarUsuario(nombre.value.trim(), email.value.trim(), password.value);
    if (resultado.ok) {
      iniciarSesion(resultado.usuario);
      mostrarAlerta('exito', `¡Cuenta creada! Bienvenido/a, ${resultado.usuario.nombre}.`);
      form.reset();
      await esperar(1200);
      aplicarVista();
    } else {
      mostrarAlerta('error', resultado.mensaje);
      marcarError(email, resultado.mensaje);
      email.focus();
    }
  } catch (error) {
    mostrarAlerta('error', 'No pudimos conectar con el servidor. Abrí el sitio con un servidor local (por ej. Live Server) e intentá de nuevo.');
    console.error('Error al registrar usuario:', error);
  } finally {
    setCargando(form, false);
  }
}

/* ---------------------------------------------------------
   Pestañas Ingresar / Crear cuenta
   --------------------------------------------------------- */
function activarPestana(nombre) {
  document.querySelectorAll('.auth-tab').forEach((tab) => {
    const activa = tab.dataset.tab === nombre;
    tab.classList.toggle('is-activa', activa);
    tab.setAttribute('aria-selected', String(activa));
  });
  document.getElementById('panel-login').hidden = nombre !== 'login';
  document.getElementById('panel-registro').hidden = nombre !== 'registro';
  ocultarAlerta();
}

/* ---------------------------------------------------------
   Favoritos (solo para usuarios autenticados)
   --------------------------------------------------------- */
function idPropiedad(boton) {
  const card = boton.closest('.card-propiedad');
  return card ? card.querySelector('h3').textContent.trim() : '';
}

function favoritosDe(email) {
  const todos = leerJSON(localStorage, CLAVE_FAVORITOS, {});
  return todos[email] || [];
}

function actualizarFavoritos() {
  const sesion = obtenerSesion();
  const favoritos = sesion ? favoritosDe(sesion.email) : [];
  document.querySelectorAll('.btn-favorito').forEach((boton) => {
    const marcado = favoritos.includes(idPropiedad(boton));
    boton.classList.toggle('is-activo', marcado);
    boton.setAttribute('aria-pressed', String(marcado));
    boton.setAttribute('aria-label', marcado ? 'Quitar de favoritos' : 'Agregar a favoritos');
  });
}

function manejarFavorito(boton) {
  const sesion = obtenerSesion();

  // VSDM: el visitante no puede guardar favoritos, se lo invita a ingresar
  if (!sesion) {
    mostrarAviso('Ingresá a tu cuenta para guardar propiedades favoritas.', 'acceso.html', 'Ingresar');
    return;
  }

  const todos = leerJSON(localStorage, CLAVE_FAVORITOS, {});
  const lista = new Set(todos[sesion.email] || []);
  const id = idPropiedad(boton);
  if (lista.has(id)) {
    lista.delete(id);
  } else {
    lista.add(id);
  }
  todos[sesion.email] = [...lista];
  guardarJSON(localStorage, CLAVE_FAVORITOS, todos);
  actualizarFavoritos();
}

/* Aviso flotante reutilizable */
function mostrarAviso(texto, href, textoEnlace) {
  let aviso = document.getElementById('rn-aviso');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.id = 'rn-aviso';
    aviso.className = 'aviso-flotante';
    aviso.setAttribute('role', 'status');
    document.body.appendChild(aviso);
  }
  aviso.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = texto;
  aviso.appendChild(p);
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.className = 'btn btn-primary btn-sm';
    a.textContent = textoEnlace;
    aviso.appendChild(a);
  }
  aviso.classList.add('is-visible');
  clearTimeout(aviso._timer);
  aviso._timer = setTimeout(() => aviso.classList.remove('is-visible'), 4000);
}

/* ---------------------------------------------------------
   Formulario de compra: datos precargados para el usuario
   --------------------------------------------------------- */
function precargarFormularioCompra() {
  const form = document.querySelector('.comprar-form');
  const sesion = obtenerSesion();
  if (!form || !sesion) return;
  if (form.elements.nombre && !form.elements.nombre.value) form.elements.nombre.value = sesion.nombre;
  if (form.elements.email && !form.elements.email.value) form.elements.email.value = sesion.email;
}

/* ---------------------------------------------------------
   Tema claro / oscuro
   --------------------------------------------------------- */
function temaGuardado() {
  try {
    return localStorage.getItem(CLAVE_TEMA);
  } catch {
    return null;
  }
}

function prefiereOscuro() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Se ejecuta apenas carga el script para evitar un "parpadeo" de tema
function aplicarTemaInicial() {
  const guardado = temaGuardado();
  const oscuro = guardado ? guardado === 'oscuro' : prefiereOscuro();
  document.documentElement.classList.toggle('tema-oscuro', oscuro);
}

function actualizarBotonTema() {
  const oscuro = document.documentElement.classList.contains('tema-oscuro');
  document.querySelectorAll('[data-accion="alternar-tema"]').forEach((boton) => {
    boton.setAttribute('aria-pressed', String(oscuro));
    boton.setAttribute('aria-label', oscuro ? 'Activar modo claro' : 'Activar modo oscuro');
    boton.title = oscuro ? 'Modo claro' : 'Modo oscuro';
    boton.querySelector('.btn-tema-icono').textContent = oscuro ? '☀' : '☾';
  });
}

function alternarTema() {
  // classList.toggle devuelve true si la clase quedó agregada
  const oscuro = document.documentElement.classList.toggle('tema-oscuro');
  try {
    localStorage.setItem(CLAVE_TEMA, oscuro ? 'oscuro' : 'claro');
  } catch {
    /* sin persistencia: el tema vale solo para esta página */
  }
  actualizarBotonTema();
}

aplicarTemaInicial();

/* ---------------------------------------------------------
   Galería interactiva: propiedades destacadas vía fetch()
   --------------------------------------------------------- */
let propiedades = [];
const formatoPrecio = new Intl.NumberFormat('es-AR');

function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function crearTarjeta(propiedad) {
  const card = crear('article', 'card-propiedad');
  card.dataset.tipo = propiedad.tipo;
  card.dataset.id = propiedad.id;
  card.classList.toggle('es-destacada', propiedad.destacada);

  // Galería deslizable de la tarjeta
  const galeria = crear('div', 'card-galeria');
  const scroll = crear('div', 'card-galeria-scroll');
  propiedad.fotos.forEach((foto) => {
    const img = crear('img');
    img.src = foto.src;
    img.alt = foto.alt;
    img.loading = 'lazy';
    scroll.appendChild(img);
  });
  const verFotos = crear('button', 'btn-ver-fotos',
    propiedad.fotos.length > 1 ? `Ver ${propiedad.fotos.length} fotos` : 'Ver foto');
  verFotos.type = 'button';
  verFotos.dataset.propiedad = propiedad.id;
  galeria.append(scroll, verFotos);

  const tipo = propiedad.tipo === 'casa' ? 'Casa' : 'Terreno';
  const badge = crear('span', 'badge', tipo);

  const favorito = crear('button', 'btn-favorito', '♥');
  favorito.type = 'button';
  favorito.setAttribute('aria-label', 'Agregar a favoritos');

  const contenido = crear('div', 'card-contenido');
  const meta = crear('div', 'card-meta');
  meta.appendChild(crear('span', '', `${propiedad.superficie} m²`));
  if (propiedad.ambientes) meta.appendChild(crear('span', '', `${propiedad.ambientes} ambientes`));
  const ficha = crear('a', 'btn btn-outline btn-sm card-ver-ficha', 'Ver ficha');
  ficha.href = propiedad.ficha;
  contenido.append(
    crear('h3', '', propiedad.titulo),
    crear('p', 'card-ubicacion', propiedad.barrio),
    crear('p', 'card-precio', `USD ${formatoPrecio.format(propiedad.precio)}`),
    meta,
    ficha
  );

  card.append(galeria, badge, favorito, contenido);
  if (propiedad.destacada) card.appendChild(crear('span', 'cinta-destacada', '★ Destacada'));
  return card;
}

function actualizarEstadoGaleria() {
  const estado = document.getElementById('galeria-estado');
  const tarjetas = document.querySelectorAll('#galeria-destacadas .card-propiedad');
  const visibles = [...tarjetas].filter((t) => !t.classList.contains('is-oculta')).length;
  estado.classList.remove('is-error');
  estado.textContent = `Mostrando ${visibles} de ${tarjetas.length} propiedades.`;
}

async function cargarGaleria() {
  const grilla = document.getElementById('galeria-destacadas');
  const estado = document.getElementById('galeria-estado');
  try {
    const respuesta = await fetch(URL_PROPIEDADES, { cache: 'no-store' });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const datos = await respuesta.json();
    propiedades = datos.propiedades;

    grilla.replaceChildren(...propiedades.map(crearTarjeta));
    actualizarEstadoGaleria();
    actualizarFavoritos();
  } catch (error) {
    estado.classList.add('is-error');
    estado.textContent = 'No pudimos cargar las propiedades. Abrí el sitio con un servidor local (por ej. Live Server).';
    console.error('Error al cargar la galería:', error);
  } finally {
    grilla.removeAttribute('aria-busy');
  }
}

function filtrarGaleria(filtro) {
  document.querySelectorAll('[data-filtro]').forEach((boton) => {
    const activo = boton.dataset.filtro === filtro;
    boton.classList.toggle('is-activo', activo);
    boton.setAttribute('aria-pressed', String(activo));
  });
  document.querySelectorAll('#galeria-destacadas .card-propiedad').forEach((card) => {
    card.classList.toggle('is-oculta', filtro !== 'todas' && card.dataset.tipo !== filtro);
  });
  actualizarEstadoGaleria();
}

function alternarResaltado(evento) {
  const boton = evento.currentTarget;
  const activo = document.getElementById('galeria-destacadas').classList.toggle('modo-resaltado');
  boton.classList.toggle('is-activo', activo);
  boton.setAttribute('aria-pressed', String(activo));
}

/* ---------------------------------------------------------
   Visor de fotos (contexto de navegación "fotos de una propiedad")
   --------------------------------------------------------- */
const visor = { propiedad: null, indice: 0 };

function mostrarFotoVisor() {
  const { propiedad, indice } = visor;
  const foto = propiedad.fotos[indice];
  const imagen = document.getElementById('visor-imagen');
  imagen.src = foto.src;
  imagen.alt = foto.alt;
  document.getElementById('visor-leyenda').textContent = foto.alt;
  document.getElementById('visor-contador').textContent = `${indice + 1} / ${propiedad.fotos.length}`;
  document.querySelector('[data-visor="anterior"]').disabled = indice === 0;
  document.querySelector('[data-visor="siguiente"]').disabled = indice === propiedad.fotos.length - 1;
}

function abrirVisor(id) {
  const propiedad = propiedades.find((p) => p.id === id);
  if (!propiedad) return;
  visor.propiedad = propiedad;
  visor.indice = 0;
  document.getElementById('visor-titulo').textContent = propiedad.titulo;
  mostrarFotoVisor();
  document.getElementById('visor').showModal();
}

function moverVisor(paso) {
  const nuevo = visor.indice + paso;
  if (nuevo < 0 || nuevo >= visor.propiedad.fotos.length) return;
  visor.indice = nuevo;
  mostrarFotoVisor();
}

function iniciarVisor() {
  const dialogo = document.getElementById('visor');
  dialogo.querySelector('[data-visor="cerrar"]').addEventListener('click', () => dialogo.close());
  dialogo.querySelector('[data-visor="anterior"]').addEventListener('click', () => moverVisor(-1));
  dialogo.querySelector('[data-visor="siguiente"]').addEventListener('click', () => moverVisor(1));
  dialogo.addEventListener('keydown', (evento) => {
    if (evento.key === 'ArrowLeft') moverVisor(-1);
    if (evento.key === 'ArrowRight') moverVisor(1);
  });
  // Click en el fondo oscuro (fuera del contenido) cierra el visor
  dialogo.addEventListener('click', (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });
}

/* ---------------------------------------------------------
   Inicialización: registro de eventos (desacoplado del HTML)
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');

  if (formLogin) formLogin.addEventListener('submit', manejarLogin);
  if (formRegistro) formRegistro.addEventListener('submit', manejarRegistro);

  document.querySelectorAll('.auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => activarPestana(tab.dataset.tab));
  });

  document.querySelectorAll('[data-accion="cerrar-sesion"]').forEach((boton) => {
    boton.addEventListener('click', () => {
      cerrarSesion();
      aplicarVista();
      mostrarAviso('Cerraste sesión. ¡Te esperamos pronto!');
    });
  });

  // Delegación: sirve también para las tarjetas que se crean después con fetch()
  document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-favorito');
    if (boton) manejarFavorito(boton);
  });

  // Conmutador de tema claro / oscuro
  document.querySelectorAll('[data-accion="alternar-tema"]').forEach((boton) => {
    boton.addEventListener('click', alternarTema);
  });
  actualizarBotonTema();

  // Galería interactiva (solo existe en index.html)
  const galeria = document.getElementById('galeria-destacadas');
  if (galeria) {
    document.querySelectorAll('[data-filtro]').forEach((boton) => {
      boton.addEventListener('click', () => filtrarGaleria(boton.dataset.filtro));
    });
    document.querySelector('[data-accion="resaltar-destacadas"]')
      .addEventListener('click', alternarResaltado);
    galeria.addEventListener('click', (evento) => {
      const boton = evento.target.closest('.btn-ver-fotos');
      if (boton) abrirVisor(boton.dataset.propiedad);
    });
    iniciarVisor();
    cargarGaleria();
  }

  aplicarVista();
});
