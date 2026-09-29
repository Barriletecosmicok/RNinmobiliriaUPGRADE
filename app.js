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
   ========================================================= */

const URL_USUARIOS = 'data/usuarios.json';
const CLAVE_SESION = 'rn-sesion';
const CLAVE_REGISTRADOS = 'rn-usuarios-registrados';
const CLAVE_FAVORITOS = 'rn-favoritos';
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

function manejarFavorito(evento) {
  const boton = evento.currentTarget;
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

  document.querySelectorAll('.btn-favorito').forEach((boton) => {
    boton.addEventListener('click', manejarFavorito);
  });

  aplicarVista();
});
