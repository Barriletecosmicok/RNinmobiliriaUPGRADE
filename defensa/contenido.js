/* Textos de la presentación. El código y los resultados NO están acá: vienen
   de datos.js, que se genera desde los archivos reales (defensa/generar.py).
   La presentación sigue la dinámica del coloquio de defensa oral (punto 7 de la consigna). */
window.CONTENIDO = {

  secciones: [
    { id: 'teclado',        nombre: 'Demostración por teclado', tiempo: '3 min' },
    { id: 'auditoria',      nombre: 'Evidencia de auditoría',   tiempo: '2 min' },
    { id: 'interrogatorio', nombre: 'Interrogatorio oral',      tiempo: '5 a 10 min' },
  ],

  franjas: {
    teclado:        'Solo Tab y Enter. El contador de mouse tiene que quedar en 0.',
    auditoria:      'Accesibilidad 100/100 y endpoints JSON, en las DevTools.',
    interrogatorio: 'A · Casos de uso y MVC   |   B · OWASP   |   C · ISO 25010',
  },

  /* ---------------- 1. Demostración por teclado ---------------- */
  teclado: {
    ayuda: 'F: foco a la página',
    pasos: [
      { id: 'salto',    clave: 'salto',   tecla: 'Tab',        ver: 'Aparece «Saltar al contenido» con el foco visible.' },
      { id: 'catalogo', clave: 'uc1',     tecla: 'Propiedades', ver: 'El catálogo sale de la base de datos.' },
      { id: 'filtro',   clave: 'uc2',     tecla: 'Casas',      ver: 'El filtro es un botón: Enter y espacio.' },
      { id: 'ficha',    clave: 'uc3',     tecla: 'Una tarjeta', ver: 'Se abre la ficha de la propiedad.' },
      { id: 'login',    clave: 'uc7:0',   tecla: 'Ingresar',   ver: 'Escribir los datos y Enter.' },
      { id: 'favorito', clave: 'uc8',     tecla: 'Corazón',    ver: 'El cambio queda guardado en la base.' },
      { id: 'compra',   clave: 'uc4',     tecla: 'Comprar',    ver: 'Completar el formulario y Enter.' },
      { id: 'salir',    clave: 'uc7:1',   tecla: 'Salir',      ver: 'La sesión se cierra en el servidor.' },
    ],
    opcional: { id: 'panel', clave: 'uc9', tecla: 'Panel (agente)', ver: 'Alta, edición y baja solo con teclado.' },
  },

  /* ---------------- 2. Evidencia de auditoría ---------------- */
  auditoria: {
    lighthouse: ['F12 → pestaña Lighthouse', 'Solo Accessibility, Desktop', 'Analyze page load → 100'],
    red: ['F12 → Network → Fetch/XHR', 'Recargar y abrir propiedades.php', 'Headers: 200 y application/json', 'Response: el JSON', 'Ingreso con clave mala: 401'],
    endpoints: [
      { ruta: 'propiedades.php', metodos: 'GET · POST · PUT · DELETE', uc: 'UC1 UC2 UC3 UC9' },
      { ruta: 'registro.php',    metodos: 'POST',                      uc: 'UC6' },
      { ruta: 'login.php',       metodos: 'POST',                      uc: 'UC7' },
      { ruta: 'logout.php',      metodos: 'POST',                      uc: 'UC7' },
      { ruta: 'sesion.php',      metodos: 'GET',                       uc: 'UC7' },
      { ruta: 'favoritos.php',   metodos: 'GET · POST · DELETE',       uc: 'UC8' },
      { ruta: 'solicitudes.php', metodos: 'GET · POST · PATCH',        uc: 'UC4 UC9' },
    ],
  },

  /* ---------------- 3. Interrogatorio ---------------- */
  temas: [
    { id: 'mvc',   rotulo: 'A', nombre: 'De los casos de uso a MVC' },
    { id: 'owasp', rotulo: 'B', nombre: 'OWASP línea por línea' },
    { id: 'iso',   rotulo: 'C', nombre: 'ISO 25010' },
  ],

  mvc: {
    porque: [
      'Antes todo vivía en el navegador: cualquiera podía tocar datos y claves.',
      'Ahora las reglas viven en el servidor y el contrato es JSON.',
      'Cada endpoint existe por un caso de uso.',
    ],
    nacio: { uc1: 'AE1', uc2: 'AE1', uc3: 'AE1', uc4: 'AE1', uc5: 'AE1', uc6: 'AE2', uc7: 'AE2', uc8: 'AE2', uc9: 'AE4' },
    evolucion: {
      uc1: { ae1: 'Tarjetas a mano en HTML', ae2: 'fetch a un JSON', ae4: 'GET propiedades.php → MySQL' },
      uc2: { ae1: 'Filtro con CSS puro', ae2: 'Filtro en el cliente', ae4: 'WHERE tipo = :tipo' },
      uc3: { ae1: 'Un HTML por propiedad', ae2: 'Un HTML por propiedad', ae4: 'GET ?id= y una sola vista' },
      uc4: { ae1: 'Formulario sin destino', ae2: 'Datos en sessionStorage', ae4: 'POST solicitudes.php con transacción' },
      uc5: { ae1: 'Enlace wa.me fijo', ae2: 'Igual', ae4: 'Mensaje con datos reales de la API' },
      uc6: { ae1: 'No existía', ae2: 'localStorage, clave en texto plano', ae4: 'POST registro.php con BCRYPT' },
      uc7: { ae1: 'No existía', ae2: 'Comparaba contra un JSON público', ae4: 'login.php, password_verify y $_SESSION' },
      uc8: { ae1: 'No existía', ae2: 'localStorage del navegador', ae4: 'Tabla favoritos por usuario' },
      uc9: { ae1: 'No existía', ae2: 'No existía', ae4: 'POST, PUT y DELETE solo para el agente' },
    },
  },

  owasp: [
    { id: 'pdo', titulo: 'PDO con consultas preparadas', owasp: 'A03 · Inyección SQL',
      idea: 'El dato viaja aparte de la consulta.',
      probar: 'Casos 17 y 18 de la API: «\' OR \'1\'=\'1» como e-mail da 401.',
      archivos: [
        { snip: 'm_usr_buscar', pasos: [
          { re: /public function buscarPorEmail/, n: 1, t: 'Recibe el e-mail como texto.' },
          { re: /\$this->db->prepare\(/, n: 6, t: 'prepare(): la consulta viaja con un hueco.' },
          { re: /WHERE email = :email/, n: 1, t: 'El hueco es :email, no se pega nada.' },
          { re: /->execute\(\[':email'/, n: 1, t: 'execute(): el dato viaja aparte. Es dato, no código.' },
          { re: /\$fila = \$sentencia->fetch\(\)/, n: 1, t: 'Trae una fila.' },
          { re: /return \$fila === false/, n: 1, t: 'Sin usuario devuelve null.' },
        ] },
        { snip: 'c_conexion', pasos: [
          { re: /private static \?PDO \$instancia/, n: 1, t: 'Una sola conexión para todo el pedido.' },
          { re: /PDO::ATTR_ERRMODE/, n: 1, t: 'Errores de SQL como excepciones: el endpoint responde 500.' },
          { re: /PDO::ATTR_DEFAULT_FETCH_MODE/, n: 1, t: 'Filas como arreglo asociativo.' },
          { re: /PDO::ATTR_EMULATE_PREPARES/, n: 1, t: 'EMULATE_PREPARES en false: prepara el motor, no PHP.' },
        ] },
      ] },
    { id: 'bcrypt', titulo: 'BCRYPT para las claves', owasp: 'A02 · Fallas criptográficas',
      idea: 'Se guarda un hash, nunca la clave.',
      probar: 'En phpMyAdmin, tabla usuarios: hashes de 60 caracteres que empiezan con $2y$10$.',
      archivos: [
        { snip: 'a_registro', pasos: [
          { re: /\$password\s+= isset/, n: 1, t: 'La clave llega en texto plano solo hasta acá.' },
          { re: /strlen\(\$password\) < 8/, n: 3, t: 'El servidor valida: mínimo 8 caracteres.' },
          { re: /existeEmail/, n: 3, t: 'E-mail repetido: 409.' },
          { re: /password_hash\(/, n: 1, t: 'password_hash: BCRYPT, 60 caracteres, con sal.' },
          { re: /\$modelo->crear\(/, n: 1, t: 'A la base va el hash, nunca la clave.' },
          { re: /abrirSesionUsuario\(\$usuario\)/, n: 1, t: 'Abre la sesión.' },
        ] },
        { snip: 'a_login', pasos: [
          { re: /if \(\$email === ''/, n: 3, t: 'Faltan datos: 400.' },
          { re: /buscarPorEmail/, n: 1, t: 'Busca al usuario con la consulta preparada.' },
          { re: /password_verify/, n: 3, t: 'password_verify: vuelve a hashear y compara. Si algo falla, el mismo 401.' },
          { re: /\$publico = \[/, n: 6, t: 'Arreglo sin la clave: el hash no sale.' },
          { re: /abrirSesionUsuario\(\$publico\)/, n: 1, t: 'Abre la sesión.' },
          { re: /exito\(200/, n: 1, t: 'Responde 200.' },
        ] },
      ] },
    { id: 'sesion', titulo: '$_SESSION en el servidor', owasp: 'A01 · Control de acceso · A07 · Identificación',
      idea: 'Quién sos se guarda en el servidor.',
      probar: 'En la consola: fetch(\'../api/favoritos.php\') da 401 sin sesión; un POST a propiedades.php como cliente da 403.',
      archivos: [
        { snip: 'c_iniciar', pasos: [
          { re: /session_status\(\) === PHP_SESSION_ACTIVE/, n: 3, t: 'Si ya hay sesión, no la reabre.' },
          { re: /'httponly' => true/, n: 1, t: 'HttpOnly: JavaScript no lee la cookie.' },
          { re: /'samesite' => 'Lax'/, n: 1, t: 'SameSite Lax: frena parte del CSRF.' },
          { re: /'secure' => true/, n: 1, t: 'secure queda para cuando haya HTTPS.' },
          { re: /session_start\(\)/, n: 1, t: 'Arranca la sesión.' },
        ] },
        { snip: 'c_abrir', pasos: [
          { re: /session_regenerate_id\(true\)/, n: 1, t: 'Cambia el número de sesión: frena la fijación.' },
          { re: /\$_SESSION\['usuario'\] = \[/, n: 6, t: '$_SESSION: el usuario queda en el servidor.' },
          { re: /\$_SESSION\['iniciada_en'\]/, n: 1, t: 'Guarda la hora de inicio.' },
        ] },
        { snip: 'c_sesion', pasos: [
          { re: /usuarioEnSesion\(\)/, n: 1, t: 'Mira $_SESSION.' },
          { re: /if \(\$usuario === null\)/, n: 3, t: 'Sin nadie: 401.' },
        ] },
        { snip: 'c_rol', pasos: [
          { re: /\$usuario = exigirSesion\(\)/, n: 1, t: 'Primero exige sesión.' },
          { re: /\$usuario\['rol'\] !== \$rol/, n: 3, t: 'Rol insuficiente: 403.' },
        ] },
      ] },
  ],

  /* La característica de ISO 25010 que más refactorización pidió, según el código de cada área. */
  isoAreas: [
    { id: 'sesion', tab: 'Sesión y acceso', caracteristica: 'Seguridad (OWASP)',
      antes: 'Claves en texto plano y sesión en el navegador.',
      cambio: ['BCRYPT: password_hash y password_verify', 'Sesión en $_SESSION, cookie HttpOnly y SameSite', 'session_regenerate_id al ingresar', '401 sin sesión, 403 sin rol'],
      medicion: '53 casos de la API: 401, 403 y dos inyecciones.',
      limite: 'Sin token CSRF, sin HTTPS y sin límite de intentos.',
      snips: ['a_registro', 'a_login', 'c_abrir', 'c_sesion', 'c_rol'] },
    { id: 'datos', tab: 'Datos y modelos', caracteristica: 'Fiabilidad',
      antes: 'Un JSON no se rompe a medias; MySQL sí.',
      cambio: ['Transacciones con rollBack en alta, modificación y solicitud', 'PDOException: se registra y el cliente recibe un 500 genérico', 'Un caso de prueba por código HTTP'],
      medicion: '53 casos de la API.',
      limite: 'Ninguna prueba corta la base a mitad de una operación.',
      snips: ['m_crear', 'm_sol_crear'] },
    { id: 'interfaz', tab: 'Interfaz', caracteristica: 'Usabilidad y accesibilidad',
      antes: 'Lighthouse arrancó en 92.',
      cambio: 'LIGHTHOUSE',
      extra: 'Y el foco: el primer Tab ahora cae en «Saltar al contenido».',
      medicion: 'Lighthouse 100/100 en las nueve vistas.',
      limite: 'No reemplaza una prueba con lector de pantalla.',
      snips: ['x_foco', 'h_salto', 'x_lectores', 'x_movimiento'] },
  ],

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

  limitaciones: [
    { ae2: 'Las contraseñas quedaban en texto plano dentro de un JSON.', ae4: 'BCRYPT con password_hash y password_verify. La columna es VARCHAR(255).', snip: 'a_registro' },
    { ae2: 'Ocultar elementos en el navegador no protege nada.', ae4: 'Sesión en el servidor. Las guardas devuelven 401 y 403 aunque alguien fuerce el fetch.', snip: 'c_sesion' },
    { ae2: 'Los datos existían solo en cada navegador.', ae4: 'Base MySQL con seis tablas. Todos los navegadores ven lo mismo.', snip: 't_favoritos' },
  ],

  iso: [
    { n: 1, nombre: 'Adecuación funcional', evidencia: 'Los nueve casos de uso tienen endpoint y prueba. 53 de 53 casos de la API y 47 de 47 de la SPA pasan.' },
    { n: 2, nombre: 'Eficiencia de desempeño', evidencia: 'Propiedades y fotos en una sola consulta con LEFT JOIN. Las vistas cambian sin recargar la página.', snips: ['m_listar'] },
    { n: 3, nombre: 'Compatibilidad', evidencia: 'Cliente y servidor desacoplados por un contrato JSON. La API se probó con curl, sin navegador.', snips: ['c_respuesta'] },
    { n: 4, nombre: 'Fiabilidad', evidencia: 'Bloques try/catch de PDOException y tres transacciones con rollBack. Códigos HTTP probados uno por uno.', snips: ['m_crear', 'm_sol_crear'] },
    { n: 5, nombre: 'Seguridad (OWASP)', evidencia: 'BCRYPT, sentencias preparadas, sesión en el servidor, 401 y 403 probados, textContent contra XSS.', snips: ['a_login', 'c_abrir', 'c_sesion', 'j_crear'] },
    { n: 6, nombre: 'Usabilidad y accesibilidad', evidencia: 'Lighthouse da 100/100 en 9 vistas, incluidas las de cliente y agente con sesión. Es la característica que más refactorización exigió: arrancó en 92.', snips: ['x_foco', 'h_salto', 'h_live'] },
    { n: 7, nombre: 'Mantenibilidad', evidencia: 'Cuatro capas, un modelo por entidad y un endpoint por recurso. Historial de Git repartido entre los tres.' },
  ],

  correccionesLighthouse: [
    'Contraste de colores por debajo de 4,5:1',
    'Un <label> con aria-label',
    'Nombre accesible distinto del texto visible',
    'Salto de h1 a h3 en el catálogo',
  ],

  capas: [
    { nombre: 'Vista', carpeta: 'public/', detalle: 'index.html, js/app.js, css/estilos.css, img/', autor: 'Jesús' },
    { nombre: 'Controlador', carpeta: 'api/', detalle: 'siete endpoints REST que responden JSON', autor: 'Calamari y Roa' },
    { nombre: 'Modelo', carpeta: 'models/', detalle: 'un modelo por entidad con sentencias preparadas', autor: 'Roa y Calamari' },
    { nombre: 'Infraestructura', carpeta: 'config/', detalle: 'conexión PDO, respuestas JSON y sesión', autor: 'Calamari y Roa' },
    { nombre: 'Base de datos', carpeta: 'database/', detalle: 'rn_inmobiliaria.sql: seis tablas y datos de prueba', autor: 'Roa' },
  ],

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
