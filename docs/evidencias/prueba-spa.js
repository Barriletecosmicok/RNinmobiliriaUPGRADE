/* =====================================================================
   RN Inmobiliaria — AE4 / TIFAS
   docs/evidencias/prueba-spa.js

   Prueba funcional de la Single Page Application con Chrome en modo
   headless. Recorre los casos de uso de punta a punta contra la API y la
   base de datos reales, y deja constancia de:
     · que la interfaz se opera con Tab y Enter, sin mouse,
     · que no aparece ningún error en la consola del navegador,
     · que cada vista muestra los datos que devuelve la API.

   Para correrlo:
     npm install puppeteer-core
     node docs/evidencias/prueba-spa.js
   (requiere el proyecto servido y Chrome instalado)
   ===================================================================== */
const puppeteer = require('puppeteer-core');

const BASE = process.env.BASE || 'http://localhost:8080/public/index.html';
const CHROME = process.env.CHROME_PATH || '/opt/google/chrome/chrome';

let numero = 0;
const resultados = [];

function registrar(descripcion, obtenido, esperado) {
  numero += 1;
  const paso = String(obtenido) === String(esperado);
  resultados.push(paso);
  const marca = paso ? 'OK   ' : 'FALLA';
  console.log(`${marca} [${String(numero).padStart(2, '0')}] ${descripcion}`);
  console.log(`        esperado: ${esperado}  |  obtenido: ${obtenido}`);
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/** Navega por la ruta y espera a que la vista termine de cargar. */
async function irA(page, hash) {
  await page.evaluate((h) => { window.location.hash = h; }, hash);
  await esperar(700);
}

/** Pulsa Tab hasta que el elemento con foco coincida con el selector. */
async function tabularHasta(page, selector, maximo = 40) {
  for (let i = 0; i < maximo; i += 1) {
    await page.keyboard.press('Tab');
    const llego = await page.evaluate(
      (sel) => document.activeElement !== null && document.activeElement.matches(sel),
      selector
    );
    if (llego) return i + 1;
  }
  return -1;
}

(async () => {
  const navegador = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  const page = await navegador.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  /* Se distinguen dos cosas que el navegador mezcla en la consola:
       · erroresJs: excepciones de JavaScript. Tienen que ser cero.
       · recursosFallidos: avisos de que un recurso respondió con un código
         de error. Varios son esperados, porque esta misma prueba fuerza un
         403 y un 400 a propósito para comprobar el control de acceso y la
         validación del servidor. */
  const erroresJs = [];
  const recursosFallidos = [];
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const texto = m.text();
    if (texto.includes('Failed to load resource')) recursosFallidos.push(texto);
    else erroresJs.push(texto);
  });
  page.on('pageerror', (e) => erroresJs.push(`pageerror: ${e.message}`));

  console.log('=====================================================================');
  console.log(' PRUEBA FUNCIONAL DE LA SPA — RN Inmobiliaria AE4');
  console.log(` Base: ${BASE}`);
  console.log(` Fecha: ${new Date().toLocaleString('es-AR')}`);
  console.log('=====================================================================\n');

  /* ---------------- 1. Portada y carga asíncrona (UC1) ---------------- */
  console.log('--- 1. PORTADA Y CARGA ASÍNCRONA (UC1) ------------------------------');
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await esperar(700);

  registrar('La portada es la vista visible al entrar',
    await page.evaluate(() => !document.getElementById('vista-inicio').hidden), true);

  registrar('Las tarjetas se generaron desde la API (no estaban en el HTML)',
    await page.evaluate(() => document.querySelectorAll('#grilla-inicio .card-propiedad').length), 3);

  registrar('La región aria-live informa el resultado del fetch',
    await page.evaluate(() => document.getElementById('estado-inicio').textContent.trim()),
    'Mostrando 3 de 3 propiedades.');

  registrar('El contenedor de respuesta tiene aria-live="polite"',
    await page.evaluate(() => document.getElementById('estado-inicio').getAttribute('aria-live')), 'polite');

  /* ---------------- 2. Operación por teclado (WCAG 2.1) ---------------- */
  console.log('\n--- 2. OPERACIÓN POR TECLADO ----------------------------------------');
  await page.evaluate(() => {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  });

  const pasosSalto = await tabularHasta(page, '.salto-contenido');
  registrar('El primer Tab llega al enlace "Saltar al contenido"', pasosSalto, 1);

  registrar('El enlace de salto se vuelve visible al recibir el foco',
    await page.evaluate(() => {
      const el = document.querySelector('.salto-contenido');
      return window.getComputedStyle(el).top !== '-100px';
    }), true);

  const pasosIngresar = await tabularHasta(page, 'a[data-ruta="acceso"]');
  registrar('Se llega al enlace "Ingresar" solo con Tab', pasosIngresar > 0, true);

  registrar('El elemento con foco muestra el anillo de :focus-visible',
    await page.evaluate(() => {
      const el = document.activeElement;
      return el.matches(':focus-visible') && window.getComputedStyle(el).outlineWidth !== '0px';
    }), true);

  /* ---------------- 3. Ingreso con Enter (UC7) ---------------- */
  console.log('\n--- 3. INGRESO DE UN CLIENTE CON TAB Y ENTER (UC7) ------------------');
  await page.keyboard.press('Enter');
  await esperar(700);

  registrar('Enter sobre "Ingresar" cambia a la vista de acceso',
    await page.evaluate(() => !document.getElementById('vista-acceso').hidden), true);

  registrar('El foco quedó en el título de la vista nueva',
    await page.evaluate(() => document.activeElement.id), 'titulo-acceso');

  registrar('El cambio de vista se anunció en la región aria-live',
    await page.evaluate(() => document.getElementById('anuncio-ruta').textContent), 'Sección: Tu cuenta');

  await tabularHasta(page, '#login-email');
  await page.keyboard.type('ana@rninmobiliaria.com');
  await page.keyboard.press('Tab');
  await page.keyboard.type('tierraroja26');
  const pasosBoton = await tabularHasta(page, '#form-login button[type="submit"]');
  registrar('Se llega al botón "Ingresar" del formulario con Tab', pasosBoton > 0, true);

  await page.keyboard.press('Enter');
  await esperar(1500);

  registrar('El servidor aceptó las credenciales y la alerta avisa el éxito',
    await page.evaluate(() => document.getElementById('auth-alerta').className.includes('exito')), true);

  registrar('VSDM: la audiencia pasó a usuario autenticado',
    await page.evaluate(() => document.documentElement.dataset.audiencia), 'usuario');

  registrar('VSDM: el menú ya no ofrece "Ingresar"',
    await page.evaluate(() => document.querySelector('li[data-vista="visitante"]').hidden), true);

  registrar('VSDM: el menú saluda al usuario con su nombre',
    await page.evaluate(() => document.querySelector('[data-usuario-nombre]').textContent), 'Ana');

  registrar('VSDM: el panel del agente no se ofrece a un cliente',
    await page.evaluate(() => document.querySelector('li[data-vista="agente"]').hidden), true);

  /* ---------------- 4. Filtro servidor y ficha (UC2, UC3) ---------------- */
  console.log('\n--- 4. CATÁLOGO, FILTRO Y FICHA (UC2, UC3) --------------------------');
  await irA(page, '#/propiedades');

  registrar('El catálogo muestra las propiedades publicadas',
    await page.evaluate(() => document.querySelectorAll('#grilla-catalogo .card-propiedad').length), 3);

  await page.evaluate(() => document.querySelector('[data-filtro-catalogo="casa"]').click());
  await esperar(800);

  registrar('El filtro "Casas" pide al servidor y devuelve 2 propiedades',
    await page.evaluate(() => document.querySelectorAll('#grilla-catalogo .card-propiedad').length), 2);

  registrar('El chip activo informa su estado con aria-pressed',
    await page.evaluate(() => document.querySelector('[data-filtro-catalogo="casa"]').getAttribute('aria-pressed')), 'true');

  await irA(page, '#/propiedad/1');

  registrar('La ficha muestra el título que vino de la base',
    await page.evaluate(() => document.querySelector('#detalle-propiedad h2').textContent),
    'Casa 3 ambientes con pileta en Villa Sarita');

  registrar('La ficha carga las 6 fotos de la propiedad',
    await page.evaluate(() => document.querySelectorAll('#detalle-propiedad .producto-galeria-principal img').length), 6);

  registrar('Toda foto tiene texto alternativo (WCAG 1.1.1)',
    await page.evaluate(() => [...document.querySelectorAll('#detalle-propiedad img')].every((i) => i.alt.trim() !== '')), true);

  registrar('La ficha ofrece el contacto por WhatsApp (UC5)',
    await page.evaluate(() => document.querySelector('#detalle-propiedad a[href*="wa.me"]') !== null), true);

  /* ---------------- 5. Favoritos (UC8) ---------------- */
  console.log('\n--- 5. FAVORITOS CONTRA LA BASE DE DATOS (UC8) ----------------------');
  await page.evaluate(() => document.querySelector('#detalle-propiedad .btn-favorito').click());
  await esperar(900);

  registrar('La propiedad 1 ya venía marcada, el clic la desmarca',
    await page.evaluate(() => document.querySelector('#detalle-propiedad .btn-favorito').getAttribute('aria-pressed')), 'false');

  await page.evaluate(() => document.querySelector('#detalle-propiedad .btn-favorito').click());
  await esperar(900);

  registrar('Un segundo clic la vuelve a guardar en el servidor',
    await page.evaluate(() => document.querySelector('#detalle-propiedad .btn-favorito').getAttribute('aria-pressed')), 'true');

  await irA(page, '#/favoritos');

  registrar('La vista de favoritos trae la propiedad guardada',
    await page.evaluate(() => document.querySelectorAll('#grilla-favoritos .card-propiedad').length), 1);

  /* ---------------- 6. Solicitud de compra (UC4) ---------------- */
  console.log('\n--- 6. SOLICITUD DE COMPRA (UC4) ------------------------------------');
  await irA(page, '#/comprar');

  registrar('El formulario precarga el nombre de la cuenta',
    await page.evaluate(() => document.getElementById('compra-nombre').value), 'Ana Benítez');

  registrar('El formulario precarga el e-mail de la cuenta',
    await page.evaluate(() => document.getElementById('compra-email').value), 'ana@rninmobiliaria.com');

  registrar('Las casillas de propiedades se generaron desde la API',
    await page.evaluate(() => document.querySelectorAll('#compra-propiedades input[type="checkbox"]').length), 3);

  await page.evaluate(() => {
    document.getElementById('compra-telefono').value = '+54 9 376 4170186';
    document.getElementById('compra-direccion').value = 'Av. Uruguay 1200, Villa Sarita';
    document.getElementById('compra-medio-pago').value = 'transferencia';
    document.querySelector('#compra-propiedades input[type="checkbox"]').checked = true;
  });
  await page.evaluate(() => document.querySelector('#form-compra button[type="submit"]').click());
  await esperar(1500);

  registrar('El servidor registró la solicitud y lo informa en pantalla',
    await page.evaluate(() => document.getElementById('compra-alerta').className.includes('exito')), true);

  registrar('El envío sin propiedades marcadas se rechaza con mensaje propio',
    await (async () => {
      await page.evaluate(() => document.querySelector('#form-compra button[type="submit"]').click());
      await esperar(900);
      return page.evaluate(() => document.getElementById('compra-propiedades-error').textContent.trim() !== '');
    })(), true);

  /* ---------------- 7. Control de acceso del cliente ---------------- */
  console.log('\n--- 7. CONTROL DE ACCESO: UN CLIENTE NO ES AGENTE -------------------');
  await irA(page, '#/panel');

  registrar('El cliente ve el aviso de acceso restringido, no el panel',
    await page.evaluate(() => {
      const restringido = document.querySelector('#vista-panel [data-vista="visitante usuario"]');
      const panel = document.querySelector('#vista-panel [data-vista="agente"]');
      return restringido.hidden === false && panel.hidden === true;
    }), true);

  registrar('Aunque fuerce la petición, el servidor responde 403',
    await page.evaluate(async () => {
      const r = await fetch('../api/propiedades.php?todas=1', { credentials: 'same-origin' });
      return r.status;
    }), 403);

  /* ---------------- 8. CRUD del agente (UC9) ---------------- */
  console.log('\n--- 8. CRUD DEL AGENTE (UC9) ----------------------------------------');
  await page.evaluate(() => document.querySelector('[data-accion="cerrar-sesion"]:not([hidden])').click());
  await esperar(1200);

  registrar('Al cerrar sesión la audiencia vuelve a visitante',
    await page.evaluate(() => document.documentElement.dataset.audiencia), 'visitante');

  await irA(page, '#/acceso');
  await page.evaluate(() => {
    document.getElementById('login-email').value = 'rodrigo@rninmobiliaria.com';
    document.getElementById('login-password').value = 'posadas2026';
    document.querySelector('#form-login button[type="submit"]').click();
  });
  await esperar(1600);

  registrar('El ingreso del agente cambia la audiencia a agente',
    await page.evaluate(() => document.documentElement.dataset.audiencia), 'agente');

  await irA(page, '#/panel');
  await esperar(900);

  registrar('El panel lista las propiedades, incluidas las dadas de baja',
    await page.evaluate(() => document.querySelectorAll('#cuerpo-tabla-panel tr').length), 3);

  registrar('El panel lista las solicitudes recibidas',
    await page.evaluate(() => document.querySelectorAll('#cuerpo-tabla-solicitudes tr').length >= 1), true);

  // Alta
  await page.evaluate(() => {
    document.getElementById('prop-titulo').value = 'Local comercial sobre avenida Mitre';
    document.getElementById('prop-tipo').value = 'local';
    document.getElementById('prop-barrio').value = 'Centro, Posadas';
    document.getElementById('prop-precio').value = '120000';
    document.getElementById('prop-superficie').value = '140';
    document.querySelector('#prop-fotos .foto-ruta').value = 'img/casa-centro-fachada.png';
    document.querySelector('#prop-fotos .foto-alt').value = 'Frente del local comercial';
    document.querySelector('#form-propiedad button[type="submit"]').click();
  });
  await esperar(1800);

  registrar('El alta de propiedad quedó registrada (ahora hay 4 filas)',
    await page.evaluate(() => document.querySelectorAll('#cuerpo-tabla-panel tr').length), 4);

  registrar('El formulario volvió al estado de alta después de guardar',
    await page.evaluate(() => document.getElementById('prop-enviar').textContent), 'Crear propiedad');

  // Edición
  await page.evaluate(() => {
    const botones = [...document.querySelectorAll('[data-editar]')];
    botones[botones.length - 1].click();
  });
  await esperar(900);

  registrar('"Editar" carga la propiedad en el formulario',
    await page.evaluate(() => document.getElementById('prop-titulo').value),
    'Local comercial sobre avenida Mitre');

  registrar('El botón de envío cambia a modo edición',
    await page.evaluate(() => document.getElementById('prop-enviar').textContent), 'Guardar cambios');

  await page.evaluate(() => {
    document.getElementById('prop-precio').value = '135000';
    document.querySelector('#form-propiedad button[type="submit"]').click();
  });
  await esperar(1800);

  registrar('La modificación se guardó con el precio nuevo',
    await page.evaluate(() => {
      const filas = [...document.querySelectorAll('#cuerpo-tabla-panel tr')];
      return filas.some((f) => f.textContent.includes('135.000'));
    }), true);

  // Validación del servidor
  await page.evaluate(() => {
    document.getElementById('prop-titulo').value = 'ab';
    document.getElementById('prop-barrio').value = '';
    document.getElementById('prop-precio').value = '0';
    document.getElementById('prop-superficie').value = '0';
    document.querySelector('#form-propiedad button[type="submit"]').click();
  });
  await esperar(1400);

  registrar('El servidor rechaza datos inválidos y los marca campo por campo',
    await page.evaluate(() => document.getElementById('prop-titulo').getAttribute('aria-invalid')), 'true');

  // Baja
  page.on('dialog', async (d) => { await d.accept(); });
  await page.evaluate(() => {
    document.querySelector('[data-accion="cancelar-edicion"]').click();
    const botones = [...document.querySelectorAll('[data-eliminar]')];
    botones[botones.length - 1].click();
  });
  await esperar(2000);

  registrar('La baja eliminó la propiedad (vuelven a ser 3 filas)',
    await page.evaluate(() => document.querySelectorAll('#cuerpo-tabla-panel tr').length), 3);

  /* ---------------- 9. Ruta inexistente ---------------- */
  console.log('\n--- 9. RUTA INEXISTENTE ---------------------------------------------');
  await irA(page, '#/esta-ruta-no-existe');

  registrar('El router muestra la vista de página no encontrada',
    await page.evaluate(() => !document.getElementById('vista-404').hidden), true);

  /* ---------------- 10. Consola limpia ---------------- */
  console.log('\n--- 10. CONSOLA DEL NAVEGADOR ---------------------------------------');
  registrar('No hubo ninguna excepción de JavaScript en toda la sesión',
    erroresJs.length === 0 ? 0 : erroresJs.join(' | '), 0);

  console.log(`\n        Recursos con código de error (${recursosFallidos.length}):`);
  console.log('        son los 403 y 400 que esta prueba provoca a propósito,');
  console.log('        más Google Fonts si el entorno no tiene salida a internet.');

  await navegador.close();

  const pasaron = resultados.filter(Boolean).length;
  console.log('\n=====================================================================');
  console.log(` RESULTADO: ${pasaron} de ${resultados.length} casos correctos`);
  console.log('=====================================================================');
  process.exit(pasaron === resultados.length ? 0 : 1);
})();
