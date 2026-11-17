/* Presentación interactiva de la AE4.
   Lee window.DATOS (generado desde los archivos reales) y window.CONTENIDO (textos).
   No usa librerías. Todo el texto entra al DOM como texto, nunca como HTML. */
(function () {
  'use strict';

  const D = window.DATOS;
  const C = window.CONTENIDO;
  const SN = D.snippets;

  /* ===== utilidades de DOM ===== */
  function h(tag, props, ...hijos) {
    const e = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v === false || v == null) continue;
        if (k === 'class') e.className = v;
        else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
        else if (v === true) e.setAttribute(k, '');
        else e.setAttribute(k, v);
      }
    }
    for (const c of hijos.flat()) {
      if (c == null || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return e;
  }
  const $ = (s, r = document) => r.querySelector(s);
  function vaciar(e) { while (e.firstChild) e.removeChild(e.firstChild); return e; }
  const base = (ruta) => ruta.split('/').pop();
  const corto = (autor) => ({ 'Santino Calamari': 'Calamari', 'Santino Roa': 'Roa', 'Jesus De Olivera': 'Jesús' }[autor] || autor);

  /* ===== resaltado de sintaxis (mínimo, sin librerías) ===== */
  const KW_JS = 'async|await|function|const|let|var|return|if|else|for|of|in|new|try|catch|throw|true|false|null|undefined|typeof|switch|case|break|continue|class';
  const KW_PHP = 'function|return|if|else|elseif|foreach|as|try|catch|throw|new|public|private|protected|static|final|class|const|declare|require_once|true|false|null|int|string|bool|array|void|float|exit|switch|case|break|match|self';
  const KW_SQL = 'CREATE|TABLE|PRIMARY|KEY|FOREIGN|REFERENCES|UNIQUE|NOT|NULL|DEFAULT|AUTO_INCREMENT|INT|VARCHAR|TEXT|DECIMAL|ENUM|TINYINT|TIMESTAMP|DATETIME|ON|DELETE|CASCADE|ENGINE|InnoDB|CHARSET|COLLATE|CURRENT_TIMESTAMP|CONSTRAINT|INDEX|UNSIGNED|DATE|BOOLEAN|SET';
  const REGLAS = {
    js:   { re: new RegExp('(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)|(`(?:\\\\[\\s\\S]|[^`\\\\])*`|\'(?:\\\\.|[^\'\\\\\\n])*\'|"(?:\\\\.|[^"\\\\\\n])*")|\\b(' + KW_JS + ')\\b|(\\b\\d+(?:\\.\\d+)?\\b)', 'g'), cls: ['c', 's', 'k', 'n'] },
    php:  { re: new RegExp('(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*|#[^\\n]*)|(\'(?:\\\\.|[^\'\\\\\\n])*\'|"(?:\\\\.|[^"\\\\\\n])*")|\\b(' + KW_PHP + ')\\b|(\\$\\w+)|(\\b\\d+(?:\\.\\d+)?\\b)', 'g'), cls: ['c', 's', 'k', 'v', 'n'] },
    sql:  { re: new RegExp('(--[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)|(\'(?:\\\\.|[^\'\\\\\\n])*\')|\\b(' + KW_SQL + ')\\b|(\\b\\d+\\b)', 'g'), cls: ['c', 's', 'k', 'n'] },
    css:  { re: /(\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*')|(@[\w-]+)|(\b\d+(?:\.\d+)?(?:px|rem|em|%|s|ms)?\b|#[0-9a-fA-F]{3,8}\b)/g, cls: ['c', 's', 'k', 'n'] },
    html: { re: /(<!--[\s\S]*?-->)|("[^"]*"|'[^']*')|(<\/?[a-zA-Z][\w-]*|\/?>)|([\w:-]+(?==))/g, cls: ['c', 's', 'k', 'v'] },
  };

  /** Devuelve un arreglo de líneas; cada línea es un arreglo de {t, c}. */
  function resaltar(codigo, lenguaje) {
    const regla = REGLAS[lenguaje];
    const segmentos = [];
    let ultimo = 0;
    if (regla) {
      regla.re.lastIndex = 0;
      let m;
      while ((m = regla.re.exec(codigo)) !== null) {
        if (m[0] === '') { regla.re.lastIndex++; continue; }
        if (m.index > ultimo) segmentos.push({ t: codigo.slice(ultimo, m.index), c: '' });
        const g = m.findIndex((v, i) => i > 0 && v !== undefined);
        segmentos.push({ t: m[0], c: regla.cls[g - 1] || '' });
        ultimo = m.index + m[0].length;
      }
    }
    if (ultimo < codigo.length) segmentos.push({ t: codigo.slice(ultimo), c: '' });

    const lineas = [[]];
    for (const seg of segmentos) {
      const partes = seg.t.split('\n');
      partes.forEach((parte, i) => {
        if (i > 0) lineas.push([]);
        if (parte !== '') lineas[lineas.length - 1].push({ t: parte, c: seg.c });
      });
    }
    return lineas;
  }

  /* ===== visor de código ===== */
  function rotuloDe(clave) {
    const s = SN[clave];
    const fijos = { p_get: 'GET', p_post: 'POST', p_put: 'PUT', p_delete: 'DELETE', s_post: 'POST', s_patch: 'PATCH' };
    const propios = { c_conexion: 'conexion.php', m_usr_buscar: 'buscarPorEmail()', c_iniciar: 'iniciarSesionSegura()', c_abrir: 'abrirSesionUsuario()', c_sesion: 'exigirSesion()', c_rol: 'exigirRol()' };
    if (propios[clave]) return propios[clave];
    if (fijos[clave]) return fijos[clave] + ' · ' + base(s.archivo);
    if (clave.startsWith('t_')) return clave.slice(2);
    const f = s.codigo.match(/function\s+(\w+)/);
    if (f && !clave.startsWith('a_')) return f[1] + '()';
    return base(s.archivo);
  }

  function lineasDeCodigo(clave) {
    const s = SN[clave];
    const notas = (C.notas[clave] || []).filter((n) => n[1]);
    const lineas = resaltar(s.codigo, s.lenguaje);
    const caja = h('div', { class: 'codigo', role: 'region', 'aria-label': 'Código de ' + s.archivo, tabindex: '0' });
    lineas.forEach((segs, i) => {
      const crudo = segs.map((x) => x.t).join('');
      const nota = notas.find((n) => n[0].test(crudo));
      const fila = h('div', { class: 'linea' + (nota ? ' clave' : '') },
        h('span', { class: 'n' }, String(s.desde + i)),
        h('span', { class: 'tx' }, segs.map((x) => (x.c ? h('span', { class: 't-' + x.c }, x.t) : x.t)), segs.length ? null : '​'),
        nota ? h('span', { class: 'nota' }, '◂ ' + nota[1]) : null);
      caja.append(fila);
    });
    return caja;
  }

  /** Línea del fragmento que corresponde a un paso: prefiere una línea de código a un comentario. */
  const esComentario = (l) => /^\s*(\*|\/\*|\/\/|#)/.test(l);
  function resolverPaso(clave, paso) {
    const filas = SN[clave].codigo.split('\n');
    let i = filas.findIndex((l) => paso.re.test(l) && !esComentario(l));
    if (i < 0) i = filas.findIndex((l) => paso.re.test(l));
    if (i < 0) return null;
    return [i, Math.min(filas.length - 1, i + (paso.n || 1) - 1)];
  }

  /** Visor con pestañas si hay más de un fragmento.
      Devuelve el elemento con dos métodos: seleccionar(clave) y lineas(desde, hasta). */
  function crearVisor(claves, opciones = {}) {
    const raiz = h('div', { class: 'visor' });
    const cuerpo = h('div', { class: 'visor-cuerpo' });
    let actual = claves[0];
    const mostrar = (clave, boton) => {
      const s = SN[clave];
      actual = clave;
      vaciar(cuerpo);
      cuerpo.append(
        h('div', { class: 'meta' },
          h('code', { class: 'ruta' }, s.archivo),
          h('span', null, `líneas ${s.desde} a ${s.hasta}`),
          opciones.sinAutor ? null : h('span', { class: 'autor autor-' + corto(s.autor) }, corto(s.autor)),
          h('button', { type: 'button', class: 'chico', onclick: (e) => copiar(`${s.archivo}:${s.desde}`, e.currentTarget) }, 'Copiar ruta')),
        lineasDeCodigo(clave));
      if (boton) {
        raiz.querySelectorAll('[role="tab"]').forEach((b) => b.setAttribute('aria-selected', String(b === boton)));
      }
    };
    if (claves.length > 1) {
      const lista = h('div', { class: 'pestanas', role: 'tablist' });
      claves.forEach((clave, i) => {
        const b = h('button', { type: 'button', role: 'tab', 'aria-selected': String(i === 0), onclick: (e) => {
          mostrar(clave, e.currentTarget);
          if (opciones.alCambiar) opciones.alCambiar(clave);
        } }, rotuloDe(clave));
        lista.append(b);
      });
      raiz.append(lista);
    }
    raiz.append(cuerpo);
    mostrar(claves[0], raiz.querySelector('[role="tab"]'));

    raiz.seleccionar = (clave) => {
      if (clave === actual) return;
      const i = claves.indexOf(clave);
      mostrar(clave, raiz.querySelectorAll('[role="tab"]')[i]);
    };
    /** Resalta un rango de líneas (índices dentro del fragmento) y atenúa el resto. */
    raiz.lineas = (desde, hasta) => {
      const caja = $('.codigo', cuerpo);
      const filas = caja.querySelectorAll('.linea');
      filas.forEach((f, i) => {
        const dentro = desde != null && i >= desde && i <= hasta;
        f.classList.toggle('foco', dentro);
        f.classList.toggle('tenue', desde != null && !dentro);
      });
      if (desde != null && filas[desde]) caja.scrollTop = Math.max(0, filas[desde].offsetTop - caja.clientHeight / 3);
    };
    return raiz;
  }

  function copiar(texto, boton) {
    const original = boton.textContent;
    const listo = () => { boton.textContent = 'Copiado'; setTimeout(() => { boton.textContent = original; }, 1200); };
    if (navigator.clipboard) navigator.clipboard.writeText(texto).then(listo, () => {});
  }


  /* ===== estado ===== */
  const estado = {
    seccion: 'teclado', modo: 'dividido', vivo: [], alMover: null,
    // teclado
    pasoTec: C.teclado.pasos[0].id, hechos: {}, teclas: { tab: 0, enter: 0, mouse: 0 }, foco: '',
    // auditoría
    auditoria: 'lh',
    // interrogatorio
    tema: 'mvc', caso: 'uc1', variante: 0, paso: 'html', owasp: 0, ow: 0, iso: 0,
  };
  const casoPorId = (id) => C.casos.find((c) => c.id === id);
  const casoActual = () => casoPorId(estado.caso);
  const varianteActual = () => casoActual().variantes[estado.variante];
  const NOMBRES_PASO = { html: 'Vista (HTML)', js: 'Cliente (JS)', api: 'Controlador (PHP)', datos: 'Modelo y SQL' };
  const ORDEN_PASO = ['html', 'js', 'api', 'datos', 'vivo'];
  const PINTORES = { teclado: pintarTeclado, auditoria: pintarAuditoria, interrogatorio: pintarInterrogatorio };
  const repintar = () => PINTORES[estado.seccion]();
  const lado = () => vaciar($('#lado-codigo'));

  /* ===== navegación entre secciones ===== */
  const navegacion = $('#secciones');
  C.secciones.forEach((s, i) => {
    navegacion.append(h('button', { type: 'button', 'data-seccion': s.id, onclick: () => irASeccion(s.id) },
      h('span', { class: 'num' }, String(i + 1)), ' ', s.nombre, ' ', h('small', { class: 'tiempo' }, s.tiempo)));
  });

  const RUTA_INICIAL = { teclado: '#/inicio', auditoria: '#/propiedades', interrogatorio: '#/propiedades' };
  function asegurarIframe(id) {
    const f = $('#app');
    if (f.getAttribute('src') === 'about:blank') f.src = '../public/index.html' + RUTA_INICIAL[id];
  }

  function irASeccion(id) {
    estado.seccion = id;
    estado.alMover = null;
    navegacion.querySelectorAll('button').forEach((b) => {
      if (b.dataset.seccion === id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    $('#franja').textContent = C.franjas[id];
    $('#escena-demo').dataset.seccion = id;
    asegurarIframe(id);
    PINTORES[id]();
    aplicarModo();
    history.replaceState(null, '', '#' + id);
  }

  /* ===== diálogo con código ===== */
  $('#cerrar-ayuda').addEventListener('click', () => $('#ayuda-dialogo').close());
  $('#btn-ayuda').addEventListener('click', () => $('#ayuda-dialogo').showModal());
  $('#cerrar-dialogo').addEventListener('click', () => $('#visor-dialogo').close());
  const dialogo = $('#visor-dialogo');
  function abrirCodigo(claves, titulo) {
    $('#visor-dialogo-titulo').textContent = titulo || 'Código';
    vaciar($('#visor-dialogo-cuerpo')).append(crearVisor(Array.isArray(claves) ? claves : [claves], { sinAutor: true }));
    dialogo.showModal();
  }

  /* ===== modos de vista ===== */
  const MODOS = ['dividido', 'pagina', 'codigo'];
  function aplicarModo() {
    $('#escena-demo').dataset.modo = estado.modo;
    $('#btn-vista').textContent = 'Vista: ' + { dividido: 'dividido', pagina: 'solo página', codigo: 'solo código' }[estado.modo];
  }
  $('#btn-vista').addEventListener('click', () => { estado.modo = MODOS[(MODOS.indexOf(estado.modo) + 1) % MODOS.length]; aplicarModo(); });

  /* ===== reloj de la defensa ===== */
  const reloj = { seg: 0, id: null };
  const fmt = (n) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
  function pintarReloj() { $('#btn-reloj').textContent = '⏱ ' + fmt(reloj.seg); $('#btn-reloj').setAttribute('aria-pressed', String(reloj.id !== null)); }
  function alternarReloj() {
    if (reloj.id) { clearInterval(reloj.id); reloj.id = null; }
    else reloj.id = setInterval(() => { reloj.seg++; pintarReloj(); }, 1000);
    pintarReloj();
  }
  function reiniciarReloj() { if (reloj.id) { clearInterval(reloj.id); reloj.id = null; } reloj.seg = 0; pintarReloj(); }
  $('#btn-reloj').addEventListener('click', alternarReloj);

  /* ===================================================================
     1. DEMOSTRACIÓN POR TECLADO
     =================================================================== */
  const PASOS_TEC = [...C.teclado.pasos, C.teclado.opcional];
  function snipsDePaso(clave) {
    if (clave === 'salto') return ['h_salto', 'x_foco'];
    const [id, v] = clave.split(':');
    const va = casoPorId(id).variantes[Number(v || 0)];
    return ['js', 'api', 'datos'].flatMap((p) => va.pasos[p] || []);
  }

  function pintarTeclado() {
    const l = lado();
    estado.alMover = (d) => {
      const i = PASOS_TEC.findIndex((p) => p.id === estado.pasoTec);
      estado.pasoTec = PASOS_TEC[Math.max(0, Math.min(PASOS_TEC.length - 1, i + d))].id;
      pintarTeclado();
    };
    const tile = (k, rotulo) => h('div', { class: 'tile', 'data-k': k, 'data-estado': k === 'mouse' ? (estado.teclas.mouse ? 'mal' : 'bien') : 'neutro' },
      h('strong', { id: 'cnt-' + k }, String(estado.teclas[k])), h('span', null, rotulo));

    l.append(
      h('div', { class: 'marcador', role: 'group', 'aria-label': 'Contadores de la demostración' },
        tile('tab', 'Tab'), tile('enter', 'Enter'), tile('mouse', 'Clics de mouse en la página')),
      h('p', { class: 'foco-actual' }, h('strong', null, 'Foco: '), h('span', { id: 'foco-texto' }, estado.foco || '—')),
      h('div', { class: 'fila-botones' },
        h('button', { type: 'button', class: 'chico acento', onclick: darFoco }, 'Foco a la página (F)'),
        h('button', { type: 'button', class: 'chico', onclick: reiniciarTeclado }, 'Empezar de cero')));

    const lista = h('ol', { class: 'pasos-tec' });
    PASOS_TEC.forEach((p, i) => {
      const hecho = Boolean(estado.hechos[p.id]);
      const actual = p.id === estado.pasoTec;
      lista.append(h('li', { class: 'paso-tec' + (hecho ? ' hecho' : '') + (actual ? ' actual' : '') },
        h('button', { type: 'button', 'aria-pressed': String(actual), title: p.ver,
          'aria-label': `${p === C.teclado.opcional ? 'Opcional' : 'Paso ' + (i + 1)}: ${p.tecla}${hecho ? '. Hecho' : ''}`,
          onclick: () => { estado.pasoTec = p.id; pintarTeclado(); } },
          h('span', { class: 'n' }, hecho ? '✓' : (p === C.teclado.opcional ? '+' : String(i + 1))), p.tecla)));
    });
    l.append(lista);

    const sel = PASOS_TEC.find((p) => p.id === estado.pasoTec);
    l.append(h('div', { class: 'zona-paso' },
      h('p', { class: 'zona-titulo' }, sel.ver),
      crearVisor(snipsDePaso(sel.clave), { sinAutor: true })));
  }

  function darFoco() { try { $('#app').contentWindow.focus(); } catch (e) { /* mismo origen requerido */ } }
  function reiniciarTeclado() {
    estado.teclas = { tab: 0, enter: 0, mouse: 0 };
    estado.hechos = {};
    estado.pasoTec = C.teclado.pasos[0].id;
    estado.foco = '';
    $('#app').contentWindow.location.hash = '#/inicio';
    $('#app').contentWindow.location.reload();
    pintarTeclado();
  }
  function actualizarContadores() {
    ['tab', 'enter', 'mouse'].forEach((k) => {
      const n = $('#cnt-' + k); if (n) n.textContent = String(estado.teclas[k]);
    });
    const m = $('.tile[data-k="mouse"]'); if (m) m.dataset.estado = estado.teclas.mouse ? 'mal' : 'bien';
  }
  function marcar(id) {
    if (estado.seccion !== 'teclado') return;
    if (estado.hechos[id] && estado.pasoTec === id) return;
    estado.hechos[id] = true;
    estado.pasoTec = id;
    pintarTeclado();
  }
  function contarTecla(ev) {
    if (estado.seccion !== 'teclado') return;
    if (ev.key === 'Tab') estado.teclas.tab++;
    else if (ev.key === 'Enter') estado.teclas.enter++;
    else return;
    actualizarContadores();
  }
  function describirFoco(t) {
    if (!t || !t.tagName) return;
    const nombre = (t.getAttribute('aria-label') || t.textContent || t.value || t.getAttribute('placeholder') || '').trim().replace(/\s+/g, ' ').slice(0, 44);
    estado.foco = `<${t.tagName.toLowerCase()}>` + (nombre ? ` «${nombre}»` : '');
    const e = $('#foco-texto'); if (e) e.textContent = estado.foco;
    if (t.classList && t.classList.contains('salto-contenido')) marcar('salto');
  }
  function marcarPorPedido(e) {
    if (estado.seccion !== 'teclado' || e.estado < 200 || e.estado >= 300) return;
    if (/login\.php/.test(e.url) && e.metodo === 'POST') marcar('login');
    else if (/logout\.php/.test(e.url) && e.metodo === 'POST') marcar('salir');
    else if (/favoritos\.php/.test(e.url) && ['POST', 'DELETE'].includes(e.metodo)) marcar('favorito');
    else if (/solicitudes\.php/.test(e.url) && e.metodo === 'POST') marcar('compra');
    else if (/propiedades\.php/.test(e.url) && ['POST', 'PUT', 'DELETE'].includes(e.metodo)) marcar('panel');
  }

  /* ===================================================================
     2. EVIDENCIA DE AUDITORÍA
     =================================================================== */
  function pintarAuditoria() {
    const l = lado();
    const claves = ['lh', 'red'];
    estado.alMover = (d) => { estado.auditoria = claves[Math.max(0, Math.min(1, claves.indexOf(estado.auditoria) + d))]; pintarAuditoria(); };
    l.append(h('div', { class: 'pestanas temas', role: 'tablist', 'aria-label': 'Evidencia' },
      [['lh', 'Accesibilidad 100/100'], ['red', 'Red y endpoints JSON']].map(([k, t]) =>
        h('button', { type: 'button', role: 'tab', 'aria-selected': String(estado.auditoria === k), onclick: () => { estado.auditoria = k; pintarAuditoria(); } }, t))));
    const cuerpo = h('div', { class: 'tema-cuerpo' });
    l.append(cuerpo);
    (estado.auditoria === 'lh' ? auditoriaLighthouse : auditoriaRed)(cuerpo);
  }

  const pasosNumerados = (titulo, items) => h('details', { class: 'plegable' }, h('summary', null, titulo), h('ol', { class: 'receta-lista' }, items.map((t) => h('li', null, t))));

  function auditoriaLighthouse(c) {
    const todas = D.lighthouse.every((v) => v.puntaje === 100);
    c.append(
      h('div', { class: 'cifra-grande' }, h('strong', null, todas ? '100' : '—'), h('span', null, `Accesibilidad · ${D.lighthouse.length} vistas`)),
      pasosNumerados('Pasos en Chrome', C.auditoria.lighthouse),
      h('div', { class: 'lh-lista' }, D.lighthouse.map((v) =>
        h('a', { class: 'lh-fila', href: '../docs/evidencias/lighthouse/' + v.vista + '.report.html', target: '_blank', rel: 'noopener' },
          h('span', { class: 'lh-n' }, String(v.puntaje)), h('span', null, v.vista), h('span', { class: 'lh-ir' }, 'Informe')))),
      h('details', { class: 'plegable' },
        h('summary', null, 'De 92 a 100'),
        h('ul', { class: 'correcciones' }, C.correccionesLighthouse.map((t) => h('li', null, t)))));
  }

  function auditoriaRed(c) {
    const rechazos = D.pruebas.api.casos.filter((x) => /obtenido (401|403|409)\b/.test(x.detalle || ''));
    c.append(
      pasosNumerados('Pasos en Chrome', C.auditoria.red),
      h('table', { class: 'tabla-ep' },
        h('thead', null, h('tr', null, ['Endpoint', 'Métodos', 'Caso de uso'].map((t) => h('th', { scope: 'col' }, t)))),
        h('tbody', null, C.auditoria.endpoints.map((e) => h('tr', null, h('td', null, h('code', null, e.ruta)), h('td', null, e.metodos), h('td', null, e.uc))))),
      h('details', { class: 'plegable' },
        h('summary', null, `API ${D.pruebas.api.ok}/${D.pruebas.api.total} · rechazos 401, 403 y 409`),
        h('div', { class: 'casos' }, rechazos.map((x) => h('div', { class: 'caso-fila ok' },
          h('span', { class: 'marca' }, 'OK'), h('span', { class: 'cn' }, '[' + String(x.n).padStart(2, '0') + ']'),
          h('span', { class: 'ct' }, x.titulo, x.detalle ? h('small', null, x.detalle) : null))))),
      pintarVivo());
  }

  function pintarVivo() {
    const caja = h('div', { class: 'vivo' });
    caja.append(h('div', { class: 'vivo-cab' },
      h('p', null, 'Pedidos reales de la página'),
      h('button', { type: 'button', class: 'chico', onclick: () => { estado.vivo = []; repintar(); } }, 'Limpiar')));
    if (!estado.vivo.length) {
      caja.append(h('p', { class: 'vacio' }, 'Usá la página y aparecen acá.'));
      return caja;
    }
    estado.vivo.slice(0, 40).forEach((e) => {
      caja.append(h('details', { class: 'pedido' },
        h('summary', null,
          h('span', { class: 'cod cod-' + String(e.estado)[0] }, String(e.estado)),
          h('strong', null, e.metodo), ' ', h('code', null, e.url), h('span', { class: 'ms' }, e.ms + ' ms')),
        e.cuerpoPedido ? h('div', null, h('h4', null, 'Pedido'), h('pre', null, e.cuerpoPedido)) : null,
        h('div', null, h('h4', null, 'Respuesta'), h('pre', null, e.respuesta))));
    });
    return caja;
  }

  /* ===================================================================
     3. INTERROGATORIO ORAL
     =================================================================== */
  function pintarInterrogatorio() {
    const l = lado();
    estado.alMover = null;
    l.append(h('div', { class: 'pestanas temas', role: 'tablist', 'aria-label': 'Temas del interrogatorio' },
      C.temas.map((t) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(t.id === estado.tema), 'data-tema': t.id,
        onclick: () => { estado.tema = t.id; pintarInterrogatorio(); } },
        h('span', { class: 'rot' }, t.rotulo), ' ', t.nombre))));
    const cuerpo = h('div', { class: 'tema-cuerpo' });
    l.append(cuerpo);
    ({ mvc: pintarMvc, owasp: pintarOwasp, iso: pintarIsoTema })[estado.tema](cuerpo);
  }

  /* ---------- A. De los casos de uso a MVC ---------- */
  function seleccionarCaso(id, variante = 0, opciones = {}) {
    estado.caso = id; estado.variante = variante;
    const pasos = Object.keys(varianteActual().pasos);
    estado.paso = pasos[0] || 'vivo';
    if (estado.seccion !== 'interrogatorio' || estado.tema !== 'mvc') { estado.seccion = 'interrogatorio'; estado.tema = 'mvc'; irASeccion('interrogatorio'); }
    else pintarInterrogatorio();
    if (opciones.navegar) navegarIframe(varianteActual().ruta || casoActual().ruta);
  }
  function navegarIframe(ruta) {
    const f = $('#app');
    try {
      // El cambio de hash lo provoca la propia presentación: no hay que "reconocerlo"
      // como si la persona hubiera navegado, o pisaría el caso recién elegido.
      if (f.contentWindow.location.hash !== ruta) { estado.ignorarRuta = ruta; f.contentWindow.location.hash = ruta; }
    } catch (e) { f.src = '../public/index.html' + ruta; }
  }
  function chip(x) {
    return h('button', { type: 'button', class: 'chip', 'aria-pressed': String(x.id === estado.caso), title: x.titulo + ' · nació en la ' + C.mvc.nacio[x.id],
      onclick: () => seleccionarCaso(x.id, 0, { navegar: true }) }, x.rotulo);
  }
  /** Último pedido real al endpoint de este paso, si lo hubo. */
  function avisoPedido(v, paso) {
    if (paso !== 'api') return null;
    const archivos = (v.pasos.api || []).map((k) => base(SN[k].archivo));
    const ultimo = estado.vivo.find((e) => archivos.some((a) => e.url.includes(a)));
    if (!ultimo) return h('p', { class: 'ultimo vacio' }, 'Todavía no hubo un pedido a este endpoint. Hacelo en la página y aparece acá.');
    return h('p', { class: 'ultimo' }, h('strong', null, 'Último pedido real: '),
      `${ultimo.metodo} ${ultimo.url} → `, h('span', { class: 'cod cod-' + String(ultimo.estado)[0] }, String(ultimo.estado)), ` (${ultimo.ms} ms)`);
  }

  function pintarMvc(cuerpo) {
    const c = casoActual(), v = varianteActual();
    const ev = C.mvc.evolucion[c.id];
    const lista = C.casos;
    estado.alMover = (d) => {
      const i = lista.findIndex((x) => x.id === estado.caso);
      seleccionarCaso(lista[(i + d + lista.length) % lista.length].id, 0, { navegar: true });
    };

    cuerpo.append(
      h('ul', { class: 'porque' }, C.mvc.porque.map((t) => h('li', null, t))),
      h('div', { class: 'capas-fila' }, C.capas.map((x) => h('span', { class: 'capa-pill' }, x.nombre, ' ', h('code', null, x.carpeta)))),
      h('div', { class: 'chips', role: 'toolbar', 'aria-label': 'Casos de uso' }, lista.map(chip)),
      h('div', { class: 'caso-cab' },
        h('h2', null, h('span', { class: 'rotulo' }, c.rotulo), ' ', c.titulo, ' ', h('span', { class: 'nacio' }, 'nació en la ' + C.mvc.nacio[c.id]))),
      h('div', { class: 'evol' }, [['ae1', 'AE1'], ['ae2', 'AE2'], ['ae4', 'AE4']].map(([k, t]) =>
        h('div', { class: 'evol-col evol-' + k }, h('h4', null, t), h('p', null, ev[k])))));

    if (c.variantes.length > 1) {
      const vs = h('div', { class: 'pestanas pestanas-var', role: 'tablist', 'aria-label': 'Variantes' });
      c.variantes.forEach((x, i) => vs.append(h('button', { type: 'button', role: 'tab', 'aria-selected': String(i === estado.variante),
        onclick: () => seleccionarCaso(c.id, i, { navegar: Boolean(x.ruta) }) }, x.nombre)));
      cuerpo.append(vs);
    }

    const lista2 = ORDEN_PASO.filter((p) => p === 'vivo' || v.pasos[p]);
    if (!lista2.includes(estado.paso)) estado.paso = lista2[0];
    const pasos = h('div', { class: 'pestanas pasos', role: 'tablist', 'aria-label': 'Capas por las que pasa el caso de uso' });
    lista2.forEach((p) => {
      const b = h('button', { type: 'button', role: 'tab', 'data-paso': p, 'aria-selected': String(p === estado.paso),
        onclick: () => { estado.paso = p; pintarInterrogatorio(); } }, p === 'vivo' ? 'En vivo' : NOMBRES_PASO[p]);
      if (p === 'vivo') b.append(h('span', { class: 'contador', id: 'contador-vivo' }, String(estado.vivo.length)));
      pasos.append(b);
    });
    cuerpo.append(pasos);

    const zona = h('div', { class: 'zona-paso' });
    if (estado.paso === 'vivo') zona.append(pintarVivo());
    else {
      const aviso = avisoPedido(v, estado.paso);
      if (aviso) zona.append(aviso);
      zona.append(crearVisor(v.pasos[estado.paso], { sinAutor: true }));
    }
    cuerpo.append(zona);
  }

  /* ---------- B. OWASP línea por línea ---------- */
  function pintarOwasp(cuerpo) {
    const t = C.owasp[estado.owasp];
    const plano = t.archivos.flatMap((a) => a.pasos.map((p) => ({ snip: a.snip, paso: p, rango: resolverPaso(a.snip, p) })));
    let k = Math.max(0, Math.min(estado.ow, plano.length - 1));

    cuerpo.append(
      h('div', { class: 'pestanas pestanas-var', role: 'tablist', 'aria-label': 'Remediación OWASP' },
        C.owasp.map((x, i) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(i === estado.owasp),
          onclick: () => { estado.owasp = i; estado.ow = 0; pintarInterrogatorio(); } }, x.titulo))),
      h('div', { class: 'ow-cab' },
        h('p', { class: 'ow-tag' }, t.owasp),
        h('p', { class: 'ow-idea' }, t.idea)),
      h('details', { class: 'plegable ow-probar' },
        h('summary', null, 'Cómo probarlo en vivo'),
        h('p', null, t.probar),
        h('div', { class: 'fila-botones' },
          h('button', { type: 'button', class: 'chico', onclick: () => navegarIframe('#/acceso') }, 'Mostrar el formulario de ingreso'),
          h('span', { class: 'ultimo', id: 'ultimo-login' }, ultimoLogin()))));

    const tarjeta = h('div', { class: 'ow-tarjeta', 'aria-live': 'polite' });
    const visor = crearVisor(t.archivos.map((a) => a.snip), { sinAutor: true, alCambiar: (clave) => { k = plano.findIndex((x) => x.snip === clave); mostrar(); } });
    cuerpo.append(tarjeta, h('div', { class: 'zona-paso' }, visor));

    function mostrar() {
      estado.ow = k;
      const it = plano[k];
      visor.seleccionar(it.snip);
      if (it.rango) visor.lineas(it.rango[0], it.rango[1]); else visor.lineas(null);
      vaciar(tarjeta).append(
        h('p', { class: 'ow-n' }, `Paso ${k + 1} de ${plano.length}`, it.rango ? `  ·  líneas ${SN[it.snip].desde + it.rango[0]}${it.rango[1] > it.rango[0] ? ' a ' + (SN[it.snip].desde + it.rango[1]) : ''}` : ''),
        h('p', { class: 'ow-texto' }, it.paso.t),
        h('div', { class: 'fila-botones' },
          h('button', { type: 'button', class: 'chico', disabled: k === 0, onclick: () => { k--; mostrar(); } }, '◂ Línea anterior'),
          h('button', { type: 'button', class: 'chico acento', disabled: k === plano.length - 1, onclick: () => { k++; mostrar(); } }, 'Línea siguiente ▸'),
          h('button', { type: 'button', class: 'chico', onclick: () => visor.lineas(null) }, 'Ver el archivo sin resaltar')));
    }
    estado.alMover = (d) => { k = Math.max(0, Math.min(plano.length - 1, k + d)); mostrar(); };
    mostrar();
  }
  function ultimoLogin() {
    const e = estado.vivo.find((x) => /login\.php/.test(x.url));
    return e ? `Último pedido a login.php → ${e.estado}` : 'Todavía no hubo pedidos a login.php';
  }

  /* ---------- C. ISO 25010 ---------- */
  function pintarIsoTema(cuerpo) {
    const a = C.isoAreas[estado.iso];
    estado.alMover = (d) => { estado.iso = Math.max(0, Math.min(C.isoAreas.length - 1, estado.iso + d)); pintarInterrogatorio(); };
    const bloque = (titulo, ...hijos) => h('div', { class: 'iso-bloque' }, h('h4', null, titulo), ...hijos);
    cuerpo.append(
      h('div', { class: 'pestanas pestanas-var', role: 'tablist', 'aria-label': 'Áreas del código' },
        C.isoAreas.map((x, i) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(i === estado.iso),
          onclick: () => { estado.iso = i; pintarInterrogatorio(); } }, x.tab))),
      h('div', { class: 'iso-cab' }, h('h3', null, a.caracteristica), h('p', { class: 'ow-idea' }, a.antes)),
      bloque('Qué se refactorizó',
        a.cambio === 'LIGHTHOUSE'
          ? [h('ul', { class: 'correcciones' }, [...C.correccionesLighthouse, a.extra].map((x) => h('li', null, x)))]
          : h('ul', { class: 'correcciones' }, a.cambio.map((x) => h('li', null, x)))),
      h('div', { class: 'iso-dos' }, bloque('Cómo se midió', h('p', null, a.medicion)), bloque('Qué falta', h('p', null, a.limite))),
      h('div', { class: 'zona-paso' }, crearVisor(a.snips, { sinAutor: true })));
  }

  /* ===================================================================
     INSTRUMENTACIÓN DE LA PÁGINA (iframe del mismo origen)
     =================================================================== */
  function enganchar() {
    const f = $('#app');
    let w, d;
    try { w = f.contentWindow; d = w.document; void d.body; } catch (e) {
      $('.barra-iframe span').textContent = 'No puedo leer la aplicación. Abrí esta presentación desde el mismo servidor (http://localhost/…/defensa/), no con doble clic.';
      return;
    }
    if (w.__defensa) return;
    w.__defensa = true;
    $('.barra-iframe span').textContent = 'Aplicación real en vivo';

    const original = w.fetch.bind(w);
    w.fetch = function (entrada, init) {
      const t0 = performance.now();
      const metodo = ((init && init.method) || 'GET').toUpperCase();
      const url = String(entrada).replace(/^.*\/api\//, '');
      const cuerpoPedido = init && init.body ? formatear(init.body) : '';
      return original(entrada, init).then((r) => {
        r.clone().text().then((txt) => registrar({ metodo, url, estado: r.status, ms: Math.round(performance.now() - t0), cuerpoPedido, respuesta: formatear(txt) }));
        return r;
      });
    };

    d.addEventListener('click', (ev) => reconocerClic(ev), true);
    d.addEventListener('submit', (ev) => reconocerEnvio(ev), true);
    d.addEventListener('change', (ev) => { if (ev.target.closest && ev.target.closest('.select-estado')) detectado('uc9', 2); }, true);
    d.addEventListener('keydown', (ev) => { contarTecla(ev); if (estado.seccion !== 'teclado') atajos(ev); }, true);
    d.addEventListener('mousedown', () => { if (estado.seccion === 'teclado') { estado.teclas.mouse++; actualizarContadores(); } }, true);
    d.addEventListener('focusin', (ev) => { if (estado.seccion === 'teclado') describirFoco(ev.target); }, true);
    w.addEventListener('hashchange', () => reconocerRuta(w.location.hash));
    reconocerRuta(w.location.hash);
  }
  $('#app').addEventListener('load', enganchar);
  $('#btn-recargar').addEventListener('click', () => { $('#app').contentWindow.location.reload(); });

  function formatear(txt) {
    const crudo = typeof txt === 'string' ? txt : String(txt);
    try { return JSON.stringify(JSON.parse(crudo), null, 2).slice(0, 1800); } catch (e) { return crudo.slice(0, 1800); }
  }
  function registrar(entrada) {
    estado.vivo.unshift(entrada);
    if (estado.vivo.length > 80) estado.vivo.pop();
    marcarPorPedido(entrada);
    const c = $('#contador-vivo'); if (c) c.textContent = String(estado.vivo.length);
    const u = $('#ultimo-login'); if (u) u.textContent = ultimoLogin();
    const s = estado.seccion;
    if (s === 'auditoria' && estado.auditoria === 'red') pintarAuditoria();
    else if (s === 'interrogatorio' && estado.tema === 'mvc' && (estado.paso === 'vivo' || estado.paso === 'api')) pintarInterrogatorio();
  }

  /** Solo el tema A del interrogatorio sigue a la página. */
  function detectado(id, variante = 0, desdeRuta = false) {
    if (estado.seccion !== 'interrogatorio' || estado.tema !== 'mvc' || !casoPorId(id)) return;
    // Una acción de la persona manda sobre la navegación que ella misma provoca
    // (por ejemplo, al cerrar sesión la SPA vuelve sola a la portada).
    if (!desdeRuta) estado.ultimaAccion = Date.now();
    else if (Date.now() - (estado.ultimaAccion || 0) < 600) return;
    if (estado.caso === id && estado.variante === variante) return;
    seleccionarCaso(id, variante);
  }
  function reconocerClic(ev) {
    const t = ev.target.closest ? ev.target : ev.target.parentElement;
    const q = (s) => t.closest(s);
    if (estado.seccion === 'teclado') { if (q('[data-filtro-catalogo]')) marcar('filtro'); return; }
    if (q('.btn-favorito')) return detectado('uc8', 0);
    if (q('a[href*="wa.me"]')) return detectado('uc5');
    if (q('[data-filtro-catalogo]')) return detectado('uc2');
    if (q('[data-accion="cerrar-sesion"]')) return detectado('uc7', 1);
    if (q('[data-eliminar]')) return detectado('uc9', 1);
    if (q('[data-editar]')) return detectado('uc9', 0);
    if (q('[data-tab="registro"]')) return detectado('uc6');
    if (q('[data-tab="login"]')) return detectado('uc7', 0);
  }
  function reconocerEnvio(ev) {
    const id = ev.target.id;
    if (id === 'form-login') detectado('uc7', 0);
    else if (id === 'form-registro') detectado('uc6');
    else if (id === 'form-compra') detectado('uc4');
    else if (id === 'form-propiedad') detectado('uc9', 0);
  }
  function reconocerRuta(hash) {
    const ruta = (hash || '#/inicio').split('?')[0];
    if (estado.ignorarRuta === ruta) { estado.ignorarRuta = null; return; }
    estado.ignorarRuta = null;
    if (estado.seccion === 'teclado') {
      if (ruta === '#/propiedades') marcar('catalogo');
      else if (ruta.startsWith('#/propiedad/')) marcar('ficha');
      else if (ruta === '#/panel') marcar('panel');
      return;
    }
    if (ruta === '#/inicio' || ruta === '#/propiedades') detectado('uc1', 0, true);
    else if (ruta.startsWith('#/propiedad/')) detectado('uc3', 0, true);
    else if (ruta === '#/acceso') detectado('uc7', 0, true);
    else if (ruta === '#/comprar') detectado('uc4', 0, true);
    else if (ruta === '#/favoritos') detectado('uc8', 1, true);
    else if (ruta === '#/panel') detectado('uc9', 0, true);
  }

  /* ===== teclado de la presentación ===== */
  function atajos(ev) {
    const t = ev.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (dialogo.open || $('#ayuda-dialogo').open) return;
    if (/^[1-9]$/.test(ev.key) && C.secciones[Number(ev.key) - 1]) { irASeccion(C.secciones[Number(ev.key) - 1].id); ev.preventDefault(); return; }
    const k = ev.key.toLowerCase();
    if (k === 'v') { $('#btn-vista').click(); return; }
    if (k === 't') { alternarReloj(); return; }
    if (k === 'r') { reiniciarReloj(); return; }
    if (ev.key === '?') { $('#ayuda-dialogo').showModal(); return; }
    if (estado.seccion === 'teclado' && k === 'f') { darFoco(); ev.preventDefault(); return; }
    if (estado.seccion === 'interrogatorio' && 'abc'.includes(k) && k.length === 1) {
      estado.tema = { a: 'mvc', b: 'owasp', c: 'iso' }[k]; pintarInterrogatorio(); return;
    }
    const avanza = ['ArrowRight', 'ArrowDown', 'PageDown'].includes(ev.key);
    const retrocede = ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(ev.key);
    if ((avanza || retrocede) && estado.alMover && !(t && t.closest && t.closest('[role="tablist"]'))) {
      estado.alMover(avanza ? 1 : -1);
      ev.preventDefault();
    }
  }
  document.addEventListener('keydown', atajos);

  /* ===== arranque ===== */
  const inicial = (location.hash || '').slice(1);
  irASeccion(C.secciones.some((s) => s.id === inicial) ? inicial : 'teclado');
})();
