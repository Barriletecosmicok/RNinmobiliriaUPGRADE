#!/usr/bin/env python3
"""
Genera defensa/datos.js a partir de los archivos REALES del repositorio.

Nada de lo que muestra la presentación se escribe a mano: cada fragmento de
código se corta del archivo con un patrón de inicio y otro de fin, y se guarda
con su archivo y su número de línea. Los resultados de las pruebas se leen de
los .txt de docs/evidencias/ y el reparto de commits sale de `git log`.

Uso (desde la raíz del repo):   python3 defensa/generar.py
Si un patrón deja de encontrarse (porque alguien movió el código), el script
falla y dice cuál; así la presentación nunca muestra algo que ya no existe.
"""
import json, re, subprocess, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
COMENTARIO = ('/*', '*', '//', '--', '<!--')

# clave: (archivo, inicio, fin | cantidad de líneas | None = hasta el final, opciones)
S = {}
def snip(clave, archivo, inicio, fin=None, **op):
    S[clave] = (archivo, inicio, fin, op)

# ----------------------------- HTML -----------------------------------
snip('h_tema',      'public/index.html', r'data-accion="alternar-tema"', 4)
snip('h_menu',      'public/index.html', r'<li data-vista="usuario agente" hidden><a href="#/favoritos"', 5, antes=1)
snip('h_filtros',   'public/index.html', r'data-filtro-catalogo', 6, antes=2)
snip('h_login',     'public/index.html', r'id="form-login"', 14)
snip('h_registro',  'public/index.html', r'id="form-registro"', 16)
snip('h_compra',    'public/index.html', r'id="form-compra"', 12)
snip('h_propiedad', 'public/index.html', r'id="form-propiedad"', 12)
snip('h_visor',     'public/index.html', r'<dialog class="visor"', 14, antes=0)
snip('h_salto',     'public/index.html', r'salto-contenido', 2)
snip('h_live',      'public/index.html', r'<[a-z]+ [^>]*aria-live="polite"', 3, antes=0)
# ----------------------------- JS -------------------------------------
snip('j_crear',     'public/js/app.js', r'^  function crear\(', r'^  function vaciar')
snip('j_pedir',     'public/js/app.js', r'^  async function pedir\(', r'^  /\* =+$')
snip('j_tema',      'public/js/app.js', r'^  function alternarTema', r'^  async function sincronizarSesion')
snip('j_sesion',    'public/js/app.js', r'^  async function sincronizarSesion', r'^  function audiencia')
snip('j_vista',     'public/js/app.js', r'^  function aplicarVista', r'^  async function cerrarSesion')
snip('j_logout',    'public/js/app.js', r'^  async function cerrarSesion', r'^  function crearBotonFavorito')
snip('j_btnfav',    'public/js/app.js', r'^  function crearBotonFavorito', r'^  function pintarFavoritos')
snip('j_fav',       'public/js/app.js', r'^  async function alternarFavorito', r'^  function mostrarFotoDelVisor')
snip('j_visor',     'public/js/app.js', r'^  function abrirVisor', r'^  function moverVisor')
snip('j_filtrar',   'public/js/app.js', r'^  function filtrarPortada', r'^  function alternarResaltado')
snip('j_catalogo',  'public/js/app.js', r'^  async function cargarCatalogo', r'^  async function cargarFicha')
snip('j_ficha',     'public/js/app.js', r'^  async function cargarFicha', 48)
snip('j_wsp',       'public/js/app.js', r"const whatsapp = crear\('a'", 6, antes=1)
snip('j_login',     'public/js/app.js', r'^  async function enviarLogin', r'^  async function enviarRegistro')
snip('j_registro',  'public/js/app.js', r'^  async function enviarRegistro', r'^  async function cargarPropiedadesParaCompra')
snip('j_compra',    'public/js/app.js', r'^  async function enviarCompra', r'^  async function cargarFavoritos')
snip('j_favs',      'public/js/app.js', r'^  async function cargarFavoritos', r'^  function agregarFilaFoto')
snip('j_prop',      'public/js/app.js', r'^  async function enviarPropiedad', r'^  async function eliminarPropiedad')
snip('j_elim',      'public/js/app.js', r'^  async function eliminarPropiedad', r'^  function pintarTablaPanel')
snip('j_estado',    'public/js/app.js', r'^  async function cambiarEstadoSolicitud', r'^  async function cargarPanel')
snip('j_ruta',      'public/js/app.js', r'^  async function atenderRuta', r'^  function registrarEventos')
snip('j_deleg',     'public/js/app.js', r"document\.addEventListener\('click', \(evento\)", r"// El cambio de estado de una solicitud", antes=3)
# ----------------------------- PHP: config ----------------------------
snip('c_conexion',  'config/conexion.php', r'^final class Conexion', None)
snip('c_respuesta', 'config/respuesta.php', r'^function responder', r'^function exito')
snip('c_iniciar',   'config/sesion.php', r'^function iniciarSesionSegura', r'^function abrirSesionUsuario')
snip('c_abrir',     'config/sesion.php', r'^function abrirSesionUsuario', r'^function cerrarSesionUsuario')
snip('c_sesion',    'config/sesion.php', r'^function exigirSesion', r'^function exigirRol')
snip('c_rol',       'config/sesion.php', r'^function exigirRol', None)
# ----------------------------- PHP: api -------------------------------
snip('a_login',     'api/login.php', r'^declare', None)
snip('a_registro',  'api/registro.php', r'^declare', None)
snip('a_logout',    'api/logout.php', r'^declare', None)
snip('a_sesion',    'api/sesion.php', r'^declare', None)
snip('a_fav',       'api/favoritos.php', r'^declare', None)
snip('p_get',       'api/propiedades.php', r'^\s*/\* =+ GET ', r'^\s*/\* =+ POST ')
snip('p_post',      'api/propiedades.php', r'^\s*/\* =+ POST ', r'^\s*/\* =+ PUT ')
snip('p_put',       'api/propiedades.php', r'^\s*/\* =+ PUT ', r'^\s*/\* =+ DELETE ')
snip('p_delete',    'api/propiedades.php', r'^\s*/\* =+ DELETE ', None)
snip('s_post',      'api/solicitudes.php', r'^\s*/\* =+ POST ', r'^\s*/\* =+ PATCH ')
snip('s_patch',     'api/solicitudes.php', r'^\s*/\* =+ PATCH ', None)
# ----------------------------- PHP: modelos ---------------------------
snip('m_listar',    'models/PropiedadModel.php', r'private const COLUMNAS', r'private const LISTAR_ACTIVAS_POR_TIPO')
snip('m_buscar',    'models/PropiedadModel.php', r'public function buscarPorId', r'public function existeSlug')
snip('m_crear',     'models/PropiedadModel.php', r'public function crear\(array \$datos, array \$fotos', r'public function actualizar')
snip('m_eliminar',  'models/PropiedadModel.php', r'public function eliminar', r'^    private function|^    public function \w+\(', antes=0)
snip('m_fav_add',   'models/FavoritoModel.php', r'public function agregar', r'public function quitar')
snip('m_sol_crear', 'models/SolicitudModel.php', r'public function crear\(array \$datos, array \$propiedadIds', r'public function listarDeUsuario')
snip('m_sol_estado','models/SolicitudModel.php', r'public function cambiarEstado', 10)
snip('m_usr_buscar','models/UsuarioModel.php', r'public function buscarPorEmail', r'public function buscarPorId')
snip('m_usr_crear', 'models/UsuarioModel.php', r'public function crear\(string', None)
# ----------------------------- SQL ------------------------------------
for t in ('usuarios', 'propiedades', 'fotos', 'favoritos', 'solicitudes', 'solicitud_propiedad'):
    snip('t_' + t, 'database/rn_inmobiliaria.sql', r'^CREATE TABLE ' + t + r'\b', r'^\) ENGINE', fin_incluido=True)
# ----------------------------- CSS ------------------------------------
snip('x_foco',      'public/css/estilos.css', r'^a:focus-visible', 14)
snip('x_lectores',  'public/css/estilos.css', r'^\.solo-lectores', 12)
snip('x_movimiento','public/css/estilos.css', r'^@media \(prefers-reduced-motion', 3)

def leer(archivo):
    return (RAIZ / archivo).read_text(encoding='utf-8', errors='replace').split('\n')

def cortar(clave, archivo, inicio, fin, op):
    L = leer(archivo)
    ini = next((i for i, l in enumerate(L) if re.search(inicio, l)), None)
    if ini is None:
        sys.exit(f'ERROR [{clave}]: no encuentro el inicio /{inicio}/ en {archivo}')
    if isinstance(fin, int):
        fi = min(len(L), ini + fin)
    elif fin is None:
        fi = len(L)
    else:
        fi = next((i for i in range(ini + 1, len(L)) if re.search(fin, L[i])), None)
        if fi is None:
            sys.exit(f'ERROR [{clave}]: no encuentro el fin /{fin}/ en {archivo}')
        if op.get('fin_incluido'):
            fi += 1
    ini -= op.get('antes', 0)
    # Si arriba hay un comentario de documentación pegado, se incluye.
    if 'antes' not in op:
        while ini > 0 and L[ini - 1].strip() and L[ini - 1].strip().startswith(('/**', '*', '//')):
            ini -= 1
    trozo = L[ini:fi]
    while trozo and (not trozo[-1].strip() or trozo[-1].strip().startswith(COMENTARIO)) and not op.get('fin_incluido'):
        trozo.pop()
    while trozo and not trozo[-1].strip():
        trozo.pop()
    return ini + 1, ini + len(trozo), '\n'.join(trozo)

def git(*args):
    return subprocess.run(['git', '-C', str(RAIZ), *args], capture_output=True, text=True).stdout.strip()

def autor_de(archivo):
    salida = git('log', '--reverse', '--format=%an', 'main..HEAD', '--', archivo).split('\n')
    return salida[0] if salida and salida[0] else ''

def lenguaje(archivo):
    return {'.php': 'php', '.js': 'js', '.html': 'html', '.css': 'css', '.sql': 'sql'}[Path(archivo).suffix]

datos = {'snippets': {}, 'pruebas': {}, 'commits': [], 'lighthouse': []}
for clave, (archivo, inicio, fin, op) in S.items():
    d, h, codigo = cortar(clave, archivo, inicio, fin, op)
    datos['snippets'][clave] = {'archivo': archivo, 'desde': d, 'hasta': h, 'lenguaje': lenguaje(archivo),
                                'autor': autor_de(archivo), 'codigo': codigo}

# ---------- pruebas: se leen de las salidas reales -----------
def pruebas(nombre):
    texto = (RAIZ / 'docs/evidencias' / nombre).read_text(encoding='utf-8', errors='replace')
    casos, seccion = [], ''
    lineas = texto.split('\n')
    for i, l in enumerate(lineas):
        m = re.match(r'^--- (.+?) -+$', l)
        if m: seccion = m.group(1); continue
        m = re.match(r'^(OK|FALLA)\s+\[(\d+)\]\s+(.*?)(?:\s{2,}esperado (\S+) / obtenido (\S+))?\s*$', l)
        if m:
            det = ''
            if m.group(4) is None and i + 1 < len(lineas) and 'esperado:' in lineas[i + 1]:
                det = lineas[i + 1].strip()
            elif m.group(4):
                det = f'esperado {m.group(4)} / obtenido {m.group(5)}'
            casos.append({'n': int(m.group(2)), 'ok': m.group(1) == 'OK', 'titulo': m.group(3).strip(),
                          'seccion': seccion, 'detalle': det})
    resumen = re.search(r'RESULTADO: (\d+) de (\d+)', texto)
    return {'casos': casos, 'ok': sum(c['ok'] for c in casos), 'total': len(casos),
            'resumen': resumen.group(0).strip() if resumen else f'FIN DE LAS PRUEBAS — {len(casos)} casos'}
datos['pruebas']['api'] = pruebas('salida-prueba-api.txt')
datos['pruebas']['spa'] = pruebas('salida-prueba-spa.txt')

for l in (RAIZ / 'docs/evidencias/salida-lighthouse.txt').read_text(encoding='utf-8', errors='replace').split('\n'):
    m = re.match(r'^\s+(\S+-\S+)\s+(\d+)/100', l)
    if m: datos['lighthouse'].append({'vista': m.group(1), 'puntaje': int(m.group(2))})

for l in git('log', '--reverse', '--format=%h|%an|%ad|%s', '--date=format:%d/%m/%Y', 'main..HEAD').split('\n'):
    h, a, f, s = l.split('|', 3)
    datos['commits'].append({'hash': h, 'autor': a, 'fecha': f, 'titulo': s})

salida = RAIZ / 'defensa' / 'datos.js'
salida.write_text('/* GENERADO por defensa/generar.py. No editar a mano. */\nwindow.DATOS = ' +
                  json.dumps(datos, ensure_ascii=False, indent=1) + ';\n', encoding='utf-8')

print(f"{len(datos['snippets'])} fragmentos | API {datos['pruebas']['api']['ok']}/{datos['pruebas']['api']['total']} | "
      f"SPA {datos['pruebas']['spa']['ok']}/{datos['pruebas']['spa']['total']} | "
      f"Lighthouse {len(datos['lighthouse'])} vistas | {len(datos['commits'])} commits")
if '--lista' in sys.argv:
    for k, v in datos['snippets'].items():
        n = v['hasta'] - v['desde'] + 1
        print(f"{k:13s} {v['archivo']:30s} {v['desde']:>5}-{v['hasta']:<5} ({n:>3} líneas) {v['autor']}")
