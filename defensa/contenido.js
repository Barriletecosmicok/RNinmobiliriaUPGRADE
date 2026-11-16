/* Textos de la presentación. El código y los resultados NO están acá: vienen
   de datos.js, que se genera desde los archivos reales (defensa/generar.py). */
window.CONTENIDO = {

  secciones: [
    { id: 'inicio',   nombre: 'Inicio' },
    { id: 'casos',    nombre: 'Casos de uso' },
    { id: 'recorrido', nombre: 'El recorrido' },
    { id: 'pruebas',  nombre: 'Pruebas' },
    { id: 'iso',      nombre: 'ISO 25010' },
    { id: 'repo',     nombre: 'Repositorio' },
  ],

  franjas: {
    inicio:   'Qué se implementó: la evolución de la maqueta estática a una SPA con API REST y base de datos. Qué resuelve: las tres limitaciones que dejó la AE2.',
    casos:    'Tocá cualquier botón o formulario de la página: el panel muestra el HTML, el fetch, el endpoint y la consulta SQL de esa función, con archivo y línea.',
    recorrido: 'Qué se implementó: el camino completo de un dato, desde la base hasta la pantalla. Qué resuelve: la persistencia real, la seguridad (OWASP) y la accesibilidad (WCAG 2.1) que pedía la AE4.',
    pruebas:  'Qué se implementó: tres baterías de prueba que corren contra la base real. Qué resuelve: mostrar con evidencia que la API, la SPA y la accesibilidad funcionan.',
    iso:      'Qué se implementó: la auditoría de las siete características de calidad. Cada fila apunta al código que la sostiene.',
    repo:     'Qué se implementó: arquitectura en capas, historial de Git repartido entre los tres y guía de despliegue.',
  },

  /* ------------------------------------------------------------------ */
  /* Casos de uso. Cada variante es una cadena completa de punta a punta. */
  /* ------------------------------------------------------------------ */
  casos: [
    {
      id: 'uc1', rotulo: 'UC1', titulo: 'Consultar el catálogo', ruta: '#/propiedades',
      resuelve: 'El catálogo sale de la base de datos y no de un JSON del navegador.',
      req: 'fetch con async/await · JSON con código 200 · PDO preparado',
      variantes: [{
        nombre: 'Listado',
        pasos: { html: ['h_filtros'], js: ['j_catalogo'], api: ['p_get'], datos: ['m_listar', 't_propiedades', 't_fotos'] },
        nota: 'Propiedades y fotos viajan en una sola consulta con LEFT JOIN; el modelo las reagrupa en PHP.',
      }],
    },
    {
      id: 'uc2', rotulo: 'UC2', titulo: 'Filtrar por tipo', ruta: '#/propiedades',
      resuelve: 'El filtro del catálogo se resuelve en SQL, con el tipo como parámetro.',
      req: 'PDO preparado con marcador nombrado · validación en el servidor (400 si el tipo no existe)',
      variantes: [{
        nombre: 'Por tipo',
        pasos: { html: ['h_filtros'], js: ['j_catalogo'], api: ['p_get'], datos: ['m_listar'] },
        nota: 'Probalo: tocá "Casas" o "Terrenos" en la página y mirá el pedido en la pestaña En vivo.',
      }],
    },
    {
      id: 'uc3', rotulo: 'UC3', titulo: 'Ver la ficha', ruta: '#/propiedad/1',
      resuelve: 'La ficha se arma con lo que devuelve la API para ese id; si no existe, la API responde 404.',
      req: 'JSON con códigos 200 y 404 · render con textContent',
      variantes: [{
        nombre: 'Ficha',
        pasos: { js: ['j_ficha'], api: ['p_get'], datos: ['m_buscar'] },
        nota: 'La vista de la ficha no está escrita en el HTML: la construye app.js con los datos de la respuesta.',
      }],
    },
    {
      id: 'uc4', rotulo: 'UC4', titulo: 'Solicitud de compra', ruta: '#/comprar',
      resuelve: 'El formulario de compra por fin guarda algo: antes tenía action="#" y los datos no iban a ningún lado.',
      req: 'POST con 201 · sesión obligatoria (401) · transacción con rollBack',
      variantes: [{
        nombre: 'Enviar solicitud',
        pasos: { html: ['h_compra'], js: ['j_compra'], api: ['s_post'], datos: ['m_sol_crear', 't_solicitudes', 't_solicitud_propiedad'] },
        nota: 'La solicitud y sus propiedades se guardan en dos tablas dentro de una transacción: o entra todo o no entra nada.',
      }],
    },
    {
      id: 'uc5', rotulo: 'UC5', titulo: 'Contactar por WhatsApp', ruta: '#/propiedad/1',
      resuelve: 'Es un enlace a wa.me con el mensaje armado; no pasa por el servidor.',
      req: 'Conservado de la AE1 · rel="noopener" en el enlace externo',
      variantes: [{
        nombre: 'Enlace',
        pasos: { js: ['j_wsp'] },
        nota: 'Este caso de uso no tiene backend: no hace fetch ni toca la base.',
      }],
    },
    {
      id: 'uc6', rotulo: 'UC6', titulo: 'Registrarse', ruta: '#/acceso',
      resuelve: 'La contraseña se guarda como hash BCRYPT; en la AE2 quedaba en texto plano dentro de un JSON.',
      req: 'password_hash con BCRYPT · VARCHAR(255) · 201 / 400 / 409',
      variantes: [{
        nombre: 'Registro',
        pasos: { html: ['h_registro'], js: ['j_registro'], api: ['a_registro'], datos: ['m_usr_crear', 't_usuarios'] },
        nota: 'Pestaña "Crear cuenta". El 409 aparece si el e-mail ya existe.',
      }],
    },
    {
      id: 'uc7', rotulo: 'UC7', titulo: 'Iniciar y cerrar sesión', ruta: '#/acceso',
      resuelve: 'La sesión vive en el servidor ($_SESSION). Ocultar un botón en el navegador ya no es la defensa.',
      req: 'password_verify · session_regenerate_id(true) · mismo error para e-mail y clave',
      variantes: [
        {
          nombre: 'Iniciar sesión',
          pasos: { html: ['h_login'], js: ['j_login'], api: ['a_login'], datos: ['m_usr_buscar', 'c_abrir'] },
          nota: 'Cuentas de prueba: ana@… (cliente) y rodrigo@… (agente). Están en el README.',
        },
        {
          nombre: 'Cerrar sesión',
          pasos: { js: ['j_logout'], api: ['a_logout'], datos: ['c_iniciar'] },
          nota: 'logout.php destruye la sesión en el servidor; la cookie sola ya no sirve.',
        },
      ],
    },
    {
      id: 'uc8', rotulo: 'UC8', titulo: 'Favoritos', ruta: '#/propiedades',
      resuelve: 'Los favoritos se guardan por usuario en la base; en la AE2 vivían en el navegador.',
      req: 'Sesión obligatoria (401) · el usuario sale de $_SESSION · clave UNIQUE',
      variantes: [
        {
          nombre: 'Guardar o quitar',
          pasos: { js: ['j_btnfav', 'j_fav'], api: ['a_fav'], datos: ['m_fav_add', 't_favoritos'] },
          nota: 'Tocá el corazón de una tarjeta con sesión iniciada. Sin sesión, la API responde 401.',
        },
        {
          nombre: 'Mis favoritos',
          ruta: '#/favoritos',
          pasos: { js: ['j_favs'], api: ['a_fav'], datos: ['t_favoritos'] },
          nota: 'Requiere sesión: entrá como cliente.',
        },
      ],
    },
    {
      id: 'uc9', rotulo: 'UC9', titulo: 'Gestionar propiedades (agente)', ruta: '#/panel',
      resuelve: 'Es el CRUD completo y el único caso de uso nuevo de la AE4. Solo el rol agente puede escribir.',
      req: 'POST 201 · PUT 200 · DELETE · exigirRol("agente") → 403 si sos cliente',
      variantes: [
        {
          nombre: 'Crear y editar',
          pasos: { html: ['h_propiedad'], js: ['j_prop'], api: ['p_post', 'p_put'], datos: ['m_crear', 't_propiedades'] },
          nota: 'Entrá como agente. "Editar" carga la fila en el mismo formulario y el envío pasa a ser un PUT.',
        },
        {
          nombre: 'Eliminar',
          pasos: { js: ['j_elim'], api: ['p_delete'], datos: ['m_eliminar'] },
          nota: 'Pide confirmación antes de mandar el DELETE.',
        },
        {
          nombre: 'Estado de una solicitud',
          pasos: { js: ['j_estado'], api: ['s_patch'], datos: ['m_sol_estado'] },
          nota: 'Cambiá el desplegable de estado en la tabla de solicitudes: sale un PATCH.',
        },
      ],
    },
  ],

  /* Funciones de interfaz que no son un caso de uso pero también se explican. */
  extras: [
    { id: 'x-visor', rotulo: 'Visor', titulo: 'Visor de fotos', ruta: '#/propiedad/1',
      resuelve: 'Un <dialog> nativo: el navegador atrapa el foco y cierra con Esc sin librerías.',
      req: 'Operable solo con teclado · WCAG 2.1',
      variantes: [{ nombre: 'Visor', pasos: { html: ['h_visor'], js: ['j_visor'] }, nota: 'Sin backend: solo interfaz.' }] },
    { id: 'x-tema', rotulo: 'Tema', titulo: 'Modo claro y oscuro', ruta: '#/inicio',
      resuelve: 'Respeta la preferencia del sistema y deja elegir; el botón informa su estado con aria-pressed.',
      req: 'Accesibilidad · contraste verificado en ambos temas',
      variantes: [{ nombre: 'Tema', pasos: { html: ['h_tema'], js: ['j_tema'] }, nota: 'Sin backend: solo interfaz.' }] },
    { id: 'x-portada', rotulo: 'Portada', titulo: 'Filtro visual de la portada', ruta: '#/inicio',
      resuelve: 'Es el filtro de la Opción 6 de la AE2, conservado: oculta tarjetas ya cargadas sin pedir nada al servidor.',
      req: 'Evolución de la AE2 · aria-pressed en los botones',
      variantes: [{ nombre: 'Filtro', pasos: { js: ['j_filtrar'] }, nota: 'Sin backend: el filtro del catálogo (UC2) sí va al servidor; este es solo visual.' }] },
    { id: 'x-ruta', rotulo: 'Router', titulo: 'Navegación entre vistas', ruta: '#/inicio',
      resuelve: 'Un solo index.html. El router lee el hash, muestra la vista y mueve el foco al título.',
      req: 'SPA · aria-live anuncia el cambio de vista',
      variantes: [{ nombre: 'Router', pasos: { html: ['h_menu'], js: ['j_vista', 'j_ruta'] }, nota: 'Cambia el menú según la sesión: visitante, cliente o agente.' }] },
  ],

  /* ------------------------------------------------------------------ */
  /* El recorrido: láminas que siguen un solo hilo, de la base a la      */
  /* pantalla. Cada una tiene una idea, el requisito que resuelve y su   */
  /* código real.                                                        */
  /* ------------------------------------------------------------------ */
  etapas: [
    { id: 'base',      nombre: 'Base de datos' },
    { id: 'servidor',  nombre: 'Servidor' },
    { id: 'navegador', nombre: 'Navegador' },
    { id: 'calidad',   nombre: 'Calidad' },
  ],
  recorrido: [
    { capa: 'base', titulo: 'Los datos viven en una base',
      idea: 'Antes el catálogo era un archivo dentro del navegador. Ahora hay seis tablas en MySQL y todos los navegadores ven lo mismo.',
      resuelve: 'Persistencia real. Claves foráneas entre las tablas, y una clave UNIQUE en favoritos para que no se repitan.',
      snips: ['t_usuarios', 't_propiedades', 't_fotos', 't_favoritos', 't_solicitudes', 't_solicitud_propiedad'] },
    { capa: 'servidor', titulo: 'Una sola conexión, con cuidado',
      idea: 'El servidor se conecta una vez por pedido. Si algo falla, corta con un error claro en vez de seguir a medias.',
      resuelve: 'PDO con EMULATE_PREPARES apagado: la base recibe los parámetros por separado de la consulta.',
      snips: ['c_conexion'] },
    { capa: 'servidor', titulo: 'Las consultas viajan preparadas',
      idea: 'Lo que escribe la persona nunca se pega dentro del SQL. Va aparte, con un nombre como :email.',
      resuelve: 'OWASP A03, inyección SQL. Las pruebas de la API incluyen tres intentos de inyección y los tres fallan.',
      snips: ['m_usr_buscar', 'm_listar'] },
    { capa: 'servidor', titulo: 'Una sola forma de responder',
      idea: 'Todos los endpoints contestan en JSON y con el código HTTP que corresponde a lo que pasó.',
      resuelve: 'Una función arma la cabecera, el código y el cuerpo. No hay dos endpoints que respondan distinto.',
      snips: ['c_respuesta'] },
    { capa: 'servidor', titulo: 'El catálogo y el CRUD',
      idea: 'Ver propiedades es público. Crearlas, editarlas y borrarlas es solo para el agente.',
      resuelve: 'Los cuatro verbos HTTP sobre un mismo recurso, con validación en el servidor.',
      snips: ['p_get', 'p_post', 'p_put', 'p_delete'], uc: 'uc9' },
    { capa: 'servidor', titulo: 'Quién sos: login y sesión',
      idea: 'El servidor compara la clave con password_verify y, al entrar, cambia el número de sesión.',
      resuelve: 'OWASP A07. Cookie HttpOnly y SameSite, session_regenerate_id(true), y el mismo mensaje si falla el e-mail o la clave.',
      snips: ['a_login', 'c_abrir', 'c_iniciar'], uc: 'uc7' },
    { capa: 'servidor', titulo: 'Las claves no se guardan',
      idea: 'Al registrarse se guarda un hash BCRYPT, no la clave. Si el e-mail ya existe, el servidor contesta 409.',
      resuelve: 'OWASP A02. La columna es VARCHAR(255) para que el hash entre aunque el algoritmo cambie.',
      snips: ['a_registro', 'm_usr_crear'], uc: 'uc6' },
    { capa: 'servidor', titulo: 'Qué podés hacer: 401 y 403',
      idea: 'Sin sesión es 401. Con sesión pero sin el rol que hace falta, 403. Lo decide el servidor, no el botón.',
      resuelve: 'OWASP A01, control de acceso. Esconder un botón no alcanza; la API rechaza el pedido igual.',
      snips: ['c_sesion', 'c_rol'] },
    { capa: 'servidor', titulo: 'Todo o nada: transacciones',
      idea: 'Una solicitud o una propiedad nueva toca dos tablas. Si algo falla a la mitad, se deshace todo.',
      resuelve: 'beginTransaction y rollBack: nunca queda una solicitud sin sus propiedades.',
      snips: ['m_sol_crear', 'm_crear'], uc: 'uc4' },
    { capa: 'servidor', titulo: 'Los favoritos de cada persona',
      idea: 'El usuario sale de la sesión, no de lo que manda el navegador. Nadie puede guardar favoritos a nombre de otro.',
      resuelve: 'INSERT IGNORE más la clave UNIQUE evitan duplicados.',
      snips: ['a_fav', 'm_fav_add'], uc: 'uc8' },
    { capa: 'navegador', titulo: 'El navegador pide con fetch',
      idea: 'Una función central hace todos los pedidos, manda la cookie y, si el servidor responde 401, la pantalla se sincroniza.',
      resuelve: 'fetch con async/await, como pide la consigna. Un único lugar para manejar los errores.',
      snips: ['j_pedir'] },
    { capa: 'navegador', titulo: 'Se dibuja sin riesgo',
      idea: 'Todo dato que llega entra como texto con textContent. Si una propiedad se llamara <img onerror>, se vería ese texto y nada más.',
      resuelve: 'OWASP A03, XSS. No se usa innerHTML con datos del servidor.',
      snips: ['j_crear'] },
    { capa: 'navegador', titulo: 'Una sola página, varias vistas',
      idea: 'El router por hash cambia de vista sin recargar y mueve el foco al título. El menú se adapta a la sesión.',
      resuelve: 'SPA real. Visitante, cliente y agente ven menús distintos, pero quien decide es el servidor.',
      snips: ['j_ruta', 'j_vista', 'h_menu'], uc: 'x-ruta' },
    { capa: 'navegador', titulo: 'Formularios que explican el error',
      idea: 'Valida en el navegador por comodidad y muestra, campo por campo, los errores que devuelve el servidor.',
      resuelve: 'Los mensajes quedan en regiones aria-live, así que un lector de pantalla los anuncia.',
      snips: ['h_login', 'j_login'], uc: 'uc7' },
    { capa: 'navegador', titulo: 'El panel del agente',
      idea: 'Alta, edición, baja y cambio de estado de las solicitudes, con un solo listener para todos los botones.',
      resuelve: 'Los eventos se delegan en un contenedor, así los botones nuevos funcionan sin volver a engancharlos.',
      snips: ['j_prop', 'j_elim', 'j_estado', 'j_deleg'], uc: 'uc9' },
    { capa: 'navegador', titulo: 'Visor de fotos con dialog',
      idea: 'El elemento dialog del navegador atrapa el foco y se cierra con Esc. No hizo falta escribir esa parte.',
      resuelve: 'Operable solo con teclado: flechas para cambiar de foto, Esc para cerrar.',
      snips: ['h_visor', 'j_visor'], uc: 'x-visor' },
    { capa: 'calidad', titulo: 'Pensado para todas las personas',
      idea: 'Enlace para saltar al contenido, anuncios para lectores de pantalla, foco visible y respeto por quien pide menos movimiento.',
      resuelve: 'WCAG 2.1. Lighthouse da 100/100 en nueve vistas, incluidas las del cliente y las del agente con sesión.',
      snips: ['h_salto', 'h_live', 'x_foco', 'x_lectores', 'x_movimiento'] },
    { capa: 'calidad', titulo: 'Y todo se prueba',
      idea: 'Tres baterías corren contra la base real: la API, la SPA con el teclado y la accesibilidad.',
      resuelve: 'Casos que tienen que salir bien y casos que tienen que ser rechazados, con la evidencia guardada.',
      ir: 'pruebas' },
  ],

  /* ------------------------------------------------------------------ */
  /* Inicio                                                              */
  /* ------------------------------------------------------------------ */
  limitaciones: [
    { ae2: 'Las contraseñas quedaban en texto plano dentro de un JSON.', ae4: 'BCRYPT con password_hash y password_verify. La columna es VARCHAR(255).', snip: 'a_registro' },
    { ae2: 'Ocultar elementos en el navegador no protege nada.', ae4: 'Sesión en el servidor. Las guardas devuelven 401 y 403 aunque alguien fuerce el fetch.', snip: 'c_sesion' },
    { ae2: 'Los datos existían solo en cada navegador.', ae4: 'Base MySQL con seis tablas. Todos los navegadores ven lo mismo.', snip: 't_favoritos' },
  ],

  requisitos: [
    { grupo: 'Frontend', texto: 'SPA en JavaScript Vanilla con fetch y async/await', snip: 'j_pedir' },
    { grupo: 'Frontend', texto: 'Datos del servidor con .textContent, no con innerHTML', snip: 'j_crear' },
    { grupo: 'Frontend', texto: 'Regiones aria-live="polite" para anunciar respuestas', snip: 'h_live' },
    { grupo: 'Frontend', texto: ':focus-visible y operación solo con teclado', snip: 'x_foco' },
    { grupo: 'Backend', texto: 'Content-Type: application/json y http_response_code', snip: 'c_respuesta' },
    { grupo: 'Backend', texto: 'PDO con sentencias preparadas y marcadores nombrados', snip: 'm_usr_buscar' },
    { grupo: 'Backend', texto: 'try/catch de PDOException con transacción', snip: 'm_crear' },
    { grupo: 'Seguridad', texto: 'password_hash con BCRYPT', snip: 'a_registro' },
    { grupo: 'Seguridad', texto: 'password_verify en el login', snip: 'a_login' },
    { grupo: 'Seguridad', texto: 'Columna password en VARCHAR(255)', snip: 't_usuarios' },
    { grupo: 'Seguridad', texto: 'session_start y $_SESSION', snip: 'c_iniciar' },
    { grupo: 'Seguridad', texto: 'session_regenerate_id(true)', snip: 'c_abrir' },
    { grupo: 'Seguridad', texto: '401 ante acceso anónimo', snip: 'c_sesion' },
    { grupo: 'Entrega', texto: 'Auditoría ISO/IEC 25010 con las siete características', ir: 'iso' },
    { grupo: 'Entrega', texto: 'Lighthouse de accesibilidad en 100/100', ir: 'pruebas' },
    { grupo: 'Entrega', texto: 'Repositorio con commits repartidos, README y guía de XAMPP', ir: 'repo' },
  ],

  /* ------------------------------------------------------------------ */
  /* ISO/IEC 25010                                                       */
  /* ------------------------------------------------------------------ */
  iso: [
    { n: 1, nombre: 'Adecuación funcional', evidencia: 'Los nueve casos de uso tienen endpoint y prueba. 53 de 53 casos de la API y 47 de 47 de la SPA pasan.', ir: 'pruebas' },
    { n: 2, nombre: 'Eficiencia de desempeño', evidencia: 'Propiedades y fotos en una sola consulta con LEFT JOIN. Las vistas cambian sin recargar la página.', snips: ['m_listar'] },
    { n: 3, nombre: 'Compatibilidad', evidencia: 'Cliente y servidor desacoplados por un contrato JSON. La API se probó con curl, sin navegador.', snips: ['c_respuesta'] },
    { n: 4, nombre: 'Fiabilidad', evidencia: 'Bloques try/catch de PDOException y tres transacciones con rollBack. Códigos HTTP probados uno por uno.', snips: ['m_crear', 'm_sol_crear'] },
    { n: 5, nombre: 'Seguridad (OWASP)', evidencia: 'BCRYPT, sentencias preparadas, sesión en el servidor, 401 y 403 probados, textContent contra XSS.', snips: ['a_login', 'c_abrir', 'c_sesion', 'j_crear'] },
    { n: 6, nombre: 'Usabilidad y accesibilidad', evidencia: 'Lighthouse da 100/100 en 9 vistas, incluidas las de cliente y agente con sesión. Es la característica que más refactorización exigió: arrancó en 92.', snips: ['x_foco', 'h_salto', 'h_live'], ir: 'pruebas' },
    { n: 7, nombre: 'Mantenibilidad', evidencia: 'Cuatro capas, un modelo por entidad y un endpoint por recurso. Historial de Git repartido entre los tres.', ir: 'repo' },
  ],

  /* Las 4 correcciones que llevaron Lighthouse de 92 a 100 (bitácora). */
  correccionesLighthouse: [
    'Contraste del verde grisáceo (4,27:1) y del ocre (2,77:1) por debajo del mínimo de 4,5:1: se separaron los colores de texto de los de fondo.',
    'Un <label> con aria-label, algo que ese elemento no admite.',
    'Nombre accesible que no contenía el texto visible del control.',
    'Salto de h1 a h3 en el catálogo.',
  ],

  /* Capas de la arquitectura. */
  capas: [
    { nombre: 'Vista', carpeta: 'public/', detalle: 'index.html, js/app.js, css/estilos.css, img/', autor: 'Jesús' },
    { nombre: 'Controlador', carpeta: 'api/', detalle: 'siete endpoints REST que responden JSON', autor: 'Calamari y Roa' },
    { nombre: 'Modelo', carpeta: 'models/', detalle: 'un modelo por entidad con sentencias preparadas', autor: 'Roa y Calamari' },
    { nombre: 'Infraestructura', carpeta: 'config/', detalle: 'conexión PDO, respuestas JSON y sesión', autor: 'Calamari y Roa' },
    { nombre: 'Base de datos', carpeta: 'database/', detalle: 'rn_inmobiliaria.sql: seis tablas y datos de prueba', autor: 'Roa' },
  ],

  despliegue: [
    'Instalar XAMPP y encender Apache y MySQL desde el panel de control.',
    'Copiar la carpeta del proyecto dentro de htdocs.',
    'Importar database/rn_inmobiliaria.sql desde phpMyAdmin o con el cliente de MySQL.',
    'Abrir http://localhost/<carpeta>/public/index.html.',
    'Para esta presentación: http://localhost/<carpeta>/defensa/.',
  ],

  /* Notas al margen de líneas clave. [expresión, texto] */
  notas: {
    j_pedir:   [[/credentials/, 'Manda la cookie de sesión de PHP'], [/await fetch/, 'El fetch real de toda la aplicación'], [/401/, 'Si el servidor dice 401, la interfaz se sincroniza']],
    j_crear:   [[/textContent/, 'Texto, nunca HTML: frena el XSS']],
    c_conexion:[[/EMULATE_PREPARES/, 'Parámetros por separado de la consulta'], [/ERRMODE_EXCEPTION/, 'Los errores salen como excepciones'], [/static \$instancia|self::\$instancia/, 'Singleton: una sola conexión']],
    c_respuesta:[[/Content-Type/, 'Cabecera exigida por la consigna'], [/http_response_code/, 'Código HTTP semántico'], [/json_encode/, 'El cuerpo siempre es JSON']],
    c_iniciar: [[/httponly/i, 'JavaScript no puede leer la cookie'], [/samesite/i, 'No viaja en pedidos de otros sitios'], [/session_start/, 'Arranca la sesión en el servidor']],
    c_abrir:   [[/session_regenerate_id\(true\)/, 'ID nuevo: frena la fijación de sesión'], [/\$_SESSION\['usuario'\]/, 'El usuario vive en el servidor']],
    c_sesion:  [[/401/, '401: no hay sesión']],
    c_rol:     [[/403/, '403: hay sesión pero el rol no alcanza']],
    a_login:   [[/password_verify/, 'Compara contra el hash BCRYPT'], [/errorJson\(401/, 'Mismo mensaje para e-mail y clave'], [/abrirSesionUsuario/, 'Recién acá se abre la sesión']],
    a_registro:[[/password_hash/, 'BCRYPT: se guarda el hash, nunca la clave'], [/409/, '409: el e-mail ya existe'], [/201/, '201 Created'], [/catch \(PDOException/, 'Falla de base: 500 con mensaje genérico']],
    a_fav:     [[/exigirSesion/, '401 si no hay sesión'], [/\$usuario\['id'\]/, 'El id sale de la sesión, no del pedido']],
    p_get:     [[/exigirRol/, 'Ver inactivas es solo del agente']],
    p_post:    [[/exigirRol/, 'Solo el agente: validado en el servidor'], [/201/, '201 Created']],
    p_put:     [[/exigirRol/, 'Solo el agente: validado en el servidor']],
    p_delete:  [[/exigirRol/, 'Solo el agente: validado en el servidor']],
    s_post:    [[/exigirSesion/, 'Hace falta estar logueado'], [/201/, '201 Created']],
    s_patch:   [[/exigirRol/, 'Solo el agente cambia estados']],
    m_listar:  [[/LEFT JOIN/, 'Propiedades y fotos en una sola consulta']],
    m_crear:   [[/beginTransaction/, 'Empieza la transacción'], [/rollBack/, 'Si algo falla, se deshace todo'], [/commit\(\)/, 'Recién acá se confirma'], [/:\w+/, null]],
    m_sol_crear:[[/beginTransaction/, 'Dos tablas: o entra todo o nada'], [/rollBack/, 'Se deshace todo']],
    m_fav_add: [[/INSERT IGNORE/, 'La clave UNIQUE evita duplicados']],
    m_usr_buscar:[[/:email/, 'Marcador nombrado: el e-mail viaja aparte']],
    t_usuarios:[[/password/, 'VARCHAR(255): el hash ocupa 60 y deja lugar a otros algoritmos']],
    t_favoritos:[[/UNIQUE/, 'Un usuario no repite una propiedad']],
    x_foco:    [[/focus-visible/, 'Anillo de foco para quien navega con teclado']],
    h_live:    [[/aria-live/, 'Anuncia lo que llega del fetch']],
    h_salto:   [[/salto-contenido/, 'Primer elemento al que llega el Tab']],
    h_visor:   [[/<dialog/, 'Elemento nativo: atrapa el foco solo']],
    j_wsp:     [[/wa\.me/, 'Enlace externo, sin servidor']],
    j_login:   [[/await pedir/, 'El fetch al endpoint de login'], [/marcarError|volcarErrores/, 'Errores campo por campo']],
    j_registro:[[/await pedir/, 'El fetch al endpoint de registro'], [/409/, 'El 409 se muestra en el campo e-mail']],
    j_fav:     [[/await pedir/, 'DELETE si ya era favorito, POST si no']],
    j_compra:  [[/await pedir/, 'POST de la solicitud de compra']],
    j_prop:    [[/'PUT'/, 'Editar: PUT'], [/'POST'/, 'Crear: POST']],
    j_elim:    [[/'DELETE'/, 'Baja: DELETE']],
    j_estado:  [[/'PATCH'/, 'Cambio de estado: PATCH']],
    j_catalogo:[[/await pedir/, 'El tipo viaja como ?tipo= en la URL']],
  },
};
