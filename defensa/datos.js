/* GENERADO por defensa/generar.py. No editar a mano. */
window.DATOS = {
 "snippets": {
  "h_tema": {
   "archivo": "public/index.html",
   "desde": 49,
   "hasta": 51,
   "lenguaje": "html",
   "autor": "Jesus De Olivera",
   "codigo": "      <button type=\"button\" class=\"btn-tema\" data-accion=\"alternar-tema\" aria-pressed=\"false\" aria-label=\"Activar modo oscuro\">\n        <span class=\"btn-tema-icono\" aria-hidden=\"true\">☾</span>\n      </button>"
  },
  "h_menu": {
   "archivo": "public/index.html",
   "desde": 60,
   "hasta": 65,
   "lenguaje": "html",
   "autor": "Jesus De Olivera",
   "codigo": "               api/sesion.php, no con lo que tenga guardado el navegador. -->\n          <li data-vista=\"usuario agente\" hidden><a href=\"#/favoritos\" data-ruta=\"favoritos\">Favoritos</a></li>\n          <li data-vista=\"agente\" hidden><a href=\"#/panel\" data-ruta=\"panel\">Panel</a></li>\n          <li data-vista=\"visitante\"><a href=\"#/acceso\" data-ruta=\"acceso\">Ingresar</a></li>\n          <li data-vista=\"usuario agente\" hidden class=\"nav-usuario\">\n            <span class=\"nav-saludo\">Hola, <strong data-usuario-nombre>usuario</strong></span>"
  },
  "h_filtros": {
   "archivo": "public/index.html",
   "desde": 204,
   "hasta": 211,
   "lenguaje": "html",
   "autor": "Jesus De Olivera",
   "codigo": "        <div class=\"galeria-controles\" role=\"toolbar\" aria-label=\"Filtrar el catálogo por tipo de propiedad\">\n          <div class=\"galeria-filtros\">\n            <button type=\"button\" class=\"filtro-chip is-activo\" data-filtro-catalogo=\"todas\" aria-pressed=\"true\">Todas</button>\n            <button type=\"button\" class=\"filtro-chip\" data-filtro-catalogo=\"casa\" aria-pressed=\"false\">Casas</button>\n            <button type=\"button\" class=\"filtro-chip\" data-filtro-catalogo=\"terreno\" aria-pressed=\"false\">Terrenos</button>\n            <button type=\"button\" class=\"filtro-chip\" data-filtro-catalogo=\"departamento\" aria-pressed=\"false\">Departamentos</button>\n            <button type=\"button\" class=\"filtro-chip\" data-filtro-catalogo=\"local\" aria-pressed=\"false\">Locales</button>\n          </div>"
  },
  "h_login": {
   "archivo": "public/index.html",
   "desde": 266,
   "hasta": 279,
   "lenguaje": "html",
   "autor": "Jesus De Olivera",
   "codigo": "              <form class=\"comprar-form auth-form\" id=\"form-login\" novalidate>\n                <label for=\"login-email\">E-mail</label>\n                <input type=\"email\" id=\"login-email\" name=\"email\" placeholder=\"nombre@correo.com\" autocomplete=\"username\" required>\n                <p class=\"campo-error\" id=\"login-email-error\"></p>\n\n                <label for=\"login-password\">Contraseña</label>\n                <input type=\"password\" id=\"login-password\" name=\"password\" autocomplete=\"current-password\" minlength=\"8\" required>\n                <p class=\"campo-error\" id=\"login-password-error\"></p>\n\n                <button type=\"submit\" class=\"btn btn-primary\">Ingresar</button>\n              </form>\n            </div>\n\n            <div class=\"auth-panel\" id=\"panel-registro\" role=\"tabpanel\" aria-labelledby=\"tab-registro\" hidden>"
  },
  "h_registro": {
   "archivo": "public/index.html",
   "desde": 280,
   "hasta": 295,
   "lenguaje": "html",
   "autor": "Jesus De Olivera",
   "codigo": "              <form class=\"comprar-form auth-form\" id=\"form-registro\" novalidate>\n                <label for=\"reg-nombre\">Nombre completo</label>\n                <input type=\"text\" id=\"reg-nombre\" name=\"nombre\" placeholder=\"Nombre y apellido\" autocomplete=\"name\" required>\n                <p class=\"campo-error\" id=\"reg-nombre-error\"></p>\n\n                <label for=\"reg-email\">E-mail</label>\n                <input type=\"email\" id=\"reg-email\" name=\"email\" placeholder=\"nombre@correo.com\" autocomplete=\"email\" required>\n                <p class=\"campo-error\" id=\"reg-email-error\"></p>\n\n                <div class=\"form-grid-2\">\n                  <div>\n                    <label for=\"reg-password\">Contraseña</label>\n                    <input type=\"password\" id=\"reg-password\" name=\"password\" autocomplete=\"new-password\" minlength=\"8\" required>\n                    <p class=\"campo-error\" id=\"reg-password-error\"></p>\n                  </div>\n                  <div>"
  },
  "h_compra": {
   "archivo": "public/index.html",
   "desde": 369,
   "hasta": 380,
   "lenguaje": "html",
   "autor": "Jesus De Olivera",
   "codigo": "            <form class=\"comprar-form\" id=\"form-compra\" novalidate>\n              <div class=\"form-grid-2\">\n                <div>\n                  <label for=\"compra-nombre\">Nombre completo</label>\n                  <input type=\"text\" id=\"compra-nombre\" name=\"nombre\" autocomplete=\"name\" required>\n                  <p class=\"campo-error\" id=\"compra-nombre-error\"></p>\n                </div>\n                <div>\n                  <label for=\"compra-telefono\">Teléfono</label>\n                  <input type=\"tel\" id=\"compra-telefono\" name=\"telefono\" placeholder=\"+54 9 376 ...\" autocomplete=\"tel\" required>\n                  <p class=\"campo-error\" id=\"compra-telefono-error\"></p>\n                </div>"
  },
  "h_propiedad": {
   "archivo": "public/index.html",
   "desde": 487,
   "hasta": 498,
   "lenguaje": "html",
   "autor": "Jesus De Olivera",
   "codigo": "            <form class=\"comprar-form\" id=\"form-propiedad\" novalidate>\n              <!-- Guarda el id cuando se está editando; vacío en un alta -->\n              <input type=\"hidden\" id=\"prop-id\" name=\"id\" value=\"\">\n\n              <div class=\"form-grid-2\">\n                <div>\n                  <label for=\"prop-titulo\">Título</label>\n                  <input type=\"text\" id=\"prop-titulo\" name=\"titulo\" required>\n                  <p class=\"campo-error\" id=\"prop-titulo-error\"></p>\n                </div>\n                <div>\n                  <label for=\"prop-tipo\">Tipo</label>"
  },
  "h_visor": {
   "archivo": "public/index.html",
   "desde": 622,
   "hasta": 635,
   "lenguaje": "html",
   "autor": "Jesus De Olivera",
   "codigo": "  <dialog class=\"visor\" id=\"visor\" aria-labelledby=\"visor-titulo\">\n    <div class=\"visor-contenido\">\n      <div class=\"visor-cabecera\">\n        <h2 class=\"visor-titulo\" id=\"visor-titulo\">Fotos</h2>\n        <button type=\"button\" class=\"visor-btn visor-cerrar\" data-visor=\"cerrar\" aria-label=\"Cerrar la galería de fotos\">✕</button>\n      </div>\n      <figure class=\"visor-figura\">\n        <img id=\"visor-imagen\" src=\"\" alt=\"\">\n        <figcaption id=\"visor-leyenda\"></figcaption>\n      </figure>\n      <div class=\"visor-navegacion\">\n        <button type=\"button\" class=\"visor-btn\" data-visor=\"anterior\" aria-label=\"Foto anterior\">‹</button>\n        <span class=\"visor-contador\" id=\"visor-contador\" role=\"status\" aria-live=\"polite\">1 / 1</span>\n        <button type=\"button\" class=\"visor-btn\" data-visor=\"siguiente\" aria-label=\"Foto siguiente\">›</button>"
  },
  "h_salto": {
   "archivo": "public/index.html",
   "desde": 33,
   "hasta": 33,
   "lenguaje": "html",
   "autor": "Jesus De Olivera",
   "codigo": "  <a class=\"salto-contenido\" href=\"#contenido\">Saltar al contenido principal</a>"
  },
  "h_live": {
   "archivo": "public/index.html",
   "desde": 76,
   "hasta": 78,
   "lenguaje": "html",
   "autor": "Jesus De Olivera",
   "codigo": "  <p id=\"anuncio-ruta\" class=\"solo-lectores\" role=\"status\" aria-live=\"polite\"></p>\n\n  <main id=\"contenido\">"
  },
  "j_crear": {
   "archivo": "public/js/app.js",
   "desde": 74,
   "hasta": 84,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  /**\n   * Crea un elemento y le pone texto con textContent.\n   * Centralizar la creación acá es lo que garantiza que en todo el\n   * archivo no exista un solo .innerHTML con datos del servidor.\n   */\n  function crear(etiqueta, clase, texto) {\n    const el = document.createElement(etiqueta);\n    if (clase) el.className = clase;\n    if (texto !== undefined && texto !== null) el.textContent = String(texto);\n    return el;\n  }"
  },
  "j_pedir": {
   "archivo": "public/js/app.js",
   "desde": 111,
   "hasta": 157,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  /**\n   * Hace una petición a la API y devuelve el código HTTP junto al cuerpo.\n   *\n   * No lanza excepción cuando el servidor responde 400 o 401: esos códigos\n   * son respuestas legítimas que cada vista interpreta. Sí avisa cuando no\n   * hay red o cuando el servidor devolvió algo que no es JSON.\n   */\n  async function pedir(ruta, opciones = {}) {\n    const configuracion = {\n      method: opciones.metodo || 'GET',\n      // Manda la cookie de sesión de PHP. Es same-origin porque la SPA y la\n      // API se sirven desde el mismo host (localhost).\n      credentials: 'same-origin',\n      headers: { Accept: 'application/json' },\n    };\n\n    if (opciones.cuerpo !== undefined) {\n      configuracion.headers['Content-Type'] = 'application/json; charset=utf-8';\n      configuracion.body = JSON.stringify(opciones.cuerpo);\n    }\n\n    let respuesta;\n    try {\n      respuesta = await fetch(`${API}/${ruta}`, configuracion);\n    } catch (error) {\n      console.error('Fallo de red al pedir', ruta, error);\n      return { codigo: 0, cuerpo: { ok: false, mensaje: 'No pudimos conectar con el servidor. Verificá que Apache y MySQL estén corriendo en XAMPP.' } };\n    }\n\n    let cuerpo;\n    try {\n      cuerpo = await respuesta.json();\n    } catch (error) {\n      console.error('La respuesta no era JSON válido', ruta, error);\n      cuerpo = { ok: false, mensaje: 'El servidor devolvió una respuesta inesperada.' };\n    }\n\n    // 401 significa que la sesión se cayó o nunca existió: se sincroniza el\n    // estado local para que la interfaz vuelva a mostrar la vista de visitante.\n    if (respuesta.status === 401 && estado.usuario !== null) {\n      estado.usuario = null;\n      estado.favoritos = [];\n      aplicarVista();\n    }\n\n    return { codigo: respuesta.status, cuerpo };\n  }"
  },
  "j_tema": {
   "archivo": "public/js/app.js",
   "desde": 286,
   "hasta": 297,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  function alternarTema() {\n    const oscuro = document.documentElement.classList.toggle('tema-oscuro');\n    try { localStorage.setItem(CLAVE_TEMA, oscuro ? 'oscuro' : 'claro'); } catch { /* sin persistencia */ }\n    actualizarBotonTema();\n  }\n\n  // Se aplica antes de que el navegador pinte, para que no se vea el cambio.\n  aplicarTemaInicial();\n\n  /* ===================================================================\n     6. SESIÓN Y VISIBILIDAD POR AUDIENCIA (VSDM)\n     =================================================================== */"
  },
  "j_sesion": {
   "archivo": "public/js/app.js",
   "desde": 299,
   "hasta": 316,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  /**\n   * Le pregunta al servidor quién está autenticado.\n   *\n   * Diferencia clave con la AE2: antes la sesión se leía del sessionStorage\n   * del navegador, así que el propio usuario podía inventarla. Ahora la\n   * única fuente es api/sesion.php, que responde según $_SESSION.\n   */\n  async function sincronizarSesion() {\n    const { cuerpo } = await pedir('sesion.php');\n    if (cuerpo && cuerpo.autenticado) {\n      estado.usuario = cuerpo.usuario;\n      estado.favoritos = Array.isArray(cuerpo.favoritos) ? cuerpo.favoritos : [];\n    } else {\n      estado.usuario = null;\n      estado.favoritos = [];\n    }\n    aplicarVista();\n  }"
  },
  "j_vista": {
   "archivo": "public/js/app.js",
   "desde": 324,
   "hasta": 348,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  /**\n   * Muestra u oculta cada elemento según la audiencia declarada en su\n   * atributo data-vista. Un elemento puede servir a varias audiencias:\n   * data-vista=\"usuario agente\".\n   */\n  function aplicarVista() {\n    const actual = audiencia();\n    document.documentElement.dataset.audiencia = actual;\n\n    $$('[data-vista]').forEach((el) => {\n      const audiencias = el.dataset.vista.split(/\\s+/);\n      el.hidden = !audiencias.includes(actual);\n    });\n\n    if (estado.usuario) {\n      $$('[data-usuario-nombre]').forEach((el) => {\n        el.textContent = estado.usuario.nombre.split(' ')[0];\n      });\n      $$('[data-usuario-email]').forEach((el) => {\n        el.textContent = estado.usuario.email;\n      });\n    }\n\n    pintarFavoritos();\n  }"
  },
  "j_logout": {
   "archivo": "public/js/app.js",
   "desde": 350,
   "hasta": 361,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  async function cerrarSesion() {\n    await pedir('logout.php', { metodo: 'POST' });\n    estado.usuario = null;\n    estado.favoritos = [];\n    aplicarVista();\n    mostrarAviso('Cerraste sesión. ¡Te esperamos pronto!');\n    irA('#/inicio');\n  }\n\n  /* ===================================================================\n     7. TARJETAS DE PROPIEDAD  (compartidas por inicio, catálogo y favoritos)\n     =================================================================== */"
  },
  "j_btnfav": {
   "archivo": "public/js/app.js",
   "desde": 363,
   "hasta": 373,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  /** Botón de favorito con su estado accesible (aria-pressed). */\n  function crearBotonFavorito(propiedadId) {\n    const marcado = estado.favoritos.includes(Number(propiedadId));\n    const boton = crear('button', 'btn-favorito', '♥');\n    boton.type = 'button';\n    boton.dataset.favorito = String(propiedadId);\n    boton.classList.toggle('is-activo', marcado);\n    boton.setAttribute('aria-pressed', String(marcado));\n    boton.setAttribute('aria-label', marcado ? 'Quitar de favoritos' : 'Agregar a favoritos');\n    return boton;\n  }"
  },
  "j_fav": {
   "archivo": "public/js/app.js",
   "desde": 455,
   "hasta": 489,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  /** Alterna el favorito contra la API. Necesita sesión activa. */\n  async function alternarFavorito(boton) {\n    const propiedadId = Number(boton.dataset.favorito);\n\n    if (estado.usuario === null) {\n      mostrarAviso('Ingresá a tu cuenta para guardar propiedades favoritas.', '#/acceso', 'Ingresar');\n      return;\n    }\n\n    const yaEstaba = estado.favoritos.includes(propiedadId);\n    boton.disabled = true;\n\n    const respuesta = yaEstaba\n      ? await pedir(`favoritos.php?propiedad_id=${propiedadId}`, { metodo: 'DELETE' })\n      : await pedir('favoritos.php', { metodo: 'POST', cuerpo: { propiedad_id: propiedadId } });\n\n    boton.disabled = false;\n\n    if (respuesta.cuerpo && respuesta.cuerpo.ok) {\n      estado.favoritos = respuesta.cuerpo.ids.map(Number);\n      pintarFavoritos();\n      mostrarAviso(yaEstaba ? 'Quitamos la propiedad de tus favoritos.' : 'Guardamos la propiedad en tus favoritos.');\n      if (rutaActual().vista === 'favoritos') cargarFavoritos();\n    } else {\n      mostrarAviso(respuesta.cuerpo.mensaje || 'No pudimos actualizar tus favoritos.');\n    }\n  }\n\n  /* ===================================================================\n     8. VISOR DE FOTOS\n        <dialog> nativo: el navegador atrapa el foco adentro mientras está\n        abierto y lo cierra con Escape, sin código extra.\n     =================================================================== */\n\n  const visor = { fotos: [], indice: 0, titulo: '' };"
  },
  "j_visor": {
   "archivo": "public/js/app.js",
   "desde": 505,
   "hasta": 519,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  function abrirVisor(propiedadId) {\n    const id = Number(propiedadId);\n    const propiedad = estado.propiedades.find((p) => Number(p.id) === id)\n      || (estado.fichaActual && Number(estado.fichaActual.id) === id ? estado.fichaActual : null);\n\n    if (!propiedad || !Array.isArray(propiedad.fotos) || propiedad.fotos.length === 0) return;\n\n    visor.fotos = propiedad.fotos;\n    visor.indice = 0;\n    visor.titulo = propiedad.titulo;\n\n    $('#visor-titulo').textContent = propiedad.titulo;\n    mostrarFotoDelVisor();\n    $('#visor').showModal();\n  }"
  },
  "j_filtrar": {
   "archivo": "public/js/app.js",
   "desde": 578,
   "hasta": 595,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  function filtrarPortada(filtro) {\n    $$('[data-filtro-inicio]').forEach((boton) => {\n      const activo = boton.dataset.filtroInicio === filtro;\n      boton.classList.toggle('is-activo', activo);\n      boton.setAttribute('aria-pressed', String(activo));\n    });\n\n    const grilla = $('#grilla-inicio');\n    grilla.dataset.filtro = filtro;\n\n    const tarjetas = $$('.card-propiedad', grilla);\n    tarjetas.forEach((card) => {\n      card.classList.toggle('is-oculta', filtro !== 'todas' && card.dataset.tipo !== filtro);\n    });\n\n    const visibles = tarjetas.filter((c) => !c.classList.contains('is-oculta')).length;\n    estadoTexto('estado-inicio', `Mostrando ${visibles} de ${tarjetas.length} propiedades.`);\n  }"
  },
  "j_catalogo": {
   "archivo": "public/js/app.js",
   "desde": 605,
   "hasta": 642,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  /**\n   * Acá el filtro sí viaja al servidor: la consulta SQL devuelve sólo las\n   * propiedades del tipo pedido. Es la diferencia con el filtro de la\n   * portada, que es puramente visual.\n   */\n  async function cargarCatalogo(tipo = 'todas') {\n    const grilla = $('#grilla-catalogo');\n    estadoTexto('estado-catalogo', 'Cargando propiedades…');\n    grilla.setAttribute('aria-busy', 'true');\n\n    $$('[data-filtro-catalogo]').forEach((boton) => {\n      const activo = boton.dataset.filtroCatalogo === tipo;\n      boton.classList.toggle('is-activo', activo);\n      boton.setAttribute('aria-pressed', String(activo));\n    });\n\n    const consulta = tipo === 'todas' ? 'propiedades.php' : `propiedades.php?tipo=${encodeURIComponent(tipo)}`;\n    const { codigo, cuerpo } = await pedir(consulta);\n\n    grilla.removeAttribute('aria-busy');\n\n    if (codigo !== 200 || !cuerpo.ok) {\n      vaciar(grilla);\n      estadoTexto('estado-catalogo', cuerpo.mensaje || 'No pudimos cargar el catálogo.', true);\n      return;\n    }\n\n    estado.propiedades = cuerpo.propiedades;\n\n    if (estado.propiedades.length === 0) {\n      vaciar(grilla);\n      estadoTexto('estado-catalogo', 'Todavía no hay propiedades de ese tipo publicadas.');\n      return;\n    }\n\n    grilla.replaceChildren(...estado.propiedades.map((p) => crearTarjeta(p)));\n    estadoTexto('estado-catalogo', `Mostrando ${estado.propiedades.length} propiedades.`);\n  }"
  },
  "j_ficha": {
   "archivo": "public/js/app.js",
   "desde": 646,
   "hasta": 693,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  async function cargarFicha(id) {\n    const contenedor = $('#detalle-propiedad');\n    vaciar(contenedor);\n    estadoTexto('estado-ficha', 'Cargando la ficha…');\n\n    const { codigo, cuerpo } = await pedir(`propiedades.php?id=${encodeURIComponent(id)}`);\n\n    if (codigo === 404) {\n      estadoTexto('estado-ficha', 'No encontramos esa propiedad. Puede que el agente la haya dado de baja.', true);\n      return;\n    }\n    if (codigo !== 200 || !cuerpo.ok) {\n      estadoTexto('estado-ficha', cuerpo.mensaje || 'No pudimos cargar la ficha.', true);\n      return;\n    }\n\n    const propiedad = cuerpo.propiedad;\n    estado.fichaActual = propiedad;\n    $('#titulo-ficha').textContent = propiedad.titulo;\n    estadoTexto('estado-ficha', `Ficha de ${propiedad.titulo}.`);\n\n    /* ----- Columna de fotos ----- */\n    const galeria = crear('div', 'producto-galeria');\n    const fotos = Array.isArray(propiedad.fotos) ? propiedad.fotos : [];\n\n    if (fotos.length > 0) {\n      const principal = crear('div', 'producto-galeria-principal');\n      fotos.forEach((foto) => {\n        const img = crear('img');\n        img.src = foto.ruta;\n        img.alt = foto.texto_alt;\n        img.width = 800;\n        img.height = 520;\n        principal.appendChild(img);\n      });\n      galeria.appendChild(principal);\n\n      const verFotos = crear('button', 'btn btn-outline btn-sm',\n        fotos.length > 1 ? `Abrir el visor (${fotos.length} fotos)` : 'Abrir el visor');\n      verFotos.type = 'button';\n      verFotos.dataset.verFotos = String(propiedad.id);\n      galeria.appendChild(verFotos);\n    } else {\n      galeria.appendChild(crear('p', 'producto-galeria-ayuda', 'Esta propiedad todavía no tiene fotos cargadas.'));\n    }\n\n    /* ----- Columna de datos ----- */\n    const info = crear('div', 'producto-info');"
  },
  "j_wsp": {
   "archivo": "public/js/app.js",
   "desde": 730,
   "hasta": 735,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "    const texto = encodeURIComponent(`Hola RN Inmobiliaria. Me interesa la propiedad \"${propiedad.titulo}\" (${precioEnDolares(propiedad.precio)}).`);\n    const whatsapp = crear('a', 'btn btn-outline', 'Consultar por WhatsApp');\n    whatsapp.href = `https://wa.me/5493764170186?text=${texto}`;\n    whatsapp.target = '_blank';\n    whatsapp.rel = 'noopener';\n    acciones.appendChild(whatsapp);"
  },
  "j_login": {
   "archivo": "public/js/app.js",
   "desde": 759,
   "hasta": 804,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  async function enviarLogin(evento) {\n    evento.preventDefault();\n    const formulario = evento.currentTarget;\n    const email = formulario.elements.email;\n    const password = formulario.elements.password;\n\n    limpiarErrores(formulario);\n    ocultarAlerta('auth-alerta');\n\n    let valido = true;\n    if (!emailValido(email.value.trim())) {\n      marcarError(email, 'Ingresá un e-mail válido.');\n      valido = false;\n    }\n    if (password.value.length < LARGO_MINIMO_CLAVE) {\n      marcarError(password, `La contraseña debe tener al menos ${LARGO_MINIMO_CLAVE} caracteres.`);\n      valido = false;\n    }\n    if (!valido) {\n      mostrarAlerta('auth-alerta', 'error', 'Revisá los campos marcados.');\n      $('[aria-invalid=\"true\"]', formulario).focus();\n      return;\n    }\n\n    botonCargando(formulario, true, 'Verificando…');\n    mostrarAlerta('auth-alerta', 'cargando', 'Verificando tus credenciales en el servidor…');\n\n    const { codigo, cuerpo } = await pedir('login.php', {\n      metodo: 'POST',\n      cuerpo: { email: email.value.trim(), password: password.value },\n    });\n\n    botonCargando(formulario, false);\n\n    if (codigo === 200 && cuerpo.ok) {\n      formulario.reset();\n      mostrarAlerta('auth-alerta', 'exito', `¡Bienvenido/a, ${cuerpo.usuario.nombre}! Sesión iniciada.`);\n      await sincronizarSesion();\n      return;\n    }\n\n    // 401: el servidor no dice si falló el e-mail o la contraseña, a propósito.\n    mostrarAlerta('auth-alerta', 'error', cuerpo.mensaje || 'No pudimos iniciar la sesión.');\n    password.value = '';\n    password.focus();\n  }"
  },
  "j_registro": {
   "archivo": "public/js/app.js",
   "desde": 806,
   "hasta": 862,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  async function enviarRegistro(evento) {\n    evento.preventDefault();\n    const formulario = evento.currentTarget;\n    const { nombre, email, password, password2 } = formulario.elements;\n\n    limpiarErrores(formulario);\n    ocultarAlerta('auth-alerta');\n\n    let valido = true;\n    if (nombre.value.trim().length < 3) {\n      marcarError(nombre, 'Ingresá tu nombre completo.');\n      valido = false;\n    }\n    if (!emailValido(email.value.trim())) {\n      marcarError(email, 'Ingresá un e-mail válido.');\n      valido = false;\n    }\n    if (password.value.length < LARGO_MINIMO_CLAVE) {\n      marcarError(password, `Mínimo ${LARGO_MINIMO_CLAVE} caracteres.`);\n      valido = false;\n    }\n    if (password2.value !== password.value) {\n      marcarError(password2, 'Las contraseñas no coinciden.');\n      valido = false;\n    }\n    if (!valido) {\n      mostrarAlerta('auth-alerta', 'error', 'Revisá los campos marcados.');\n      $('[aria-invalid=\"true\"]', formulario).focus();\n      return;\n    }\n\n    botonCargando(formulario, true, 'Creando cuenta…');\n    mostrarAlerta('auth-alerta', 'cargando', 'Enviando tus datos al servidor…');\n\n    const { codigo, cuerpo } = await pedir('registro.php', {\n      metodo: 'POST',\n      cuerpo: {\n        nombre: nombre.value.trim(),\n        email: email.value.trim(),\n        password: password.value,\n        password2: password2.value,\n      },\n    });\n\n    botonCargando(formulario, false);\n\n    if (codigo === 201 && cuerpo.ok) {\n      formulario.reset();\n      mostrarAlerta('auth-alerta', 'exito', `¡Cuenta creada! Bienvenido/a, ${cuerpo.usuario.nombre}.`);\n      await sincronizarSesion();\n      return;\n    }\n\n    mostrarAlerta('auth-alerta', 'error', cuerpo.mensaje || 'No pudimos crear la cuenta.');\n    volcarErroresDelServidor(formulario, cuerpo.campos, 'reg');\n    if (codigo === 409) marcarError(email, cuerpo.mensaje);\n  }"
  },
  "j_compra": {
   "archivo": "public/js/app.js",
   "desde": 925,
   "hasta": 968,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  async function enviarCompra(evento) {\n    evento.preventDefault();\n    const formulario = evento.currentTarget;\n\n    limpiarErrores(formulario);\n    ocultarAlerta('compra-alerta');\n\n    const elegidas = $$('#compra-propiedades input[type=\"checkbox\"]:checked').map((c) => Number(c.value));\n\n    if (elegidas.length === 0) {\n      $('#compra-propiedades-error').textContent = 'Elegí al menos una propiedad.';\n      mostrarAlerta('compra-alerta', 'error', 'Falta elegir las propiedades que te interesan.');\n      return;\n    }\n\n    botonCargando(formulario, true, 'Enviando…');\n    mostrarAlerta('compra-alerta', 'cargando', 'Enviando la solicitud al servidor…');\n\n    const { codigo, cuerpo } = await pedir('solicitudes.php', {\n      metodo: 'POST',\n      cuerpo: {\n        nombre: formulario.elements.nombre.value.trim(),\n        telefono: formulario.elements.telefono.value.trim(),\n        direccion: formulario.elements.direccion.value.trim(),\n        email: formulario.elements.email.value.trim(),\n        medio_pago: formulario.elements.medio_pago.value,\n        mensaje: formulario.elements.mensaje.value.trim(),\n        propiedades: elegidas,\n      },\n    });\n\n    botonCargando(formulario, false);\n\n    if (codigo === 201 && cuerpo.ok) {\n      mostrarAlerta('compra-alerta', 'exito', `${cuerpo.mensaje} Número de solicitud: ${cuerpo.solicitud_id}.`);\n      $$('#compra-propiedades input[type=\"checkbox\"]').forEach((c) => { c.checked = false; });\n      formulario.elements.mensaje.value = '';\n      formulario.elements.medio_pago.selectedIndex = 0;\n      return;\n    }\n\n    mostrarAlerta('compra-alerta', 'error', cuerpo.mensaje || 'No pudimos registrar la solicitud.');\n    volcarErroresDelServidor(formulario, cuerpo.campos, 'compra');\n  }"
  },
  "j_favs": {
   "archivo": "public/js/app.js",
   "desde": 972,
   "hasta": 1000,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  async function cargarFavoritos() {\n    if (estado.usuario === null) return;\n\n    const grilla = $('#grilla-favoritos');\n    estadoTexto('estado-favoritos', 'Cargando tus favoritos…');\n\n    const { codigo, cuerpo } = await pedir('favoritos.php');\n\n    if (codigo !== 200 || !cuerpo.ok) {\n      vaciar(grilla);\n      estadoTexto('estado-favoritos', cuerpo.mensaje || 'No pudimos cargar tus favoritos.', true);\n      return;\n    }\n\n    estado.favoritos = cuerpo.ids.map(Number);\n\n    if (cuerpo.favoritos.length === 0) {\n      vaciar(grilla);\n      estadoTexto('estado-favoritos', 'Todavía no marcaste ninguna propiedad. Buscá el corazón en las tarjetas del catálogo.');\n      return;\n    }\n\n    grilla.replaceChildren(...cuerpo.favoritos.map((p) => crearTarjeta(p, { sinCinta: true })));\n    estadoTexto('estado-favoritos', `Tenés ${cuerpo.favoritos.length} propiedades guardadas.`);\n  }\n\n  /* ---------------- 9.7 Panel del agente  (UC9) ---------------- */\n\n  let contadorFotos = 0;"
  },
  "j_prop": {
   "archivo": "public/js/app.js",
   "desde": 1107,
   "hasta": 1134,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  async function enviarPropiedad(evento) {\n    evento.preventDefault();\n    const formulario = evento.currentTarget;\n    limpiarErrores(formulario);\n\n    const datos = leerFormularioPropiedad();\n    const id = $('#prop-id').value;\n    const esEdicion = id !== '';\n\n    botonCargando(formulario, true, esEdicion ? 'Guardando…' : 'Creando…');\n    mostrarAlerta('panel-alerta', 'cargando', esEdicion ? 'Guardando los cambios…' : 'Creando la propiedad…');\n\n    const { codigo, cuerpo } = esEdicion\n      ? await pedir(`propiedades.php?id=${encodeURIComponent(id)}`, { metodo: 'PUT', cuerpo: datos })\n      : await pedir('propiedades.php', { metodo: 'POST', cuerpo: datos });\n\n    botonCargando(formulario, false);\n\n    if ((codigo === 200 || codigo === 201) && cuerpo.ok) {\n      mostrarAlerta('panel-alerta', 'exito', esEdicion ? 'Guardamos los cambios.' : 'Creamos la propiedad.');\n      reiniciarFormularioPropiedad();\n      cargarPanel();\n      return;\n    }\n\n    mostrarAlerta('panel-alerta', 'error', cuerpo.mensaje || 'No pudimos guardar la propiedad.');\n    volcarErroresDelServidor(formulario, cuerpo.campos, 'prop');\n  }"
  },
  "j_elim": {
   "archivo": "public/js/app.js",
   "desde": 1136,
   "hasta": 1152,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  async function eliminarPropiedad(id, titulo) {\n    // confirm() es nativo y accesible; evita un borrado por un clic de más.\n    if (!window.confirm(`¿Eliminar \"${titulo}\"? Se borran también sus fotos, sus favoritos y sus renglones de solicitudes.`)) {\n      return;\n    }\n\n    const { codigo, cuerpo } = await pedir(`propiedades.php?id=${encodeURIComponent(id)}`, { metodo: 'DELETE' });\n\n    if (codigo === 200 && cuerpo.ok) {\n      mostrarAlerta('panel-alerta', 'exito', 'Propiedad eliminada.');\n      if (estado.editando === Number(id)) reiniciarFormularioPropiedad();\n      cargarPanel();\n      return;\n    }\n\n    mostrarAlerta('panel-alerta', 'error', cuerpo.mensaje || 'No pudimos eliminar la propiedad.');\n  }"
  },
  "j_estado": {
   "archivo": "public/js/app.js",
   "desde": 1245,
   "hasta": 1257,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  async function cambiarEstadoSolicitud(select) {\n    const id = select.dataset.solicitud;\n    const { codigo, cuerpo } = await pedir(`solicitudes.php?id=${encodeURIComponent(id)}`, {\n      metodo: 'PATCH',\n      cuerpo: { estado: select.value },\n    });\n\n    if (codigo === 200 && cuerpo.ok) {\n      mostrarAviso(`Solicitud ${id} marcada como ${select.value}.`);\n      return;\n    }\n    mostrarAlerta('panel-alerta', 'error', cuerpo.mensaje || 'No pudimos cambiar el estado.');\n  }"
  },
  "j_ruta": {
   "archivo": "public/js/app.js",
   "desde": 1343,
   "hasta": 1413,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "  /**\n   * Muestra la vista que pide el hash y carga sus datos.\n   *\n   * Accesibilidad: después de cambiar de vista el foco pasa al título y el\n   * nombre de la sección se escribe en la región aria-live, porque en una\n   * SPA el navegador no avisa que cambió la página.\n   */\n  async function atenderRuta() {\n    const { vista, parametro } = rutaActual();\n\n    Object.values(VISTAS).forEach(({ seccion }) => {\n      const el = document.getElementById(seccion);\n      if (el) el.hidden = true;\n    });\n\n    const destino = VISTAS[vista];\n    const seccion = document.getElementById(destino.seccion);\n    if (seccion) seccion.hidden = false;\n\n    marcarMenu(vista);\n\n    // Cierra el menú hamburguesa si quedó abierto al navegar en celular.\n    const menu = $('#menu-toggle');\n    if (menu) menu.checked = false;\n\n    window.scrollTo({ top: 0, behavior: 'auto' });\n\n    const titulo = document.getElementById(destino.titulo);\n    if (titulo && !primeraRuta) titulo.focus();\n\n    if (!primeraRuta) {\n      $('#anuncio-ruta').textContent = `Sección: ${destino.nombre}`;\n    }\n    primeraRuta = false;\n    document.title = vista === 'inicio'\n      ? 'RN Inmobiliaria — Propiedades en venta en Posadas, Misiones'\n      : `${destino.nombre} — RN Inmobiliaria`;\n\n    switch (vista) {\n      case 'inicio':\n        await cargarInicio();\n        break;\n      case 'propiedades':\n        await cargarCatalogo(parametro || 'todas');\n        break;\n      case 'propiedad':\n        if (parametro === null) {\n          irA('#/propiedades');\n          return;\n        }\n        await cargarFicha(parametro);\n        break;\n      case 'acceso':\n        activarPestana('login');\n        break;\n      case 'comprar':\n        if (estado.usuario !== null) {\n          precargarFormularioCompra();\n          await cargarPropiedadesParaCompra(parametro);\n        }\n        break;\n      case 'favoritos':\n        await cargarFavoritos();\n        break;\n      case 'panel':\n        await cargarPanel();\n        break;\n      default:\n        break;\n    }\n  }"
  },
  "j_deleg": {
   "archivo": "public/js/app.js",
   "desde": 1475,
   "hasta": 1511,
   "lenguaje": "js",
   "autor": "Jesus De Olivera",
   "codigo": "       las tablas se crean DESPUÉS de cargar la página, así que no se les\n       puede asignar un listener de entrada. Se escucha una sola vez acá y\n       se identifica el origen del clic con closest(). */\n    document.addEventListener('click', (evento) => {\n      const favorito = evento.target.closest('.btn-favorito');\n      if (favorito) { alternarFavorito(favorito); return; }\n\n      const verFotos = evento.target.closest('[data-ver-fotos]');\n      if (verFotos) { abrirVisor(verFotos.dataset.verFotos); return; }\n\n      const editar = evento.target.closest('[data-editar]');\n      if (editar) {\n        const id = Number(editar.dataset.editar);\n        const propiedad = estado.propiedades.find((p) => Number(p.id) === id);\n        if (propiedad) {\n          cargarPropiedadEnFormulario(propiedad);\n        } else {\n          pedir(`propiedades.php?id=${id}`).then(({ cuerpo }) => {\n            if (cuerpo.ok) cargarPropiedadEnFormulario(cuerpo.propiedad);\n          });\n        }\n        return;\n      }\n\n      const eliminar = evento.target.closest('[data-eliminar]');\n      if (eliminar) { eliminarPropiedad(eliminar.dataset.eliminar, eliminar.dataset.titulo); return; }\n\n      const quitarFoto = evento.target.closest('[data-accion=\"quitar-foto\"]');\n      if (quitarFoto) {\n        const filas = $$('#prop-fotos .fila-foto');\n        if (filas.length > 1) {\n          quitarFoto.closest('.fila-foto').remove();\n        } else {\n          mostrarAviso('Dejá al menos una fila de foto; podés borrar su contenido.');\n        }\n      }\n    });"
  },
  "c_conexion": {
   "archivo": "config/conexion.php",
   "desde": 19,
   "hasta": 75,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "final class Conexion\n{\n    /** Datos de acceso del entorno local XAMPP (root sin contraseña por defecto). */\n    private const HOST    = 'localhost';\n    private const PUERTO  = 3306;\n    private const BASE    = 'rn_inmobiliaria';\n    private const USUARIO = 'root';\n    private const CLAVE   = '';\n\n    /** Única instancia de PDO de toda la aplicación. */\n    private static ?PDO $instancia = null;\n\n    /** Constructor privado: nadie puede hacer \"new Conexion()\" desde afuera. */\n    private function __construct()\n    {\n    }\n\n    /** Clonar también queda prohibido, así no aparece una segunda instancia. */\n    private function __clone()\n    {\n    }\n\n    /**\n     * Devuelve la conexión PDO. La crea sólo la primera vez que se la pide.\n     *\n     * @throws PDOException si el servidor MySQL no responde o la base no existe.\n     *                      Cada endpoint la captura y responde 500 sin filtrar\n     *                      datos internos del servidor (OWASP A09).\n     */\n    public static function obtener(): PDO\n    {\n        if (self::$instancia === null) {\n            $dsn = sprintf(\n                'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',\n                self::HOST,\n                self::PUERTO,\n                self::BASE\n            );\n\n            self::$instancia = new PDO($dsn, self::USUARIO, self::CLAVE, [\n                // Los errores de SQL se convierten en excepciones PDOException.\n                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,\n                // Cada fila llega como arreglo asociativo, listo para json_encode().\n                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n                // Prepared statements REALES del motor, no emulados por el driver.\n                // Es la defensa de fondo contra inyección SQL (OWASP A03): los\n                // parámetros viajan separados de la sentencia y el motor nunca\n                // los interpreta como código.\n                PDO::ATTR_EMULATE_PREPARES   => false,\n                // Los INT y DECIMAL llegan como números, no como cadenas.\n                PDO::ATTR_STRINGIFY_FETCHES  => false,\n            ]);\n        }\n\n        return self::$instancia;\n    }\n}"
  },
  "c_respuesta": {
   "archivo": "config/respuesta.php",
   "desde": 12,
   "hasta": 42,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "/**\n * Cierra la petición devolviendo JSON con su código HTTP.\n *\n * @param int   $codigo Código de estado: 200, 201, 400, 401, 403, 404, 500...\n * @param array $cuerpo Datos que se serializan con json_encode().\n */\nfunction responder(int $codigo, array $cuerpo): void\n{\n    http_response_code($codigo);\n    header('Content-Type: application/json; charset=utf-8');\n    // X-Content-Type-Options evita que el navegador \"adivine\" otro tipo de\n    // contenido y ejecute la respuesta como si fuera HTML (OWASP A05).\n    header('X-Content-Type-Options: nosniff');\n\n    echo json_encode($cuerpo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);\n    exit;\n}\n\n/**\n * Respuesta de error con un mensaje pensado para mostrarle al usuario.\n * Nunca incluye el detalle técnico de la excepción: ese se registra en el log\n * del servidor con error_log() y no se filtra al cliente (OWASP A09).\n */\nfunction errorJson(int $codigo, string $mensaje, array $campos = []): void\n{\n    $cuerpo = ['ok' => false, 'mensaje' => $mensaje];\n    if ($campos !== []) {\n        $cuerpo['campos'] = $campos;\n    }\n    responder($codigo, $cuerpo);\n}"
  },
  "c_iniciar": {
   "archivo": "config/sesion.php",
   "desde": 18,
   "hasta": 36,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "/**\n * Arranca la sesión con parámetros de cookie endurecidos.\n * Hay que llamarla ANTES de escribir cualquier salida.\n */\nfunction iniciarSesionSegura(): void\n{\n    if (session_status() === PHP_SESSION_ACTIVE) {\n        return;\n    }\n\n    session_set_cookie_params([\n        'httponly' => true,   // JavaScript no puede leer la cookie: frena el robo por XSS\n        'samesite' => 'Lax',  // la cookie no viaja en peticiones de otros sitios (CSRF)\n        'path'     => '/',\n        // 'secure' => true,  // activarlo cuando el sitio se publique con HTTPS\n    ]);\n\n    session_start();\n}"
  },
  "c_abrir": {
   "archivo": "config/sesion.php",
   "desde": 38,
   "hasta": 54,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "/**\n * Guarda al usuario en la sesión después de un login correcto.\n * session_regenerate_id(true) cambia el identificador y borra el anterior:\n * si un atacante conocía el ID previo, deja de servirle (session fixation).\n */\nfunction abrirSesionUsuario(array $usuario): void\n{\n    session_regenerate_id(true);\n\n    $_SESSION['usuario'] = [\n        'id'     => (int) $usuario['id'],\n        'nombre' => $usuario['nombre'],\n        'email'  => $usuario['email'],\n        'rol'    => $usuario['rol'],\n    ];\n    $_SESSION['iniciada_en'] = time();\n}"
  },
  "c_sesion": {
   "archivo": "config/sesion.php",
   "desde": 75,
   "hasta": 89,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "/**\n * Puerta de entrada de todo recurso protegido.\n * Si la petición es anónima corta la ejecución con 401 Unauthorized, tal como\n * pide la consigna, y devuelve un JSON que la SPA usa para mandar al login.\n */\nfunction exigirSesion(): array\n{\n    $usuario = usuarioEnSesion();\n\n    if ($usuario === null) {\n        errorJson(401, 'Necesitás iniciar sesión para acceder a este recurso.');\n    }\n\n    return $usuario;\n}"
  },
  "c_rol": {
   "archivo": "config/sesion.php",
   "desde": 91,
   "hasta": 106,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "/**\n * Exige además un rol determinado.\n * Diferencia importante para el coloquio: 401 es \"no sé quién sos\",\n * 403 es \"sé quién sos y no te alcanza\". Un cliente autenticado que intenta\n * borrar una propiedad recibe 403, no 401.\n */\nfunction exigirRol(string $rol): array\n{\n    $usuario = exigirSesion();\n\n    if ($usuario['rol'] !== $rol) {\n        errorJson(403, 'Tu cuenta no tiene permisos para esta operación.');\n    }\n\n    return $usuario;\n}"
  },
  "a_login": {
   "archivo": "api/login.php",
   "desde": 2,
   "hasta": 63,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "/**\n * RN Inmobiliaria — AE4 / TIFAS\n * api/login.php  —  POST /api/login.php\n *\n * Controlador del UC7 Iniciar y cerrar sesión.\n *\n * Entrada (JSON): { email, password }\n * Salidas: 200 OK             credenciales correctas, sesión abierta\n *          400 Bad Request    faltan datos\n *          401 Unauthorized   e-mail o contraseña incorrectos\n *          500 Internal Error falla de base de datos\n *\n * OWASP A02: la comparación la hace password_verify(), que vuelve a hashear\n * lo que escribió el usuario con la misma sal guardada en el hash y compara\n * en tiempo constante. Nunca se descifra nada: BCRYPT no es reversible.\n * OWASP A07: el mensaje de error es el mismo si el e-mail no existe o si la\n * contraseña está mal, así nadie puede usar el login para averiguar qué\n * e-mails están registrados (enumeración de usuarios).\n */\ndeclare(strict_types=1);\n\nrequire_once __DIR__ . '/../config/respuesta.php';\nrequire_once __DIR__ . '/../config/sesion.php';\nrequire_once __DIR__ . '/../models/UsuarioModel.php';\n\nexigirMetodo(['POST']);\niniciarSesionSegura();\n\n$datos = leerCuerpoJson();\n\n$email    = campoTexto($datos, 'email');\n$password = isset($datos['password']) ? (string) $datos['password'] : '';\n\nif ($email === '' || $password === '') {\n    errorJson(400, 'Completá el e-mail y la contraseña.');\n}\n\ntry {\n    $modelo  = new UsuarioModel();\n    $usuario = $modelo->buscarPorEmail($email);\n\n    if ($usuario === null || !password_verify($password, $usuario['password'])) {\n        errorJson(401, 'El e-mail o la contraseña no son correctos.');\n    }\n\n    // El hash no sale del servidor: se arma un arreglo sin la clave password.\n    $publico = [\n        'id'     => (int) $usuario['id'],\n        'nombre' => $usuario['nombre'],\n        'email'  => $usuario['email'],\n        'rol'    => $usuario['rol'],\n    ];\n\n    // Renueva el identificador de sesión (session_regenerate_id) para evitar\n    // fijación de sesión, y recién después guarda al usuario.\n    abrirSesionUsuario($publico);\n\n    exito(200, ['usuario' => $publico]);\n} catch (PDOException $error) {\n    registrarFalla('login', $error);\n    errorJson(500, 'No pudimos verificar tus credenciales. Intentá de nuevo.');\n}"
  },
  "a_registro": {
   "archivo": "api/registro.php",
   "desde": 2,
   "hasta": 89,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "/**\n * RN Inmobiliaria — AE4 / TIFAS\n * api/registro.php  —  POST /api/registro.php\n *\n * Controlador del UC6 Registrarse.\n *\n * Entrada  (JSON): { nombre, email, password, password2 }\n * Salidas: 201 Created        cuenta creada y sesión abierta\n *          400 Bad Request    faltan datos o no pasan la validación\n *          409 Conflict       ya existe una cuenta con ese e-mail\n *          500 Internal Error falla de base de datos\n *\n * OWASP A02 (Fallas criptográficas): la contraseña se guarda con\n * password_hash() usando BCRYPT. En la base queda un hash de 60 caracteres;\n * el texto plano no se escribe en ningún lado, ni en la base ni en el log.\n */\ndeclare(strict_types=1);\n\nrequire_once __DIR__ . '/../config/respuesta.php';\nrequire_once __DIR__ . '/../config/sesion.php';\nrequire_once __DIR__ . '/../models/UsuarioModel.php';\n\nexigirMetodo(['POST']);\niniciarSesionSegura();\n\n$datos = leerCuerpoJson();\n\n$nombre    = campoTexto($datos, 'nombre');\n$email     = campoTexto($datos, 'email');\n$password  = isset($datos['password'])  ? (string) $datos['password']  : '';\n$password2 = isset($datos['password2']) ? (string) $datos['password2'] : '';\n\n/* ------------------------------------------------------------------\n   Validación en el servidor.\n   El front también valida, pero esa validación es ayuda para el usuario,\n   no una defensa: cualquiera puede mandar un POST sin pasar por el\n   formulario. La única validación que cuenta es esta.\n   ------------------------------------------------------------------ */\n$errores = [];\n\nif (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 100) {\n    $errores['nombre'] = 'El nombre debe tener entre 3 y 100 caracteres.';\n}\n\nif ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {\n    $errores['email'] = 'Ingresá un e-mail válido.';\n}\n\nif (strlen($password) < 8) {\n    $errores['password'] = 'La contraseña debe tener al menos 8 caracteres.';\n}\n\nif ($password !== $password2) {\n    $errores['password2'] = 'Las contraseñas no coinciden.';\n}\n\nif ($errores !== []) {\n    errorJson(400, 'Revisá los datos del formulario.', $errores);\n}\n\ntry {\n    $modelo = new UsuarioModel();\n\n    if ($modelo->existeEmail($email)) {\n        errorJson(409, 'Ya existe una cuenta con ese e-mail. Probá ingresar.');\n    }\n\n    // PASSWORD_BCRYPT con el costo por defecto (10).\n    $hash = password_hash($password, PASSWORD_BCRYPT);\n\n    $id = $modelo->crear($nombre, $email, $hash, 'cliente');\n\n    $usuario = [\n        'id'     => $id,\n        'nombre' => $nombre,\n        'email'  => $email,\n        'rol'    => 'cliente',\n    ];\n\n    // Se deja la sesión iniciada para que el usuario no tenga que loguearse\n    // inmediatamente después de registrarse.\n    abrirSesionUsuario($usuario);\n\n    exito(201, ['usuario' => $usuario]);\n} catch (PDOException $error) {\n    registrarFalla('registro', $error);\n    errorJson(500, 'No pudimos crear la cuenta. Intentá de nuevo en unos minutos.');\n}"
  },
  "a_logout": {
   "archivo": "api/logout.php",
   "desde": 2,
   "hasta": 22,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "/**\n * RN Inmobiliaria — AE4 / TIFAS\n * api/logout.php  —  POST /api/logout.php\n *\n * Cierra la sesión del lado del servidor. Se usa POST y no GET porque es una\n * operación que cambia el estado del sistema: un GET podría dispararse solo\n * desde una imagen o un prefetch del navegador.\n *\n * Salidas: 200 OK  sesión cerrada (también si no había ninguna abierta)\n */\ndeclare(strict_types=1);\n\nrequire_once __DIR__ . '/../config/respuesta.php';\nrequire_once __DIR__ . '/../config/sesion.php';\n\nexigirMetodo(['POST']);\niniciarSesionSegura();\n\ncerrarSesionUsuario();\n\nexito(200, ['mensaje' => 'Sesión cerrada.']);"
  },
  "a_sesion": {
   "archivo": "api/sesion.php",
   "desde": 2,
   "hasta": 46,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "/**\n * RN Inmobiliaria — AE4 / TIFAS\n * api/sesion.php  —  GET /api/sesion.php\n *\n * Le dice a la SPA quién está autenticado. Es la pieza que reemplaza al\n * sessionStorage de la AE1: al cargar la página, el cliente pregunta al\n * servidor por la sesión en vez de confiar en lo que tiene guardado el\n * navegador. De esto depende la visibilidad por audiencia del modelo VSDM\n * que ya se había diseñado en el Startup Relámpago.\n *\n * Salidas: 200 OK con { autenticado: true, usuario }\n *          200 OK con { autenticado: false } si la petición es anónima\n *\n * Devuelve 200 y no 401 porque preguntar \"¿hay sesión?\" es una consulta\n * legítima de cualquier visitante; el 401 queda para los recursos protegidos.\n */\ndeclare(strict_types=1);\n\nrequire_once __DIR__ . '/../config/respuesta.php';\nrequire_once __DIR__ . '/../config/sesion.php';\nrequire_once __DIR__ . '/../models/FavoritoModel.php';\n\nexigirMetodo(['GET']);\niniciarSesionSegura();\n\n$usuario = usuarioEnSesion();\n\nif ($usuario === null) {\n    exito(200, ['autenticado' => false]);\n}\n\ntry {\n    // Se envían también los favoritos para que la primera pintada de las\n    // tarjetas ya muestre los corazones marcados sin una segunda petición.\n    $favoritos = (new FavoritoModel())->idsDeUsuario((int) $usuario['id']);\n\n    exito(200, [\n        'autenticado' => true,\n        'usuario'     => $usuario,\n        'favoritos'   => $favoritos,\n    ]);\n} catch (PDOException $error) {\n    registrarFalla('sesion', $error);\n    errorJson(500, 'No pudimos recuperar los datos de tu sesión.');\n}"
  },
  "a_fav": {
   "archivo": "api/favoritos.php",
   "desde": 2,
   "hasta": 82,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "/**\n * RN Inmobiliaria — AE4 / TIFAS\n * api/favoritos.php  —  recurso REST \"favoritos\"\n *\n * Controlador del UC8 Guardar propiedad favorita.\n *\n *   GET    /api/favoritos.php              propiedades favoritas del usuario\n *   POST   /api/favoritos.php              { propiedad_id }  marca una\n *   DELETE /api/favoritos.php?propiedad_id=1                 la desmarca\n *\n * Todo el recurso está protegido: la primera línea de cada rama llama a\n * exigirSesion(), que corta con 401 Unauthorized si la petición es anónima\n * (OWASP A01). El usuario_id NO viene del cliente, se toma de $_SESSION: así\n * nadie puede guardar o borrar favoritos en la cuenta de otra persona\n * (referencia directa insegura a objetos).\n */\ndeclare(strict_types=1);\n\nrequire_once __DIR__ . '/../config/respuesta.php';\nrequire_once __DIR__ . '/../config/sesion.php';\nrequire_once __DIR__ . '/../models/FavoritoModel.php';\nrequire_once __DIR__ . '/../models/PropiedadModel.php';\n\n$metodo = exigirMetodo(['GET', 'POST', 'DELETE']);\niniciarSesionSegura();\n\n$usuario   = exigirSesion();\n$usuarioId = (int) $usuario['id'];\n\ntry {\n    $modelo = new FavoritoModel();\n\n    if ($metodo === 'GET') {\n        exito(200, [\n            'favoritos' => $modelo->listarDeUsuario($usuarioId),\n            'ids'       => $modelo->idsDeUsuario($usuarioId),\n        ]);\n    }\n\n    if ($metodo === 'POST') {\n        $datos = leerCuerpoJson();\n        $propiedadId = filter_var($datos['propiedad_id'] ?? null, FILTER_VALIDATE_INT);\n\n        if ($propiedadId === false || $propiedadId < 1) {\n            errorJson(400, 'Falta el id de la propiedad.');\n        }\n\n        // Se verifica que la propiedad exista antes de insertar: si no, la\n        // clave foránea lanzaría una excepción y el cliente vería un 500.\n        if (!(new PropiedadModel())->idsValidos([$propiedadId])) {\n            errorJson(404, 'Esa propiedad no está disponible.');\n        }\n\n        $agregado = $modelo->agregar($usuarioId, $propiedadId);\n\n        exito($agregado ? 201 : 200, [\n            'mensaje' => $agregado ? 'Propiedad agregada a favoritos.' : 'Ya estaba en favoritos.',\n            'ids'     => $modelo->idsDeUsuario($usuarioId),\n        ]);\n    }\n\n    if ($metodo === 'DELETE') {\n        $propiedadId = filter_var($_GET['propiedad_id'] ?? null, FILTER_VALIDATE_INT);\n\n        if ($propiedadId === false || $propiedadId < 1) {\n            errorJson(400, 'Falta el id de la propiedad.');\n        }\n\n        if (!$modelo->quitar($usuarioId, $propiedadId)) {\n            errorJson(404, 'Esa propiedad no estaba entre tus favoritos.');\n        }\n\n        exito(200, [\n            'mensaje' => 'Propiedad quitada de favoritos.',\n            'ids'     => $modelo->idsDeUsuario($usuarioId),\n        ]);\n    }\n} catch (PDOException $error) {\n    registrarFalla('favoritos/' . $metodo, $error);\n    errorJson(500, 'No pudimos actualizar tus favoritos. Intentá de nuevo.');\n}"
  },
  "p_get": {
   "archivo": "api/propiedades.php",
   "desde": 146,
   "hasta": 186,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /* =============================== GET =============================== */\n    if ($metodo === 'GET') {\n        $id = idDeLaUrl();\n\n        // Ficha individual (UC3)\n        if (isset($_GET['id'])) {\n            if ($id === null) {\n                errorJson(400, 'El id de la propiedad no es válido.');\n            }\n\n            $propiedad = $modelo->buscarPorId($id);\n\n            if ($propiedad === null) {\n                errorJson(404, 'No encontramos esa propiedad.');\n            }\n\n            // Una propiedad dada de baja sólo la ve el agente.\n            if ($propiedad['activa'] === false && (usuarioEnSesion()['rol'] ?? '') !== 'agente') {\n                errorJson(404, 'No encontramos esa propiedad.');\n            }\n\n            exito(200, ['propiedad' => $propiedad]);\n        }\n\n        // Listado para el panel del agente: incluye las dadas de baja.\n        if (isset($_GET['todas'])) {\n            exigirRol('agente');\n            exito(200, ['propiedades' => $modelo->listar(null, true)]);\n        }\n\n        // Catálogo público, con filtro opcional por tipo (UC1)\n        $tipo = isset($_GET['tipo']) ? (string) $_GET['tipo'] : '';\n\n        if ($tipo !== '' && $tipo !== 'todas' && !in_array($tipo, TIPOS_VALIDOS, true)) {\n            errorJson(400, 'El tipo de propiedad solicitado no existe.');\n        }\n\n        $filtro = ($tipo === '' || $tipo === 'todas') ? null : $tipo;\n\n        exito(200, ['propiedades' => $modelo->listar($filtro)]);\n    }"
  },
  "p_post": {
   "archivo": "api/propiedades.php",
   "desde": 188,
   "hasta": 207,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /* =============================== POST ============================== */\n    if ($metodo === 'POST') {\n        exigirRol('agente');\n\n        [$datos, $errores] = validarPropiedad(leerCuerpoJson());\n\n        if ($errores !== []) {\n            errorJson(400, 'Revisá los datos de la propiedad.', $errores);\n        }\n\n        if ($modelo->existeSlug($datos['slug'])) {\n            errorJson(409, 'Ya hay una propiedad con ese identificador.', ['slug' => 'Identificador repetido.']);\n        }\n\n        $id = $modelo->crear($datos, $datos['fotos']);\n\n        // 201 Created: se creó un recurso nuevo y se informa dónde encontrarlo.\n        header('Location: propiedades.php?id=' . $id);\n        exito(201, ['propiedad' => $modelo->buscarPorId($id)]);\n    }"
  },
  "p_put": {
   "archivo": "api/propiedades.php",
   "desde": 209,
   "hasta": 235,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /* =============================== PUT =============================== */\n    if ($metodo === 'PUT') {\n        exigirRol('agente');\n\n        $id = idDeLaUrl();\n        if ($id === null) {\n            errorJson(400, 'Falta el id de la propiedad a modificar.');\n        }\n\n        if ($modelo->buscarPorId($id) === null) {\n            errorJson(404, 'No encontramos esa propiedad.');\n        }\n\n        [$datos, $errores] = validarPropiedad(leerCuerpoJson());\n\n        if ($errores !== []) {\n            errorJson(400, 'Revisá los datos de la propiedad.', $errores);\n        }\n\n        if ($modelo->existeSlug($datos['slug'], $id)) {\n            errorJson(409, 'Ya hay otra propiedad con ese identificador.', ['slug' => 'Identificador repetido.']);\n        }\n\n        $modelo->actualizar($id, $datos, $datos['fotos']);\n\n        exito(200, ['propiedad' => $modelo->buscarPorId($id)]);\n    }"
  },
  "p_delete": {
   "archivo": "api/propiedades.php",
   "desde": 237,
   "hasta": 258,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /* ============================== DELETE ============================= */\n    if ($metodo === 'DELETE') {\n        exigirRol('agente');\n\n        $id = idDeLaUrl();\n        if ($id === null) {\n            errorJson(400, 'Falta el id de la propiedad a eliminar.');\n        }\n\n        if (!$modelo->eliminar($id)) {\n            errorJson(404, 'No encontramos esa propiedad.');\n        }\n\n        exito(200, ['mensaje' => 'Propiedad eliminada.', 'id' => $id]);\n    }\n} catch (PDOException $error) {\n    // La excepción se registra completa en el log del servidor, pero al cliente\n    // sólo le llega un mensaje genérico: nunca la consulta ni el nombre de la\n    // tabla que falló (OWASP A09, exposición de información sensible).\n    registrarFalla('propiedades/' . $metodo, $error);\n    errorJson(500, 'Hubo un problema con la base de datos. Intentá de nuevo.');\n}"
  },
  "s_post": {
   "archivo": "api/solicitudes.php",
   "desde": 44,
   "hasta": 114,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /* =============================== POST ============================== */\n    if ($metodo === 'POST') {\n        $usuario = exigirSesion();\n        $datos   = leerCuerpoJson();\n\n        $errores = [];\n\n        $nombre = campoTexto($datos, 'nombre');\n        if (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 100) {\n            $errores['nombre'] = 'Escribí tu nombre y apellido.';\n        }\n\n        $telefono = campoTexto($datos, 'telefono');\n        if (!preg_match('/^[0-9+()\\s-]{8,40}$/', $telefono)) {\n            $errores['telefono'] = 'Ingresá un teléfono válido (entre 8 y 40 caracteres).';\n        }\n\n        $direccion = campoTexto($datos, 'direccion');\n        if (mb_strlen($direccion) < 5 || mb_strlen($direccion) > 200) {\n            $errores['direccion'] = 'Indicá calle, número y barrio.';\n        }\n\n        $email = campoTexto($datos, 'email');\n        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {\n            $errores['email'] = 'Ingresá un e-mail válido.';\n        }\n\n        $medioPago = campoTexto($datos, 'medio_pago');\n        if (!in_array($medioPago, MEDIOS_PAGO, true)) {\n            $errores['medio_pago'] = 'Elegí un medio de pago de la lista.';\n        }\n\n        // El formulario de la AE1 permite marcar una o más propiedades.\n        $propiedades = [];\n        if (isset($datos['propiedades']) && is_array($datos['propiedades'])) {\n            foreach ($datos['propiedades'] as $valor) {\n                $id = filter_var($valor, FILTER_VALIDATE_INT);\n                if ($id !== false && $id > 0) {\n                    $propiedades[] = $id;\n                }\n            }\n            $propiedades = array_values(array_unique($propiedades));\n        }\n\n        if ($propiedades === []) {\n            $errores['propiedades'] = 'Elegí al menos una propiedad.';\n        } elseif (!(new PropiedadModel())->idsValidos($propiedades)) {\n            $errores['propiedades'] = 'Alguna de las propiedades elegidas ya no está publicada.';\n        }\n\n        $mensaje = campoTexto($datos, 'mensaje');\n\n        if ($errores !== []) {\n            errorJson(400, 'Revisá los datos del formulario.', $errores);\n        }\n\n        $id = $modelo->crear([\n            'usuario_id' => (int) $usuario['id'],\n            'nombre'     => $nombre,\n            'telefono'   => $telefono,\n            'direccion'  => $direccion,\n            'email'      => $email,\n            'medio_pago' => $medioPago,\n            'mensaje'    => $mensaje === '' ? null : $mensaje,\n        ], $propiedades);\n\n        exito(201, [\n            'solicitud_id' => $id,\n            'mensaje'      => 'Recibimos tu solicitud. Nos vamos a contactar a la brevedad.',\n        ]);\n    }"
  },
  "s_patch": {
   "archivo": "api/solicitudes.php",
   "desde": 116,
   "hasta": 139,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /* ============================== PATCH ============================== */\n    if ($metodo === 'PATCH') {\n        exigirRol('agente');\n\n        $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);\n        if ($id === false || $id < 1) {\n            errorJson(400, 'Falta el id de la solicitud.');\n        }\n\n        $estado = campoTexto(leerCuerpoJson(), 'estado');\n        if (!in_array($estado, ESTADOS, true)) {\n            errorJson(400, 'El estado debe ser pendiente, contactada o cerrada.');\n        }\n\n        if (!$modelo->cambiarEstado($id, $estado)) {\n            errorJson(404, 'No encontramos esa solicitud.');\n        }\n\n        exito(200, ['mensaje' => 'Estado actualizado.', 'id' => $id, 'estado' => $estado]);\n    }\n} catch (PDOException $error) {\n    registrarFalla('solicitudes/' . $metodo, $error);\n    errorJson(500, 'No pudimos registrar la solicitud. Intentá de nuevo.');\n}"
  },
  "m_listar": {
   "archivo": "models/PropiedadModel.php",
   "desde": 20,
   "hasta": 30,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /** Columnas que se devuelven siempre, más las de la foto por el LEFT JOIN. */\n    private const COLUMNAS = '\n        p.id, p.slug, p.titulo, p.tipo, p.barrio, p.precio, p.superficie,\n        p.ambientes, p.descripcion, p.destacada, p.activa,\n        f.id AS foto_id, f.ruta AS foto_ruta, f.texto_alt AS foto_alt, f.orden AS foto_orden';\n\n    private const LISTAR_ACTIVAS = 'SELECT ' . self::COLUMNAS . '\n          FROM propiedades p\n          LEFT JOIN fotos f ON f.propiedad_id = p.id\n         WHERE p.activa = 1\n         ORDER BY p.destacada DESC, p.id ASC, f.orden ASC';"
  },
  "m_buscar": {
   "archivo": "models/PropiedadModel.php",
   "desde": 79,
   "hasta": 88,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /** Ficha completa de una propiedad con todas sus fotos. */\n    public function buscarPorId(int $id): ?array\n    {\n        $sentencia = $this->db->prepare(self::BUSCAR_POR_ID);\n        $sentencia->execute([':id' => $id]);\n\n        $propiedades = $this->agruparFotos($sentencia->fetchAll());\n\n        return $propiedades === [] ? null : $propiedades[0];\n    }"
  },
  "m_crear": {
   "archivo": "models/PropiedadModel.php",
   "desde": 125,
   "hasta": 166,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /**\n     * Alta de propiedad (UC9). Inserta la propiedad y sus fotos dentro de una\n     * transacción: si falla una foto, no queda una propiedad a medio cargar.\n     */\n    public function crear(array $datos, array $fotos): int\n    {\n        try {\n            $this->db->beginTransaction();\n\n            $sentencia = $this->db->prepare(\n                'INSERT INTO propiedades\n                    (slug, titulo, tipo, barrio, precio, superficie, ambientes, descripcion, destacada, activa)\n                 VALUES\n                    (:slug, :titulo, :tipo, :barrio, :precio, :superficie, :ambientes, :descripcion, :destacada, :activa)'\n            );\n            $sentencia->execute([\n                ':slug'        => $datos['slug'],\n                ':titulo'      => $datos['titulo'],\n                ':tipo'        => $datos['tipo'],\n                ':barrio'      => $datos['barrio'],\n                ':precio'      => $datos['precio'],\n                ':superficie'  => $datos['superficie'],\n                ':ambientes'   => $datos['ambientes'],\n                ':descripcion' => $datos['descripcion'],\n                ':destacada'   => $datos['destacada'] ? 1 : 0,\n                ':activa'      => $datos['activa'] ? 1 : 0,\n            ]);\n\n            $id = (int) $this->db->lastInsertId();\n            $this->insertarFotos($id, $fotos);\n\n            $this->db->commit();\n\n            return $id;\n        } catch (PDOException $error) {\n            // Si algo falló, se deshace todo lo de esta transacción.\n            if ($this->db->inTransaction()) {\n                $this->db->rollBack();\n            }\n            throw $error;\n        }\n    }"
  },
  "m_eliminar": {
   "archivo": "models/PropiedadModel.php",
   "desde": 228,
   "hasta": 234,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    public function eliminar(int $id): bool\n    {\n        $sentencia = $this->db->prepare('DELETE FROM propiedades WHERE id = :id');\n        $sentencia->execute([':id' => $id]);\n\n        return $sentencia->rowCount() > 0;\n    }"
  },
  "m_fav_add": {
   "archivo": "models/FavoritoModel.php",
   "desde": 66,
   "hasta": 83,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /**\n     * Marca una propiedad como favorita.\n     * INSERT IGNORE apoyado en la clave UNIQUE (usuario_id, propiedad_id):\n     * si ya estaba marcada, MySQL descarta el insert sin lanzar error.\n     */\n    public function agregar(int $usuarioId, int $propiedadId): bool\n    {\n        $sentencia = $this->db->prepare(\n            'INSERT IGNORE INTO favoritos (usuario_id, propiedad_id)\n             VALUES (:usuario_id, :propiedad_id)'\n        );\n        $sentencia->execute([\n            ':usuario_id'   => $usuarioId,\n            ':propiedad_id' => $propiedadId,\n        ]);\n\n        return $sentencia->rowCount() > 0;\n    }"
  },
  "m_sol_crear": {
   "archivo": "models/SolicitudModel.php",
   "desde": 24,
   "hasta": 78,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /**\n     * Alta de la solicitud y de las propiedades elegidas.\n     *\n     * Va en una transacción porque son dos tablas: si falla el renglón de una\n     * propiedad, no puede quedar una solicitud huérfana sin propiedades.\n     * ISO/IEC 25010 — Fiabilidad (madurez y recuperabilidad).\n     *\n     * @param array $datos        Campos del formulario ya validados.\n     * @param int[] $propiedadIds Propiedades que marcó el cliente.\n     */\n    public function crear(array $datos, array $propiedadIds): int\n    {\n        try {\n            $this->db->beginTransaction();\n\n            $sentencia = $this->db->prepare(\n                'INSERT INTO solicitudes\n                    (usuario_id, nombre, telefono, direccion, email, medio_pago, mensaje)\n                 VALUES\n                    (:usuario_id, :nombre, :telefono, :direccion, :email, :medio_pago, :mensaje)'\n            );\n            $sentencia->execute([\n                ':usuario_id' => $datos['usuario_id'],\n                ':nombre'     => $datos['nombre'],\n                ':telefono'   => $datos['telefono'],\n                ':direccion'  => $datos['direccion'],\n                ':email'      => $datos['email'],\n                ':medio_pago' => $datos['medio_pago'],\n                ':mensaje'    => $datos['mensaje'],\n            ]);\n\n            $solicitudId = (int) $this->db->lastInsertId();\n\n            $renglon = $this->db->prepare(\n                'INSERT INTO solicitud_propiedad (solicitud_id, propiedad_id)\n                 VALUES (:solicitud_id, :propiedad_id)'\n            );\n\n            foreach ($propiedadIds as $propiedadId) {\n                $renglon->execute([\n                    ':solicitud_id' => $solicitudId,\n                    ':propiedad_id' => (int) $propiedadId,\n                ]);\n            }\n\n            $this->db->commit();\n\n            return $solicitudId;\n        } catch (PDOException $error) {\n            if ($this->db->inTransaction()) {\n                $this->db->rollBack();\n            }\n            throw $error;\n        }\n    }"
  },
  "m_sol_estado": {
   "archivo": "models/SolicitudModel.php",
   "desde": 115,
   "hasta": 124,
   "lenguaje": "php",
   "autor": "Santino Roa",
   "codigo": "    /** Cambia el estado de seguimiento de una solicitud (pendiente, contactada, cerrada). */\n    public function cambiarEstado(int $id, string $estado): bool\n    {\n        $sentencia = $this->db->prepare(\n            'UPDATE solicitudes SET estado = :estado WHERE id = :id'\n        );\n        $sentencia->execute([':estado' => $estado, ':id' => $id]);\n\n        return $sentencia->rowCount() > 0;\n    }"
  },
  "m_usr_buscar": {
   "archivo": "models/UsuarioModel.php",
   "desde": 23,
   "hasta": 44,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "    /**\n     * Busca un usuario por e-mail, incluyendo el hash de la contraseña.\n     * Lo usa login.php para pasárselo a password_verify().\n     *\n     * El e-mail viaja como parámetro :email, nunca pegado a la cadena SQL.\n     * Si alguien escribe  ' OR 1=1 --  en el formulario, MySQL lo busca como\n     * texto literal y no encuentra a nadie (OWASP A03).\n     */\n    public function buscarPorEmail(string $email): ?array\n    {\n        $sentencia = $this->db->prepare(\n            'SELECT id, nombre, email, password, rol\n               FROM usuarios\n              WHERE email = :email\n              LIMIT 1'\n        );\n        $sentencia->execute([':email' => $email]);\n\n        $fila = $sentencia->fetch();\n\n        return $fila === false ? null : $fila;\n    }"
  },
  "m_usr_crear": {
   "archivo": "models/UsuarioModel.php",
   "desde": 73,
   "hasta": 92,
   "lenguaje": "php",
   "autor": "Santino Calamari",
   "codigo": "    /**\n     * Inserta un usuario nuevo y devuelve su id.\n     * Recibe el hash ya calculado: el modelo guarda, el controlador hashea.\n     */\n    public function crear(string $nombre, string $email, string $hash, string $rol = 'cliente'): int\n    {\n        $sentencia = $this->db->prepare(\n            'INSERT INTO usuarios (nombre, email, password, rol)\n             VALUES (:nombre, :email, :password, :rol)'\n        );\n        $sentencia->execute([\n            ':nombre'   => $nombre,\n            ':email'    => $email,\n            ':password' => $hash,\n            ':rol'      => $rol,\n        ]);\n\n        return (int) $this->db->lastInsertId();\n    }\n}"
  },
  "t_usuarios": {
   "archivo": "database/rn_inmobiliaria.sql",
   "desde": 32,
   "hasta": 41,
   "lenguaje": "sql",
   "autor": "Santino Roa",
   "codigo": "CREATE TABLE usuarios (\n  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,\n  nombre     VARCHAR(100) NOT NULL,\n  email      VARCHAR(150) NOT NULL,\n  password   VARCHAR(255) NOT NULL COMMENT 'Hash BCRYPT generado con password_hash()',\n  rol        ENUM('cliente','agente') NOT NULL DEFAULT 'cliente',\n  creado_en  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (id),\n  UNIQUE KEY uq_usuarios_email (email)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
  },
  "t_propiedades": {
   "archivo": "database/rn_inmobiliaria.sql",
   "desde": 46,
   "hasta": 64,
   "lenguaje": "sql",
   "autor": "Santino Roa",
   "codigo": "CREATE TABLE propiedades (\n  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,\n  slug          VARCHAR(80)  NOT NULL COMMENT 'Identificador legible heredado de la maqueta AE1',\n  titulo        VARCHAR(150) NOT NULL,\n  tipo          ENUM('casa','terreno','departamento','local') NOT NULL,\n  barrio        VARCHAR(120) NOT NULL,\n  precio        DECIMAL(12,2) UNSIGNED NOT NULL COMMENT 'Precio en dólares',\n  superficie    SMALLINT UNSIGNED NOT NULL COMMENT 'Metros cuadrados',\n  ambientes     TINYINT UNSIGNED NULL COMMENT 'NULL en terrenos baldíos',\n  descripcion   TEXT NULL,\n  destacada     BOOLEAN NOT NULL DEFAULT FALSE,\n  activa        BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Baja lógica: la ficha deja de publicarse',\n  creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  PRIMARY KEY (id),\n  UNIQUE KEY uq_propiedades_slug (slug),\n  KEY idx_propiedades_tipo (tipo),\n  KEY idx_propiedades_destacada (destacada)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
  },
  "t_fotos": {
   "archivo": "database/rn_inmobiliaria.sql",
   "desde": 69,
   "hasta": 79,
   "lenguaje": "sql",
   "autor": "Santino Roa",
   "codigo": "CREATE TABLE fotos (\n  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,\n  propiedad_id  INT UNSIGNED NOT NULL,\n  ruta          VARCHAR(200) NOT NULL,\n  texto_alt     VARCHAR(200) NOT NULL COMMENT 'WCAG 2.1 — criterio 1.1.1 Contenido no textual',\n  orden         TINYINT UNSIGNED NOT NULL DEFAULT 1,\n  PRIMARY KEY (id),\n  KEY idx_fotos_propiedad (propiedad_id),\n  CONSTRAINT fk_fotos_propiedad FOREIGN KEY (propiedad_id)\n    REFERENCES propiedades (id) ON DELETE CASCADE ON UPDATE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
  },
  "t_favoritos": {
   "archivo": "database/rn_inmobiliaria.sql",
   "desde": 84,
   "hasta": 95,
   "lenguaje": "sql",
   "autor": "Santino Roa",
   "codigo": "CREATE TABLE favoritos (\n  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,\n  usuario_id    INT UNSIGNED NOT NULL,\n  propiedad_id  INT UNSIGNED NOT NULL,\n  creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (id),\n  UNIQUE KEY uq_favorito (usuario_id, propiedad_id),\n  CONSTRAINT fk_favoritos_usuario FOREIGN KEY (usuario_id)\n    REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE,\n  CONSTRAINT fk_favoritos_propiedad FOREIGN KEY (propiedad_id)\n    REFERENCES propiedades (id) ON DELETE CASCADE ON UPDATE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
  },
  "t_solicitudes": {
   "archivo": "database/rn_inmobiliaria.sql",
   "desde": 101,
   "hasta": 117,
   "lenguaje": "sql",
   "autor": "Santino Roa",
   "codigo": "CREATE TABLE solicitudes (\n  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,\n  usuario_id  INT UNSIGNED NULL COMMENT 'NULL si el usuario se dio de baja',\n  nombre      VARCHAR(100) NOT NULL,\n  telefono    VARCHAR(40)  NOT NULL,\n  direccion   VARCHAR(200) NOT NULL,\n  email       VARCHAR(150) NOT NULL,\n  medio_pago  ENUM('efectivo','transferencia','financiacion','credito-hipotecario','tarjeta') NOT NULL,\n  mensaje     TEXT NULL,\n  estado      ENUM('pendiente','contactada','cerrada') NOT NULL DEFAULT 'pendiente',\n  creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  PRIMARY KEY (id),\n  KEY idx_solicitudes_usuario (usuario_id),\n  KEY idx_solicitudes_estado (estado),\n  CONSTRAINT fk_solicitudes_usuario FOREIGN KEY (usuario_id)\n    REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
  },
  "t_solicitud_propiedad": {
   "archivo": "database/rn_inmobiliaria.sql",
   "desde": 122,
   "hasta": 131,
   "lenguaje": "sql",
   "autor": "Santino Roa",
   "codigo": "CREATE TABLE solicitud_propiedad (\n  solicitud_id  INT UNSIGNED NOT NULL,\n  propiedad_id  INT UNSIGNED NOT NULL,\n  PRIMARY KEY (solicitud_id, propiedad_id),\n  KEY idx_sp_propiedad (propiedad_id),\n  CONSTRAINT fk_sp_solicitud FOREIGN KEY (solicitud_id)\n    REFERENCES solicitudes (id) ON DELETE CASCADE ON UPDATE CASCADE,\n  CONSTRAINT fk_sp_propiedad FOREIGN KEY (propiedad_id)\n    REFERENCES propiedades (id) ON DELETE CASCADE ON UPDATE CASCADE\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
  },
  "x_foco": {
   "archivo": "public/css/estilos.css",
   "desde": 97,
   "hasta": 109,
   "lenguaje": "css",
   "autor": "Jesus De Olivera",
   "codigo": "a:focus-visible,\nbutton:focus-visible,\ninput:focus-visible,\nselect:focus-visible,\ntextarea:focus-visible {\n  outline: 3px solid var(--color-ocre);\n  outline-offset: 2px;\n}\n\n/* Respeta la preferencia de reducir animaciones */\n@media (prefers-reduced-motion: reduce) {\n  * { transition: none !important; }\n}"
  },
  "x_lectores": {
   "archivo": "public/css/estilos.css",
   "desde": 1624,
   "hasta": 1635,
   "lenguaje": "css",
   "autor": "Jesus De Olivera",
   "codigo": ".solo-lectores {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0 0 0 0);\n  clip-path: inset(50%);\n  white-space: nowrap;\n  border: 0;\n}"
  },
  "x_movimiento": {
   "archivo": "public/css/estilos.css",
   "desde": 107,
   "hasta": 109,
   "lenguaje": "css",
   "autor": "Jesus De Olivera",
   "codigo": "@media (prefers-reduced-motion: reduce) {\n  * { transition: none !important; }\n}"
  }
 },
 "pruebas": {
  "api": {
   "casos": [
    {
     "n": 1,
     "ok": true,
     "titulo": "GET catálogo completo",
     "seccion": "1. CATÁLOGO PÚBLICO (UC1, UC2, UC3)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 2,
     "ok": true,
     "titulo": "GET catálogo filtrado por tipo casa",
     "seccion": "1. CATÁLOGO PÚBLICO (UC1, UC2, UC3)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 3,
     "ok": true,
     "titulo": "GET tipo inexistente -> 400",
     "seccion": "1. CATÁLOGO PÚBLICO (UC1, UC2, UC3)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 4,
     "ok": true,
     "titulo": "GET ficha de la propiedad 1",
     "seccion": "1. CATÁLOGO PÚBLICO (UC1, UC2, UC3)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 5,
     "ok": true,
     "titulo": "GET ficha inexistente -> 404",
     "seccion": "1. CATÁLOGO PÚBLICO (UC1, UC2, UC3)",
     "detalle": "esperado 404 / obtenido 404"
    },
    {
     "n": 6,
     "ok": true,
     "titulo": "GET id no numérico -> 400",
     "seccion": "1. CATÁLOGO PÚBLICO (UC1, UC2, UC3)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 7,
     "ok": true,
     "titulo": "GET sesión sin login (autenticado:false)",
     "seccion": "2. CONTROL DE ACCESO ANÓNIMO (OWASP A01)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 8,
     "ok": true,
     "titulo": "GET favoritos sin sesión -> 401",
     "seccion": "2. CONTROL DE ACCESO ANÓNIMO (OWASP A01)",
     "detalle": "esperado 401 / obtenido 401"
    },
    {
     "n": 9,
     "ok": true,
     "titulo": "POST solicitud sin sesión -> 401",
     "seccion": "2. CONTROL DE ACCESO ANÓNIMO (OWASP A01)",
     "detalle": "esperado 401 / obtenido 401"
    },
    {
     "n": 10,
     "ok": true,
     "titulo": "POST alta de propiedad sin sesión -> 401",
     "seccion": "2. CONTROL DE ACCESO ANÓNIMO (OWASP A01)",
     "detalle": "esperado 401 / obtenido 401"
    },
    {
     "n": 11,
     "ok": true,
     "titulo": "DELETE propiedad sin sesión -> 401",
     "seccion": "2. CONTROL DE ACCESO ANÓNIMO (OWASP A01)",
     "detalle": "esperado 401 / obtenido 401"
    },
    {
     "n": 12,
     "ok": true,
     "titulo": "GET listado del panel sin sesión -> 401",
     "seccion": "2. CONTROL DE ACCESO ANÓNIMO (OWASP A01)",
     "detalle": "esperado 401 / obtenido 401"
    },
    {
     "n": 13,
     "ok": true,
     "titulo": "POST login con contraseña incorrecta -> 401",
     "seccion": "3. AUTENTICACIÓN (UC7, OWASP A02 / A07)",
     "detalle": "esperado 401 / obtenido 401"
    },
    {
     "n": 14,
     "ok": true,
     "titulo": "POST login con e-mail inexistente -> 401",
     "seccion": "3. AUTENTICACIÓN (UC7, OWASP A02 / A07)",
     "detalle": "esperado 401 / obtenido 401"
    },
    {
     "n": 15,
     "ok": true,
     "titulo": "POST login sin datos -> 400",
     "seccion": "3. AUTENTICACIÓN (UC7, OWASP A02 / A07)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 16,
     "ok": true,
     "titulo": "POST login con JSON roto -> 400",
     "seccion": "3. AUTENTICACIÓN (UC7, OWASP A02 / A07)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 17,
     "ok": true,
     "titulo": "Login con \"' OR '1'='1\" en el e-mail -> 401",
     "seccion": "4. INTENTO DE INYECCIÓN SQL (OWASP A03)",
     "detalle": "esperado 401 / obtenido 401"
    },
    {
     "n": 18,
     "ok": true,
     "titulo": "Login con comentario SQL -> 401",
     "seccion": "4. INTENTO DE INYECCIÓN SQL (OWASP A03)",
     "detalle": "esperado 401 / obtenido 401"
    },
    {
     "n": 19,
     "ok": true,
     "titulo": "Ficha con DROP TABLE en el id -> 400",
     "seccion": "4. INTENTO DE INYECCIÓN SQL (OWASP A03)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 20,
     "ok": true,
     "titulo": "POST login correcto de Ana (cliente)",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 21,
     "ok": true,
     "titulo": "GET sesión con cookie de Ana",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 22,
     "ok": true,
     "titulo": "GET favoritos de Ana",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 23,
     "ok": true,
     "titulo": "POST favorito propiedad 3",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 201 / obtenido 201"
    },
    {
     "n": 24,
     "ok": true,
     "titulo": "POST el mismo favorito otra vez -> 200",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 25,
     "ok": true,
     "titulo": "POST favorito de propiedad inexistente -> 404",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 404 / obtenido 404"
    },
    {
     "n": 26,
     "ok": true,
     "titulo": "DELETE favorito propiedad 3",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 27,
     "ok": true,
     "titulo": "DELETE favorito que no estaba -> 404",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 404 / obtenido 404"
    },
    {
     "n": 28,
     "ok": true,
     "titulo": "POST solicitud de compra válida",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 201 / obtenido 201"
    },
    {
     "n": 29,
     "ok": true,
     "titulo": "POST solicitud sin propiedades -> 400",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 30,
     "ok": true,
     "titulo": "POST solicitud con medio de pago inválido -> 400",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 31,
     "ok": true,
     "titulo": "GET solicitudes propias de Ana",
     "seccion": "5. SESIÓN DEL CLIENTE (UC7, UC8, UC4)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 32,
     "ok": true,
     "titulo": "POST alta de propiedad como cliente -> 403",
     "seccion": "6. CLIENTE INTENTANDO HACER DE AGENTE (403)",
     "detalle": "esperado 403 / obtenido 403"
    },
    {
     "n": 33,
     "ok": true,
     "titulo": "DELETE propiedad como cliente -> 403",
     "seccion": "6. CLIENTE INTENTANDO HACER DE AGENTE (403)",
     "detalle": "esperado 403 / obtenido 403"
    },
    {
     "n": 34,
     "ok": true,
     "titulo": "GET todas las solicitudes como cliente -> 403",
     "seccion": "6. CLIENTE INTENTANDO HACER DE AGENTE (403)",
     "detalle": "esperado 403 / obtenido 403"
    },
    {
     "n": 35,
     "ok": true,
     "titulo": "POST login de Rodrigo (agente)",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 36,
     "ok": true,
     "titulo": "GET listado del panel con las dadas de baja",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 37,
     "ok": true,
     "titulo": "POST alta de propiedad nueva",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 201 / obtenido 201"
    },
    {
     "n": 38,
     "ok": true,
     "titulo": "POST alta con datos inválidos -> 400",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 39,
     "ok": true,
     "titulo": "POST alta con slug repetido -> 409",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 409 / obtenido 409"
    },
    {
     "n": 40,
     "ok": true,
     "titulo": "PUT modificación de la propiedad 4",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 41,
     "ok": true,
     "titulo": "PUT sobre un id inexistente -> 404",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 404 / obtenido 404"
    },
    {
     "n": 42,
     "ok": true,
     "titulo": "GET todas las solicitudes como agente",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 43,
     "ok": true,
     "titulo": "PATCH estado de la solicitud 1",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 44,
     "ok": true,
     "titulo": "PATCH con un estado inválido -> 400",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 45,
     "ok": true,
     "titulo": "DELETE de la propiedad 4",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 46,
     "ok": true,
     "titulo": "DELETE de la misma propiedad -> 404",
     "seccion": "7. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado 404 / obtenido 404"
    },
    {
     "n": 47,
     "ok": true,
     "titulo": "POST registro con e-mail repetido -> 409",
     "seccion": "8. REGISTRO (UC6)",
     "detalle": "esperado 409 / obtenido 409"
    },
    {
     "n": 48,
     "ok": true,
     "titulo": "POST registro con contraseñas distintas -> 400",
     "seccion": "8. REGISTRO (UC6)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 49,
     "ok": true,
     "titulo": "POST registro con e-mail inválido -> 400",
     "seccion": "8. REGISTRO (UC6)",
     "detalle": "esperado 400 / obtenido 400"
    },
    {
     "n": 50,
     "ok": true,
     "titulo": "POST registro válido",
     "seccion": "8. REGISTRO (UC6)",
     "detalle": "esperado 201 / obtenido 201"
    },
    {
     "n": 51,
     "ok": true,
     "titulo": "POST logout de Ana",
     "seccion": "9. CIERRE DE SESIÓN",
     "detalle": "esperado 200 / obtenido 200"
    },
    {
     "n": 52,
     "ok": true,
     "titulo": "GET favoritos después del logout -> 401",
     "seccion": "9. CIERRE DE SESIÓN",
     "detalle": "esperado 401 / obtenido 401"
    },
    {
     "n": 53,
     "ok": true,
     "titulo": "GET con método no permitido -> 405",
     "seccion": "9. CIERRE DE SESIÓN",
     "detalle": "esperado 405 / obtenido 405"
    }
   ],
   "ok": 53,
   "total": 53,
   "resumen": "FIN DE LAS PRUEBAS — 53 casos"
  },
  "spa": {
   "casos": [
    {
     "n": 1,
     "ok": true,
     "titulo": "La portada es la vista visible al entrar",
     "seccion": "1. PORTADA Y CARGA ASÍNCRONA (UC1)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 2,
     "ok": true,
     "titulo": "Las tarjetas se generaron desde la API (no estaban en el HTML)",
     "seccion": "1. PORTADA Y CARGA ASÍNCRONA (UC1)",
     "detalle": "esperado: 3  |  obtenido: 3"
    },
    {
     "n": 3,
     "ok": true,
     "titulo": "La región aria-live informa el resultado del fetch",
     "seccion": "1. PORTADA Y CARGA ASÍNCRONA (UC1)",
     "detalle": "esperado: Mostrando 3 de 3 propiedades.  |  obtenido: Mostrando 3 de 3 propiedades."
    },
    {
     "n": 4,
     "ok": true,
     "titulo": "El contenedor de respuesta tiene aria-live=\"polite\"",
     "seccion": "1. PORTADA Y CARGA ASÍNCRONA (UC1)",
     "detalle": "esperado: polite  |  obtenido: polite"
    },
    {
     "n": 5,
     "ok": true,
     "titulo": "El primer Tab llega al enlace \"Saltar al contenido\"",
     "seccion": "2. OPERACIÓN POR TECLADO",
     "detalle": "esperado: 1  |  obtenido: 1"
    },
    {
     "n": 6,
     "ok": true,
     "titulo": "El enlace de salto se vuelve visible al recibir el foco",
     "seccion": "2. OPERACIÓN POR TECLADO",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 7,
     "ok": true,
     "titulo": "Se llega al enlace \"Ingresar\" solo con Tab",
     "seccion": "2. OPERACIÓN POR TECLADO",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 8,
     "ok": true,
     "titulo": "El elemento con foco muestra el anillo de :focus-visible",
     "seccion": "2. OPERACIÓN POR TECLADO",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 9,
     "ok": true,
     "titulo": "Enter sobre \"Ingresar\" cambia a la vista de acceso",
     "seccion": "3. INGRESO DE UN CLIENTE CON TAB Y ENTER (UC7)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 10,
     "ok": true,
     "titulo": "El foco quedó en el título de la vista nueva",
     "seccion": "3. INGRESO DE UN CLIENTE CON TAB Y ENTER (UC7)",
     "detalle": "esperado: titulo-acceso  |  obtenido: titulo-acceso"
    },
    {
     "n": 11,
     "ok": true,
     "titulo": "El cambio de vista se anunció en la región aria-live",
     "seccion": "3. INGRESO DE UN CLIENTE CON TAB Y ENTER (UC7)",
     "detalle": "esperado: Sección: Tu cuenta  |  obtenido: Sección: Tu cuenta"
    },
    {
     "n": 12,
     "ok": true,
     "titulo": "Se llega al botón \"Ingresar\" del formulario con Tab",
     "seccion": "3. INGRESO DE UN CLIENTE CON TAB Y ENTER (UC7)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 13,
     "ok": true,
     "titulo": "El servidor aceptó las credenciales y la alerta avisa el éxito",
     "seccion": "3. INGRESO DE UN CLIENTE CON TAB Y ENTER (UC7)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 14,
     "ok": true,
     "titulo": "VSDM: la audiencia pasó a usuario autenticado",
     "seccion": "3. INGRESO DE UN CLIENTE CON TAB Y ENTER (UC7)",
     "detalle": "esperado: usuario  |  obtenido: usuario"
    },
    {
     "n": 15,
     "ok": true,
     "titulo": "VSDM: el menú ya no ofrece \"Ingresar\"",
     "seccion": "3. INGRESO DE UN CLIENTE CON TAB Y ENTER (UC7)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 16,
     "ok": true,
     "titulo": "VSDM: el menú saluda al usuario con su nombre",
     "seccion": "3. INGRESO DE UN CLIENTE CON TAB Y ENTER (UC7)",
     "detalle": "esperado: Ana  |  obtenido: Ana"
    },
    {
     "n": 17,
     "ok": true,
     "titulo": "VSDM: el panel del agente no se ofrece a un cliente",
     "seccion": "3. INGRESO DE UN CLIENTE CON TAB Y ENTER (UC7)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 18,
     "ok": true,
     "titulo": "El catálogo muestra las propiedades publicadas",
     "seccion": "4. CATÁLOGO, FILTRO Y FICHA (UC2, UC3)",
     "detalle": "esperado: 3  |  obtenido: 3"
    },
    {
     "n": 19,
     "ok": true,
     "titulo": "El filtro \"Casas\" pide al servidor y devuelve 2 propiedades",
     "seccion": "4. CATÁLOGO, FILTRO Y FICHA (UC2, UC3)",
     "detalle": "esperado: 2  |  obtenido: 2"
    },
    {
     "n": 20,
     "ok": true,
     "titulo": "El chip activo informa su estado con aria-pressed",
     "seccion": "4. CATÁLOGO, FILTRO Y FICHA (UC2, UC3)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 21,
     "ok": true,
     "titulo": "La ficha muestra el título que vino de la base",
     "seccion": "4. CATÁLOGO, FILTRO Y FICHA (UC2, UC3)",
     "detalle": "esperado: Casa 3 ambientes con pileta en Villa Sarita  |  obtenido: Casa 3 ambientes con pileta en Villa Sarita"
    },
    {
     "n": 22,
     "ok": true,
     "titulo": "La ficha carga las 6 fotos de la propiedad",
     "seccion": "4. CATÁLOGO, FILTRO Y FICHA (UC2, UC3)",
     "detalle": "esperado: 6  |  obtenido: 6"
    },
    {
     "n": 23,
     "ok": true,
     "titulo": "Toda foto tiene texto alternativo (WCAG 1.1.1)",
     "seccion": "4. CATÁLOGO, FILTRO Y FICHA (UC2, UC3)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 24,
     "ok": true,
     "titulo": "La ficha ofrece el contacto por WhatsApp (UC5)",
     "seccion": "4. CATÁLOGO, FILTRO Y FICHA (UC2, UC3)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 25,
     "ok": true,
     "titulo": "La propiedad 1 ya venía marcada, el clic la desmarca",
     "seccion": "5. FAVORITOS CONTRA LA BASE DE DATOS (UC8)",
     "detalle": "esperado: false  |  obtenido: false"
    },
    {
     "n": 26,
     "ok": true,
     "titulo": "Un segundo clic la vuelve a guardar en el servidor",
     "seccion": "5. FAVORITOS CONTRA LA BASE DE DATOS (UC8)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 27,
     "ok": true,
     "titulo": "La vista de favoritos trae la propiedad guardada",
     "seccion": "5. FAVORITOS CONTRA LA BASE DE DATOS (UC8)",
     "detalle": "esperado: 1  |  obtenido: 1"
    },
    {
     "n": 28,
     "ok": true,
     "titulo": "El formulario precarga el nombre de la cuenta",
     "seccion": "6. SOLICITUD DE COMPRA (UC4)",
     "detalle": "esperado: Ana Benítez  |  obtenido: Ana Benítez"
    },
    {
     "n": 29,
     "ok": true,
     "titulo": "El formulario precarga el e-mail de la cuenta",
     "seccion": "6. SOLICITUD DE COMPRA (UC4)",
     "detalle": "esperado: ana@rninmobiliaria.com  |  obtenido: ana@rninmobiliaria.com"
    },
    {
     "n": 30,
     "ok": true,
     "titulo": "Las casillas de propiedades se generaron desde la API",
     "seccion": "6. SOLICITUD DE COMPRA (UC4)",
     "detalle": "esperado: 3  |  obtenido: 3"
    },
    {
     "n": 31,
     "ok": true,
     "titulo": "El servidor registró la solicitud y lo informa en pantalla",
     "seccion": "6. SOLICITUD DE COMPRA (UC4)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 32,
     "ok": true,
     "titulo": "El envío sin propiedades marcadas se rechaza con mensaje propio",
     "seccion": "6. SOLICITUD DE COMPRA (UC4)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 33,
     "ok": true,
     "titulo": "El cliente ve el aviso de acceso restringido, no el panel",
     "seccion": "7. CONTROL DE ACCESO: UN CLIENTE NO ES AGENTE",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 34,
     "ok": true,
     "titulo": "Aunque fuerce la petición, el servidor responde 403",
     "seccion": "7. CONTROL DE ACCESO: UN CLIENTE NO ES AGENTE",
     "detalle": "esperado: 403  |  obtenido: 403"
    },
    {
     "n": 35,
     "ok": true,
     "titulo": "Al cerrar sesión la audiencia vuelve a visitante",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: visitante  |  obtenido: visitante"
    },
    {
     "n": 36,
     "ok": true,
     "titulo": "El ingreso del agente cambia la audiencia a agente",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: agente  |  obtenido: agente"
    },
    {
     "n": 37,
     "ok": true,
     "titulo": "El panel lista las propiedades, incluidas las dadas de baja",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: 3  |  obtenido: 3"
    },
    {
     "n": 38,
     "ok": true,
     "titulo": "El panel lista las solicitudes recibidas",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 39,
     "ok": true,
     "titulo": "El alta de propiedad quedó registrada (ahora hay 4 filas)",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: 4  |  obtenido: 4"
    },
    {
     "n": 40,
     "ok": true,
     "titulo": "El formulario volvió al estado de alta después de guardar",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: Crear propiedad  |  obtenido: Crear propiedad"
    },
    {
     "n": 41,
     "ok": true,
     "titulo": "\"Editar\" carga la propiedad en el formulario",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: Local comercial sobre avenida Mitre  |  obtenido: Local comercial sobre avenida Mitre"
    },
    {
     "n": 42,
     "ok": true,
     "titulo": "El botón de envío cambia a modo edición",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: Guardar cambios  |  obtenido: Guardar cambios"
    },
    {
     "n": 43,
     "ok": true,
     "titulo": "La modificación se guardó con el precio nuevo",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 44,
     "ok": true,
     "titulo": "El servidor rechaza datos inválidos y los marca campo por campo",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 45,
     "ok": true,
     "titulo": "La baja eliminó la propiedad (vuelven a ser 3 filas)",
     "seccion": "8. CRUD DEL AGENTE (UC9)",
     "detalle": "esperado: 3  |  obtenido: 3"
    },
    {
     "n": 46,
     "ok": true,
     "titulo": "El router muestra la vista de página no encontrada",
     "seccion": "9. RUTA INEXISTENTE",
     "detalle": "esperado: true  |  obtenido: true"
    },
    {
     "n": 47,
     "ok": true,
     "titulo": "No hubo ninguna excepción de JavaScript en toda la sesión",
     "seccion": "10. CONSOLA DEL NAVEGADOR",
     "detalle": "esperado: 0  |  obtenido: 0"
    }
   ],
   "ok": 47,
   "total": 47,
   "resumen": "RESULTADO: 47 de 47"
  }
 },
 "commits": [
  {
   "hash": "b47e2ef",
   "autor": "Santino Roa",
   "fecha": "13/11/2026",
   "titulo": "feat(db): script de creacion de la base rn_inmobiliaria"
  },
  {
   "hash": "7f7be98",
   "autor": "Santino Calamari",
   "fecha": "13/11/2026",
   "titulo": "feat(config): conexion PDO Singleton a MySQL"
  },
  {
   "hash": "6858759",
   "autor": "Santino Roa",
   "fecha": "13/11/2026",
   "titulo": "feat(config): respuestas JSON y codigos HTTP semanticos"
  },
  {
   "hash": "99bdde8",
   "autor": "Santino Calamari",
   "fecha": "13/11/2026",
   "titulo": "feat(config): sesion en el servidor y guardas de acceso"
  },
  {
   "hash": "6c87396",
   "autor": "Santino Calamari",
   "fecha": "13/11/2026",
   "titulo": "feat(models): UsuarioModel con sentencias preparadas"
  },
  {
   "hash": "dc6a212",
   "autor": "Santino Roa",
   "fecha": "13/11/2026",
   "titulo": "feat(models): propiedades y fotos con transacciones"
  },
  {
   "hash": "92fdfb4",
   "autor": "Santino Roa",
   "fecha": "13/11/2026",
   "titulo": "feat(models): favoritos y solicitudes de compra"
  },
  {
   "hash": "7463a52",
   "autor": "Santino Calamari",
   "fecha": "13/11/2026",
   "titulo": "feat(api): registro, login, logout y sesion con BCRYPT"
  },
  {
   "hash": "fb4289d",
   "autor": "Santino Roa",
   "fecha": "13/11/2026",
   "titulo": "feat(api): CRUD de propiedades restringido al rol agente"
  },
  {
   "hash": "22c6a84",
   "autor": "Santino Roa",
   "fecha": "13/11/2026",
   "titulo": "feat(api): favoritos y solicitudes de compra"
  },
  {
   "hash": "ac9904b",
   "autor": "Jesus De Olivera",
   "fecha": "13/11/2026",
   "titulo": "refactor(public): mueve la maqueta de la AE1 a /public"
  },
  {
   "hash": "454376f",
   "autor": "Jesus De Olivera",
   "fecha": "13/11/2026",
   "titulo": "feat(public): index.html unico con las vistas de la SPA"
  },
  {
   "hash": "fe5082b",
   "autor": "Jesus De Olivera",
   "fecha": "13/11/2026",
   "titulo": "feat(public): cliente JS Vanilla con router por hash"
  },
  {
   "hash": "5f75847",
   "autor": "Jesus De Olivera",
   "fecha": "13/11/2026",
   "titulo": "feat(public): estilos de la SPA y correcciones de accesibilidad"
  },
  {
   "hash": "b9f7a1f",
   "autor": "Santino Calamari",
   "fecha": "13/11/2026",
   "titulo": "test(api): 53 casos contra la API REST"
  },
  {
   "hash": "fe23c7c",
   "autor": "Jesus De Olivera",
   "fecha": "13/11/2026",
   "titulo": "test(spa): 47 casos funcionales y auditoria de accesibilidad"
  },
  {
   "hash": "58aa5ed",
   "autor": "Santino Calamari",
   "fecha": "13/11/2026",
   "titulo": "docs: matriz de trazabilidad de los Casos de Uso de la AE1"
  },
  {
   "hash": "2d2cde1",
   "autor": "Santino Roa",
   "fecha": "13/11/2026",
   "titulo": "docs: ficha de autoevaluacion ISO/IEC 25010"
  },
  {
   "hash": "0375ca7",
   "autor": "Jesus De Olivera",
   "fecha": "13/11/2026",
   "titulo": "docs: README con el despliegue en XAMPP y estado de tareas"
  },
  {
   "hash": "bc6d03b",
   "autor": "Jesus De Olivera",
   "fecha": "13/11/2026",
   "titulo": "test(spa): estabiliza el caso del enlace de salto al contenido"
  },
  {
   "hash": "5eaeed5",
   "autor": "Jesus De Olivera",
   "fecha": "15/11/2026",
   "titulo": "feat(defensa): generador de fragmentos desde los archivos reales"
  },
  {
   "hash": "c69d38f",
   "autor": "Jesus De Olivera",
   "fecha": "15/11/2026",
   "titulo": "docs(defensa): textos de los casos de uso, integrantes, ISO y repositorio"
  },
  {
   "hash": "6890263",
   "autor": "Jesus De Olivera",
   "fecha": "15/11/2026",
   "titulo": "feat(defensa): presentacion interactiva con la aplicacion en vivo"
  },
  {
   "hash": "90fc051",
   "autor": "Jesus De Olivera",
   "fecha": "15/11/2026",
   "titulo": "docs: README, estado de tareas y bitacora con la presentacion de la defensa"
  }
 ],
 "lighthouse": [
  {
   "vista": "inicio-visitante",
   "puntaje": 100
  },
  {
   "vista": "catalogo-visitante",
   "puntaje": 100
  },
  {
   "vista": "ficha-visitante",
   "puntaje": 100
  },
  {
   "vista": "acceso-visitante",
   "puntaje": 100
  },
  {
   "vista": "comprar-cliente",
   "puntaje": 100
  },
  {
   "vista": "favoritos-cliente",
   "puntaje": 100
  },
  {
   "vista": "cuenta-cliente",
   "puntaje": 100
  },
  {
   "vista": "panel-agente",
   "puntaje": 100
  },
  {
   "vista": "catalogo-agente",
   "puntaje": 100
  }
 ]
};
