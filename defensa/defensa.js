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

  /** Visor con pestañas si hay más de un fragmento. */
  function crearVisor(claves, opciones = {}) {
    const raiz = h('div', { class: 'visor' });
    const cuerpo = h('div', { class: 'visor-cuerpo' });
    const mostrar = (clave, boton) => {
      const s = SN[clave];
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
        const b = h('button', { type: 'button', role: 'tab', 'aria-selected': String(i === 0), onclick: (e) => mostrar(clave, e.currentTarget) }, rotuloDe(clave));
        lista.append(b);
      });
      raiz.append(lista);
    }
    raiz.append(cuerpo);
    mostrar(claves[0], raiz.querySelector('[role="tab"]'));
    return raiz;
  }

  function copiar(texto, boton) {
    const original = boton.textContent;
    const listo = () => { boton.textContent = 'Copiado'; setTimeout(() => { boton.textContent = original; }, 1200); };
    if (navigator.clipboard) navigator.clipboard.writeText(texto).then(listo, () => {});
  }

  /* ===== estado ===== */
  const estado = { seccion: 'inicio', caso: 'uc1', variante: 0, paso: 'html', modo: 'dividido', vivo: [], lamina: 0 };
  const TODOS = [...C.casos, ...C.extras];
  const casoPorId = (id) => TODOS.find((c) => c.id === id);
  const NOMBRES_PASO = { html: 'Vista (HTML)', js: 'Evento y fetch (JS)', api: 'Endpoint (PHP)', datos: 'Modelo y SQL' };
  const ORDEN_PASO = ['html', 'js', 'api', 'datos', 'vivo'];

  /* ===== navegación entre secciones ===== */
  const navegacion = $('#secciones');
  C.secciones.forEach((s, i) => {
    navegacion.append(h('button', { type: 'button', 'data-seccion': s.id, onclick: () => irASeccion(s.id) },
      h('span', { class: 'num' }, String(i + 1)), ' ', s.nombre));
  });

  function irASeccion(id) {
    estado.seccion = id;
    navegacion.querySelectorAll('button').forEach((b) => {
      if (b.dataset.seccion === id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    $('#franja').textContent = C.franjas[id];
    const demo = id === 'casos';
    $('#escena-demo').hidden = !demo;
    $('#escena-hoja').hidden = demo;
    $('#btn-vista').hidden = !demo;
    if (demo) {
      asegurarIframe();
      pintarCaso();
      aplicarModo();
    } else {
      const hoja = vaciar($('#escena-hoja'));
      hoja.className = 'escena-hoja hoja-' + id;
      ({ inicio: pintarInicio, recorrido: pintarRecorrido, pruebas: pintarPruebas, iso: pintarIso, repo: pintarRepo })[id](hoja);
      hoja.scrollTop = 0;
    }
    history.replaceState(null, '', '#' + id);
  }

  /* ===== diálogo con código ===== */
  const dialogo = $('#visor-dialogo');
  function abrirCodigo(claves, titulo) {
    $('#visor-dialogo-titulo').textContent = titulo || 'Código';
    const cuerpo = vaciar($('#visor-dialogo-cuerpo'));
    cuerpo.append(crearVisor(Array.isArray(claves) ? claves : [claves]));
    dialogo.showModal();
  }
  $('#cerrar-dialogo').addEventListener('click', () => dialogo.close());
  $('#btn-ayuda').addEventListener('click', () => $('#ayuda-dialogo').showModal());
  $('#cerrar-ayuda').addEventListener('click', () => $('#ayuda-dialogo').close());

  /* ===================================================================
     SECCIÓN: INICIO
     =================================================================== */
  function pintarInicio(hoja) {
    hoja.append(
      h('div', { class: 'portada' },
        h('p', { class: 'sup' }, 'Paradigmas y Lenguajes de Programación III · Ing. Sicardi Dante'),
        h('h1', null, 'RN Inmobiliaria: de la maqueta estática a una SPA con API REST'),
        h('p', { class: 'equipo' }, 'Roa, Santino · Calamari, Santino · De Olivera, Jesús'),
        h('div', { class: 'cifras' },
          cifra(D.pruebas.api.ok + '/' + D.pruebas.api.total, 'casos de la API'),
          cifra(D.pruebas.spa.ok + '/' + D.pruebas.spa.total, 'casos de la SPA'),
          cifra(D.lighthouse.length + '/' + D.lighthouse.length, 'vistas con Lighthouse 100'),
          cifra(String(D.commits.length), 'commits repartidos'))),

      h('h2', null, 'Qué limitaciones dejó la AE2 y cómo las resuelve esta entrega'),
      h('div', { class: 'tabla-sencilla' },
        h('div', { class: 'fila cab' }, h('span', null, 'Lo que dejó la AE2'), h('span', null, 'Lo que hace la AE4'), h('span', null, '')),
        C.limitaciones.map((l) => h('div', { class: 'fila' },
          h('span', null, l.ae2), h('span', null, l.ae4),
          h('button', { type: 'button', class: 'chico', onclick: () => abrirCodigo(l.snip, 'Evidencia') }, 'Ver código')))),

      h('h2', null, 'Qué pide la consigna y dónde está'),
      h('div', { class: 'requisitos' },
        C.requisitos.map((r) => h('div', { class: 'req' },
          h('span', { class: 'grupo' }, r.grupo),
          h('span', { class: 'texto' }, r.texto),
          r.snip
            ? h('button', { type: 'button', class: 'chico', onclick: () => abrirCodigo(r.snip, r.texto) }, 'Ver código')
            : h('button', { type: 'button', class: 'chico', onclick: () => irASeccion(r.ir) }, 'Ir a la sección')))));
  }
  function cifra(n, t) { return h('div', { class: 'cifra' }, h('strong', null, n), h('span', null, t)); }

  /* ===================================================================
     SECCIÓN: CASOS DE USO
     =================================================================== */
  function asegurarIframe() {
    const f = $('#app');
    if (f.getAttribute('src') === 'about:blank') f.src = '../public/index.html' + (casoActual().variantes[estado.variante].ruta || casoActual().ruta);
  }
  const casoActual = () => casoPorId(estado.caso);
  const varianteActual = () => casoActual().variantes[estado.variante];

  function seleccionarCaso(id, variante = 0, opciones = {}) {
    estado.caso = id; estado.variante = variante;
    const pasos = Object.keys(varianteActual().pasos);
    estado.paso = pasos[0] || 'vivo';
    if (estado.seccion !== 'casos') { irASeccion('casos'); }
    else pintarCaso();
    if (opciones.navegar) navegarIframe(varianteActual().ruta || casoActual().ruta);
  }

  function navegarIframe(ruta) {
    const f = $('#app');
    try {
      // El cambio de hash lo provoca la propia presentación: no hay que "reconocerlo"
      // como si el usuario hubiera navegado, o pisaría el caso recién elegido.
      if (f.contentWindow.location.hash !== ruta) { estado.ignorarRuta = ruta; f.contentWindow.location.hash = ruta; }
    } catch (e) { f.src = '../public/index.html' + ruta; }
  }

  function pintarCaso() {
    const lado = vaciar($('#lado-codigo'));
    const c = casoActual();
    const v = varianteActual();

    const chips = h('div', { class: 'chips', role: 'toolbar', 'aria-label': 'Casos de uso' });
    C.casos.forEach((x) => chips.append(chip(x)));
    chips.append(h('span', { class: 'sep' }, '·'));
    C.extras.forEach((x) => chips.append(chip(x)));
    lado.append(chips);

    lado.append(
      h('div', { class: 'caso-cab' },
        h('h2', null, h('span', { class: 'rotulo' }, c.rotulo), ' ', c.titulo),
        h('p', { class: 'resuelve' }, c.resuelve),
        h('p', { class: 'req-linea' }, h('strong', null, 'Requisito AE4: '), c.req)));

    if (c.variantes.length > 1) {
      const vs = h('div', { class: 'pestanas pestanas-var', role: 'tablist', 'aria-label': 'Variantes' });
      c.variantes.forEach((x, i) => vs.append(h('button', { type: 'button', role: 'tab', 'aria-selected': String(i === estado.variante),
        onclick: () => seleccionarCaso(c.id, i, { navegar: Boolean(x.ruta) }) }, x.nombre)));
      lado.append(vs);
    }

    const pasos = h('div', { class: 'pestanas pasos', role: 'tablist', 'aria-label': 'Pasos de la cadena' });
    ORDEN_PASO.forEach((p) => {
      if (p !== 'vivo' && !v.pasos[p]) return;
      const etiqueta = p === 'vivo' ? 'En vivo' : NOMBRES_PASO[p];
      const b = h('button', { type: 'button', role: 'tab', 'data-paso': p, 'aria-selected': String(p === estado.paso),
        onclick: () => { estado.paso = p; pintarCaso(); } }, etiqueta);
      if (p === 'vivo') b.append(h('span', { class: 'contador', id: 'contador-vivo' }, String(estado.vivo.length)));
      pasos.append(b);
    });
    lado.append(pasos);

    const zona = h('div', { class: 'zona-paso' });
    if (estado.paso === 'vivo') zona.append(pintarVivo());
    else {
      const aviso = avisoPedido(v, estado.paso);
      if (aviso) zona.append(aviso);
      zona.append(crearVisor(v.pasos[estado.paso]));
    }
    lado.append(zona);

    const pie = h('div', { class: 'caso-pie' }, h('p', null, v.nota));
    const claves = Object.keys(v.pasos);
    const idx = ORDEN_PASO.filter((p) => p === 'vivo' || v.pasos[p]).indexOf(estado.paso);
    const lista = ORDEN_PASO.filter((p) => p === 'vivo' || v.pasos[p]);
    pie.append(h('div', { class: 'ir' },
      h('button', { type: 'button', class: 'chico', disabled: idx <= 0, onclick: () => { estado.paso = lista[idx - 1]; pintarCaso(); } }, '◂ Paso anterior'),
      h('button', { type: 'button', class: 'chico', disabled: idx >= lista.length - 1, onclick: () => { estado.paso = lista[idx + 1]; pintarCaso(); } }, 'Paso siguiente ▸')));
    if (!claves.includes('api') && !claves.includes('datos')) pie.append(h('p', { class: 'sin-back' }, 'Esta función no llama al servidor.'));
    lado.append(pie);
  }

  function chip(x) {
    return h('button', { type: 'button', class: 'chip', 'aria-pressed': String(x.id === estado.caso), title: x.titulo,
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

  function pintarVivo() {
    const caja = h('div', { class: 'vivo' });
    caja.append(h('div', { class: 'vivo-cab' },
      h('p', null, 'Cada fetch() que hace la página aparece acá, con su respuesta real. Es un respaldo: la evidencia oficial se muestra en las DevTools.'),
      h('button', { type: 'button', class: 'chico', onclick: () => { estado.vivo = []; pintarCaso(); } }, 'Limpiar')));
    if (!estado.vivo.length) {
      caja.append(h('p', { class: 'vacio' }, 'Todavía no hay pedidos. Usá la página de la izquierda.'));
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

  /* ===== instrumentación del iframe ===== */
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
    d.addEventListener('keydown', (ev) => atajos(ev), true);
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
    const c = $('#contador-vivo'); if (c) c.textContent = String(estado.vivo.length);
    if (estado.seccion === 'casos' && (estado.paso === 'vivo' || estado.paso === 'api')) pintarCaso();
  }

  function detectado(id, variante = 0, desdeRuta = false) {
    if (estado.seccion !== 'casos') return;
    // Una acción del usuario manda sobre la navegación que ella misma provoca
    // (por ejemplo, al cerrar sesión la SPA vuelve sola a la portada).
    if (!desdeRuta) estado.ultimaAccion = Date.now();
    else if (Date.now() - (estado.ultimaAccion || 0) < 600) return;
    if (estado.caso === id && estado.variante === variante) return;
    seleccionarCaso(id, variante);
  }
  function reconocerClic(ev) {
    const t = ev.target.closest ? ev.target : ev.target.parentElement;
    const q = (s) => t.closest(s);
    if (q('.btn-favorito')) return detectado('uc8', 0);
    if (q('[data-ver-fotos]')) return detectado('x-visor');
    if (q('a[href*="wa.me"]')) return detectado('uc5');
    if (q('[data-filtro-catalogo]')) return detectado('uc2');
    if (q('[data-filtro-inicio], [data-accion="resaltar-destacadas"]')) return detectado('x-portada');
    if (q('[data-accion="alternar-tema"]')) return detectado('x-tema');
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
    if (ruta === '#/inicio' || ruta === '#/propiedades') detectado('uc1', 0, true);
    else if (ruta.startsWith('#/propiedad/')) detectado('uc3', 0, true);
    else if (ruta === '#/acceso') detectado('uc7', 0, true);
    else if (ruta === '#/comprar') detectado('uc4', 0, true);
    else if (ruta === '#/favoritos') detectado('uc8', 1, true);
    else if (ruta === '#/panel') detectado('uc9', 0, true);
  }

  /* ===== modos de vista ===== */
  const MODOS = ['dividido', 'pagina', 'codigo'];
  function aplicarModo() {
    const demo = $('#escena-demo');
    demo.dataset.modo = estado.modo;
    $('#btn-vista').textContent = 'Vista: ' + { dividido: 'dividido', pagina: 'solo página', codigo: 'solo código' }[estado.modo];
  }
  function ciclarModo() {
    if (estado.seccion !== 'casos') return;
    estado.modo = MODOS[(MODOS.indexOf(estado.modo) + 1) % MODOS.length];
    aplicarModo();
  }
  $('#btn-vista').addEventListener('click', ciclarModo);

  /* ===================================================================
     EL RECORRIDO: láminas que siguen un hilo, de la base a la pantalla
     =================================================================== */
  function pintarRecorrido(hoja) {
    const L = C.recorrido;
    const total = L.length;
    const riel = h('ol', { class: 'rec-riel', 'aria-label': 'Etapas del recorrido' });
    const cuerpo = h('div', { class: 'rec-cuerpo' });
    const anterior = h('button', { type: 'button', class: 'chico', onclick: () => ir(estado.lamina - 1) }, '← Anterior');
    const siguiente = h('button', { type: 'button', class: 'chico acento', onclick: () => ir(estado.lamina + 1) }, 'Siguiente →');
    const cuenta = h('span', { class: 'rec-cuenta', 'aria-live': 'polite' });
    const puntos = h('div', { class: 'rec-puntos', role: 'group', 'aria-label': 'Ir a una lámina' });

    L.forEach((l, i) => puntos.append(h('button', {
      type: 'button', class: 'rec-punto etapa-' + l.capa, 'aria-label': `Lámina ${i + 1}: ${l.titulo}`,
      onclick: () => ir(i),
    })));
    C.etapas.forEach((e) => {
      const primera = L.findIndex((l) => l.capa === e.id);
      riel.append(h('li', null, h('button', { type: 'button', class: 'rec-etapa', 'data-etapa': e.id, onclick: () => ir(primera) }, e.nombre)));
    });

    function ir(n) {
      if (n < 0 || n >= total) return;
      estado.lamina = n;
      const l = L[n];
      const etapa = C.etapas.find((e) => e.id === l.capa);
      riel.querySelectorAll('.rec-etapa').forEach((b) => {
        if (b.dataset.etapa === l.capa) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      puntos.querySelectorAll('.rec-punto').forEach((b, i) => {
        b.classList.toggle('hecho', i < n);
        if (i === n) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
      cuenta.textContent = `${n + 1} de ${total}`;
      anterior.disabled = n === 0;
      siguiente.disabled = n === total - 1;
      vaciar(cuerpo);
      const texto = h('div', { class: 'rec-texto' },
        h('p', { class: 'rec-capa etapa-' + l.capa }, etapa.nombre),
        h('h1', null, l.titulo),
        h('p', { class: 'rec-idea' }, l.idea),
        h('div', { class: 'rec-resuelve' }, h('strong', null, 'Qué resuelve'), h('p', null, l.resuelve)));
      if (l.uc) texto.append(h('button', { type: 'button', class: 'chico acento', onclick: () => seleccionarCaso(l.uc, 0, { navegar: true }) }, 'Probarlo en la página'));
      if (l.ir) texto.append(h('button', { type: 'button', class: 'chico acento', onclick: () => irASeccion(l.ir) }, 'Ir a ' + C.secciones.find((s) => s.id === l.ir).nombre));
      cuerpo.append(texto, h('div', { class: 'rec-codigo' }, l.snips ? crearVisor(l.snips, { sinAutor: true })
        : h('div', { class: 'rec-sin-codigo' },
          ...[['53', 'casos de la API'], ['47', 'casos de la interfaz, con teclado'], ['9', 'vistas con 100/100 en accesibilidad']]
            .map(([n, t]) => h('div', { class: 'rec-cifra' }, h('strong', null, n), h('span', null, t))))));
    }

    hoja.append(h('div', { class: 'recorrido' }, riel, cuerpo, h('div', { class: 'rec-pie' }, anterior, puntos, cuenta, siguiente)));
    ir(Math.min(estado.lamina || 0, total - 1));
  }

  /* ===================================================================
     PRUEBAS
     =================================================================== */
  function pintarPruebas(hoja) {
    const ruta = 'docs/evidencias/';
    const bat = [
      { id: 'api', titulo: 'API REST', datos: D.pruebas.api, como: 'bash docs/evidencias/prueba-api.sh', que: 'curl contra MySQL real: casos válidos, inválidos, anónimos, de rol insuficiente y tres intentos de inyección SQL.' },
      { id: 'spa', titulo: 'SPA de punta a punta', datos: D.pruebas.spa, como: 'node docs/evidencias/prueba-spa.js', que: 'Chrome sin ventana operado con Tab y Enter, sobre los nueve casos de uso y la consola del navegador.' },
      { id: 'lh', titulo: 'Lighthouse (accesibilidad)', datos: null, como: 'node docs/evidencias/auditar-accesibilidad.js', que: 'Nueve vistas, incluidas las que exigen sesión de cliente y de agente.' },
    ];
    let activa = 'api';
    const tarjetas = h('div', { class: 'baterias' });
    const detalle = h('div', { class: 'bateria-detalle' });

    const pintarDetalle = () => {
      vaciar(detalle);
      const b = bat.find((x) => x.id === activa);
      detalle.append(h('p', { class: 'bat-que' }, b.que), h('p', { class: 'bat-como' }, 'Se corre con ', h('code', null, b.como)));
      if (activa === 'lh') {
        detalle.append(h('div', { class: 'lh-lista' }, D.lighthouse.map((v) =>
          h('a', { class: 'lh-fila', href: '../' + ruta + 'lighthouse/' + v.vista + '.report.html', target: '_blank', rel: 'noopener' },
            h('span', { class: 'lh-n' }, String(v.puntaje)), h('span', null, v.vista), h('span', { class: 'lh-ir' }, 'Abrir informe completo'))
        )),
        h('h3', null, 'De 92 a 100: lo que había que corregir'),
        h('ul', { class: 'correcciones' }, C.correccionesLighthouse.map((t) => h('li', null, t))));
        return;
      }
      const casos = b.datos.casos;
      const secciones = [...new Set(casos.map((c) => c.seccion))];
      const filtro = h('select', { 'aria-label': 'Filtrar por grupo', onchange: (e) => pintarTabla(e.target.value) },
        h('option', { value: '' }, 'Todos los grupos (' + casos.length + ')'), secciones.map((s) => h('option', { value: s }, s)));
      const tabla = h('div', { class: 'casos', role: 'list' });
      const pintarTabla = (grupo) => {
        vaciar(tabla);
        casos.filter((c) => !grupo || c.seccion === grupo).forEach((c) => tabla.append(h('div', { class: 'caso-fila ' + (c.ok ? 'ok' : 'mal'), role: 'listitem' },
          h('span', { class: 'marca' }, c.ok ? 'OK' : 'FALLA'), h('span', { class: 'cn' }, '[' + String(c.n).padStart(2, '0') + ']'),
          h('span', { class: 'ct' }, c.titulo, c.detalle ? h('small', null, c.detalle) : null))));
      };
      pintarTabla('');
      detalle.append(filtro, tabla);
    };

    bat.forEach((b) => {
      const total = b.datos ? `${b.datos.ok}/${b.datos.total}` : `${D.lighthouse.filter((v) => v.puntaje === 100).length}/${D.lighthouse.length}`;
      tarjetas.append(h('button', { type: 'button', class: 'bateria', 'aria-pressed': String(b.id === activa),
        onclick: (e) => { activa = b.id; tarjetas.querySelectorAll('.bateria').forEach((x) => x.setAttribute('aria-pressed', String(x === e.currentTarget))); pintarDetalle(); } },
        h('strong', null, total), h('span', null, b.titulo)));
    });
    hoja.append(h('h1', null, 'Pruebas y evidencia'),
      h('p', { class: 'intro' }, 'Los números salen de los archivos de salida reales que están en docs/evidencias/. Se regeneran corriendo cada prueba contra la base importada desde cero.'),
      tarjetas, detalle);
    pintarDetalle();
  }

  /* ===================================================================
     ISO / IEC 25010
     =================================================================== */
  function pintarIso(hoja) {
    hoja.append(h('h1', null, 'Auditoría ISO/IEC 25010'),
      h('p', { class: 'intro' }, 'Las siete características, con el código que las sostiene. El detalle completo con archivo y línea está en docs/AUDITORIA-ISO-25010.md.'));
    const lista = h('div', { class: 'iso' });
    C.iso.forEach((it) => {
      const det = h('details', { class: 'iso-fila' },
        h('summary', null, h('span', { class: 'iso-n' }, String(it.n)), h('strong', null, it.nombre), h('span', { class: 'iso-ev' }, it.evidencia)));
      const cuerpo = h('div', { class: 'iso-cuerpo' });
      if (it.snips) cuerpo.append(crearVisor(it.snips));
      if (it.ir) cuerpo.append(h('button', { type: 'button', class: 'chico acento', onclick: () => irASeccion(it.ir) }, 'Ir a ' + C.secciones.find((s) => s.id === it.ir).nombre));
      det.append(cuerpo);
      lista.append(det);
    });
    hoja.append(lista);
  }

  /* ===================================================================
     REPOSITORIO
     =================================================================== */
  function pintarRepo(hoja) {
    const porAutor = {};
    D.commits.forEach((c) => { porAutor[c.autor] = (porAutor[c.autor] || 0) + 1; });
    const total = D.commits.length;

    hoja.append(h('h1', null, 'Arquitectura y repositorio'),
      h('h2', null, 'Capas desacopladas'),
      h('div', { class: 'capas' }, C.capas.map((c, i) => h('div', { class: 'capa' },
        h('strong', null, c.nombre), h('code', null, c.carpeta), h('span', null, c.detalle), h('em', null, c.autor)))),
      h('p', { class: 'intro' }, 'La vista habla con los controladores solo por HTTP y JSON. Los controladores usan los modelos; los modelos son los únicos que escriben SQL.'),

      h('h2', null, 'Reparto de commits en la rama ae4-tifas'),
      h('div', { class: 'reparto' }, Object.entries(porAutor).map(([a, n]) => h('div', { class: 'barra-autor' },
        h('span', null, corto(a)), h('div', { class: 'barra' }, h('i', { class: 'autor-' + corto(a), style: 'width:' + Math.round(n / total * 100) + '%' })), h('b', null, String(n))))),
      h('details', { class: 'commits' },
        h('summary', null, 'Ver los ' + total + ' commits'),
        h('div', { class: 'tabla-commits' }, D.commits.map((c) => h('div', { class: 'commit' },
          h('code', null, c.hash), h('span', { class: 'autor autor-' + corto(c.autor) }, corto(c.autor)), h('span', null, c.fecha), h('span', null, c.titulo))))),

      h('h2', null, 'Cómo se levanta en XAMPP'),
      h('ol', { class: 'pasos-lista' }, C.despliegue.map((t) => h('li', null, t))));
  }

  /* ===== teclado ===== */
  function atajos(ev) {
    const t = ev.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (dialogo.open || $('#ayuda-dialogo').open) return;
    if (/^[1-9]$/.test(ev.key) && C.secciones[Number(ev.key) - 1]) { irASeccion(C.secciones[Number(ev.key) - 1].id); ev.preventDefault(); return; }
    if (ev.key === 'v' || ev.key === 'V') { ciclarModo(); return; }
    if (ev.key === '?') { $('#ayuda-dialogo').showModal(); return; }
    if (estado.seccion === 'recorrido' && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') && !(t && t.closest && t.closest('.codigo'))) {
      const b = document.querySelectorAll('.rec-pie .chico'); (ev.key === 'ArrowRight' ? b[1] : b[0]).click(); ev.preventDefault(); return;
    }
    if (estado.seccion === 'casos' && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') && !(t && t.getAttribute && t.getAttribute('role') === 'tab')) {
      const i = TODOS.findIndex((c) => c.id === estado.caso);
      const j = (i + (ev.key === 'ArrowRight' ? 1 : -1) + TODOS.length) % TODOS.length;
      seleccionarCaso(TODOS[j].id, 0, { navegar: true });
      ev.preventDefault();
    }
  }
  document.addEventListener('keydown', atajos);

  /* ===== arranque ===== */
  const inicial = (location.hash || '').slice(1);
  irASeccion(C.secciones.some((s) => s.id === inicial) ? inicial : 'inicio');
})();
