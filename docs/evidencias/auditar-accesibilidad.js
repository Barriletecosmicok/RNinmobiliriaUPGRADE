/* =====================================================================
   RN Inmobiliaria — AE4 / TIFAS
   docs/evidencias/auditar-accesibilidad.js

   Corre la auditoría de Accesibilidad de Lighthouse sobre cada vista de la
   SPA y guarda el reporte de cada una. Las vistas que exigen sesión se
   auditan pasándole a Lighthouse la cookie PHPSESSID de un usuario real,
   así se miden también el panel del agente y los favoritos del cliente.

   Para correrlo:
     npm install -g lighthouse
     node docs/evidencias/auditar-accesibilidad.js
   ===================================================================== */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE || 'http://localhost:8080';
const SPA = `${BASE}/public/index.html`;
const SALIDA = path.join(__dirname, 'lighthouse');
process.env.CHROME_PATH = process.env.CHROME_PATH || '/opt/google/chrome/chrome';

/** Inicia sesión por la API y devuelve la cookie de sesión de PHP. */
function cookieDeSesion(email, password) {
  const salida = execFileSync('curl', [
    '-s', '-i', '-X', 'POST', `${BASE}/api/login.php`,
    '-H', 'Content-Type: application/json',
    '-d', JSON.stringify({ email, password }),
  ]).toString();
  const encontrado = salida.match(/Set-Cookie:\s*(PHPSESSID=[^;]+)/i);
  if (!encontrado) throw new Error(`No se pudo iniciar sesión con ${email}`);
  return encontrado[1];
}

const cliente = cookieDeSesion('ana@rninmobiliaria.com', 'tierraroja26');
const agente = cookieDeSesion('rodrigo@rninmobiliaria.com', 'posadas2026');

const casos = [
  ['inicio-visitante',   '#/inicio',      null],
  ['catalogo-visitante', '#/propiedades', null],
  ['ficha-visitante',    '#/propiedad/1', null],
  ['acceso-visitante',   '#/acceso',      null],
  ['comprar-cliente',    '#/comprar',     cliente],
  ['favoritos-cliente',  '#/favoritos',   cliente],
  ['cuenta-cliente',     '#/acceso',      cliente],
  ['panel-agente',       '#/panel',       agente],
  ['catalogo-agente',    '#/propiedades', agente],
];

fs.mkdirSync(SALIDA, { recursive: true });

console.log('=====================================================================');
console.log(' AUDITORÍA DE ACCESIBILIDAD — Google Lighthouse');
console.log(` SPA: ${SPA}`);
console.log(` Fecha: ${new Date().toLocaleString('es-AR')}`);
console.log('=====================================================================\n');

const puntajes = [];

for (const [nombre, hash, cookie] of casos) {
  const destino = path.join(SALIDA, nombre);
  const argumentos = [
    `${SPA}${hash}`,
    '--only-categories=accessibility',
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage',
    '--output=json', '--output=html', `--output-path=${destino}`, '--quiet',
  ];
  if (cookie) argumentos.push(`--extra-headers=${JSON.stringify({ Cookie: cookie })}`);

  execFileSync('lighthouse', argumentos, { stdio: 'ignore' });

  const reporte = JSON.parse(fs.readFileSync(`${destino}.report.json`, 'utf8'));
  const puntaje = Math.round(reporte.categories.accessibility.score * 100);
  const fallidas = Object.values(reporte.audits).filter(
    (a) => a.score !== null && a.score < 1 && a.scoreDisplayMode === 'binary'
  );

  puntajes.push(puntaje);
  console.log(`  ${nombre.padEnd(20)} ${String(puntaje).padStart(3)}/100   ${fallidas.length === 0 ? 'sin auditorías fallidas' : 'FALLAS: ' + fallidas.map((a) => a.id).join(', ')}`);
}

const minimo = Math.min(...puntajes);
console.log('\n=====================================================================');
console.log(` ${puntajes.filter((p) => p === 100).length} de ${puntajes.length} vistas en 100/100 — puntaje más bajo: ${minimo}`);
console.log(' Reportes HTML en docs/evidencias/lighthouse/');
console.log('=====================================================================');
process.exit(minimo === 100 ? 0 : 1);
