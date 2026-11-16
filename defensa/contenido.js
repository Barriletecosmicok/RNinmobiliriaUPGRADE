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
    teclado:        'Coloquio, punto 1. Se opera la página solo con Tab y Enter. El panel cuenta las teclas y los clics de mouse, muestra dónde está el foco y marca cada caso de uso que se recorrió.',
    auditoria:      'Coloquio, punto 2. Accesibilidad 100/100 en las nueve vistas y los endpoints RESTful que devuelven JSON, con su código HTTP. La evidencia oficial se muestra en las DevTools de Chrome.',
    interrogatorio: 'Coloquio, punto 3. Tres temas: de los casos de uso a la arquitectura MVC desacoplada, la remediación OWASP línea por línea, y la característica ISO 25010 que más refactorización pidió.',
  },

  /* ---------------- 1. Demostración por teclado ---------------- */
  teclado: {
    ayuda: 'Apretá F para darle el foco a la página sin usar el mouse. Desde ahí, solo Tab, Enter y el teclado para escribir los datos de los campos.',
    pasos: [
      { id: 'salto',    clave: 'salto',   tecla: 'Tab una sola vez',                                  ver: 'Aparece «Saltar al contenido principal» arriba a la izquierda, con el foco visible.' },
      { id: 'catalogo', clave: 'uc1',     tecla: 'Tab hasta «Propiedades» y Enter',                    ver: 'El catálogo sale de la base de datos.' },
      { id: 'filtro',   clave: 'uc2',     tecla: 'Tab hasta «Casas» y Enter',                          ver: 'El filtro es un botón: responde a Enter y a la barra espaciadora.' },
      { id: 'ficha',    clave: 'uc3',     tecla: 'Tab hasta una tarjeta y Enter',                      ver: 'Se abre la ficha con las fotos y el precio.' },
      { id: 'login',    clave: 'uc7:0',   tecla: 'Tab hasta «Ingresar», escribir los datos y Enter',   ver: 'El menú cambia y aparece «Hola» con el nombre.' },
      { id: 'favorito', clave: 'uc8',     tecla: 'Tab hasta el corazón y Enter',                       ver: 'El corazón cambia de estado y el cambio queda guardado en la base, atado a la cuenta.' },
      { id: 'compra',   clave: 'uc4',     tecla: 'Tab hasta «Comprar», completar el formulario y Enter', ver: 'Si un campo falla, el error aparece al lado y se anuncia por aria-live.' },
      { id: 'salir',    clave: 'uc7:1',   tecla: 'Tab hasta «Salir» y Enter',                          ver: 'La sesión se cierra en el servidor.' },
    ],
    opcional: { id: 'panel', clave: 'uc9', tecla: 'Como agente: Tab hasta «Panel» y Enter', ver: 'Alta, edición y baja de propiedades, solo con teclado.' },
  },

  /* ---------------- 2. Evidencia de auditoría ---------------- */
  auditoria: {
    lighthouse: [
      'Con la aplicación en una pestaña de Chrome, apretá F12.',
      'Abrí la pestaña Lighthouse y dejá marcada solo la categoría Accessibility.',
      'Elegí Desktop y tocá «Analyze page load».',
      'Se ve el círculo con 100. Mostrá que ninguna auditoría quedó fallida.',
    ],
    red: [
      'En la misma ventana de DevTools abrí la pestaña Network y filtrá por Fetch/XHR.',
      'Recargá la página. Aparece propiedades.php.',
      'Clic en la petición: en Headers se ve el código 200 y Content-Type: application/json; charset=utf-8.',
      'En Response o Preview se ve el JSON que devuelve la API.',
      'Ingresá con una clave mal puesta: esa petición vuelve en 401, también con su JSON.',
    ],
    endpoints: [
      { ruta: 'propiedades.php', metodos: 'GET · POST · PUT · DELETE', quien: 'GET público; el resto solo agente', uc: 'UC1, UC2, UC3, UC9' },
      { ruta: 'registro.php',    metodos: 'POST',                      quien: 'público',                           uc: 'UC6' },
      { ruta: 'login.php',       metodos: 'POST',                      quien: 'público',                           uc: 'UC7' },
      { ruta: 'logout.php',      metodos: 'POST',                      quien: 'público',                           uc: 'UC7' },
      { ruta: 'sesion.php',      metodos: 'GET',                       quien: 'público',                           uc: 'UC7' },
      { ruta: 'favoritos.php',   metodos: 'GET · POST · DELETE',       quien: 'con sesión',                        uc: 'UC8' },
      { ruta: 'solicitudes.php', metodos: 'GET · POST · PATCH',        quien: 'con sesión; PATCH y «todas» solo agente', uc: 'UC4, UC9' },
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
      'En la AE1 y la AE2 todo vivía en el navegador: el HTML, los datos en un JSON y hasta las claves. Cualquiera podía abrirlos o cambiar lo que quisiera.',
      'Con el controlador y el modelo en el servidor, las reglas (quién puede qué, qué dato es válido) se aplican donde nadie las puede tocar.',
      'El único contrato entre las dos mitades es JSON. La interfaz se puede cambiar sin tocar el servidor, y la API se prueba con curl, sin navegador.',
      'Cada capa hace una sola cosa, y cada endpoint existe porque un caso de uso lo necesita.',
    ],
    nacio: { uc1: 'AE1', uc2: 'AE1', uc3: 'AE1', uc4: 'AE1', uc5: 'AE1', uc6: 'AE2', uc7: 'AE2', uc8: 'AE2', uc9: 'AE4' },
    evolucion: {
      uc1: { ae1: 'Tarjetas escritas a mano en dos archivos HTML.', ae2: 'fetch a un JSON del navegador.', ae4: 'GET /api/propiedades.php consulta la tabla propiedades con un LEFT JOIN a fotos.' },
      uc2: { ae1: 'Filtro con CSS puro.', ae2: 'Filtro en el cliente con classList.', ae4: 'El filtro viaja al servidor: WHERE tipo = :tipo.' },
      uc3: { ae1: 'Un archivo HTML por propiedad.', ae2: 'Seguía siendo un archivo aparte.', ae4: 'GET /api/propiedades.php?id= y la vista #/propiedad/:id. Agregar una propiedad ya no crea un archivo.' },
      uc4: { ae1: 'Formulario con action="#": los datos no iban a ningún lado.', ae2: 'Precarga de nombre y e-mail desde sessionStorage.', ae4: 'POST /api/solicitudes.php guarda en dos tablas, dentro de una transacción.' },
      uc5: { ae1: 'Enlace wa.me con mensaje fijo.', ae2: 'Igual que en la AE1.', ae4: 'El mensaje se arma con el título y el precio reales que devuelve la API. No pasa por el servidor.' },
      uc6: { ae1: 'No existía.', ae2: 'Guardaba el usuario en localStorage con la clave en texto plano.', ae4: 'POST /api/registro.php inserta en usuarios con hash BCRYPT.' },
      uc7: { ae1: 'No existía.', ae2: 'Comparaba contra un JSON público.', ae4: 'POST /api/login.php con password_verify y $_SESSION en el servidor.' },
      uc8: { ae1: 'No existía.', ae2: 'Favoritos en localStorage, por navegador.', ae4: 'Tabla favoritos atada al usuario por clave foránea.' },
      uc9: { ae1: 'No existía.', ae2: 'No existía.', ae4: 'POST, PUT y DELETE sobre /api/propiedades.php, solo para el rol agente. Es el único caso de uso nuevo de la AE4.' },
    },
  },

  owasp: [
    { id: 'pdo', titulo: 'PDO con consultas preparadas', owasp: 'A03 · Inyección SQL',
      idea: 'El dato que escribe la persona viaja separado de la consulta. MySQL nunca lo lee como código.',
      probar: 'En las pruebas de la API, los casos 17 y 18 mandan «\' OR \'1\'=\'1» y un comentario SQL como e-mail. El servidor responde 401 en los dos: lo busca como un e-mail raro y no encuentra a nadie.',
      archivos: [
        { snip: 'm_usr_buscar', pasos: [
          { re: /public function buscarPorEmail/, n: 1, t: 'Recibe el e-mail como un texto. Todavía no toca la base.' },
          { re: /\$this->db->prepare\(/, n: 6, t: 'prepare() le manda a MySQL la consulta con un hueco en lugar del dato. MySQL la analiza antes de saber qué valor va a entrar.' },
          { re: /WHERE email = :email/, n: 1, t: 'El hueco se llama :email. Es un marcador con nombre: ahí no se pega nada de lo que escribió la persona.' },
          { re: /->execute\(\[':email'/, n: 1, t: 'Recién ahora viaja el valor, por un camino aparte. Aunque alguien escriba «\' OR 1=1 --», MySQL lo trata como un dato y no como parte de la consulta.' },
          { re: /\$fila = \$sentencia->fetch\(\)/, n: 1, t: 'Trae una sola fila como arreglo. Si no hay ninguna, devuelve false.' },
          { re: /return \$fila === false/, n: 1, t: 'Si no hay usuario devuelve null. El login lo trata igual que una clave incorrecta.' },
        ] },
        { snip: 'c_conexion', pasos: [
          { re: /private static \?PDO \$instancia/, n: 1, t: 'Una sola conexión para todo el pedido: se crea la primera vez y se reutiliza.' },
          { re: /PDO::ATTR_ERRMODE/, n: 1, t: 'Los errores de SQL se vuelven excepciones. Cada endpoint las atrapa y contesta 500 sin mostrar datos internos.' },
          { re: /PDO::ATTR_DEFAULT_FETCH_MODE/, n: 1, t: 'Cada fila llega como arreglo asociativo, lista para convertir a JSON.' },
          { re: /PDO::ATTR_EMULATE_PREPARES/, n: 1, t: 'La línea clave. En false, las consultas preparadas las arma el motor de MySQL y no PHP, así que los parámetros nunca se mezclan con el texto de la consulta.' },
        ] },
      ] },
    { id: 'bcrypt', titulo: 'BCRYPT para las claves', owasp: 'A02 · Fallas criptográficas',
      idea: 'La clave nunca se guarda: se guarda un hash que no se puede revertir. Para comprobarla se vuelve a calcular y se compara.',
      probar: 'En phpMyAdmin, en la tabla usuarios, la columna password tiene textos de 60 caracteres que empiezan con $2y$10$. Ni el equipo puede leer las claves.',
      archivos: [
        { snip: 'a_registro', pasos: [
          { re: /\$password\s+= isset/, n: 1, t: 'La clave llega en texto plano solo hasta acá. No se guarda ni se escribe en ningún log.' },
          { re: /strlen\(\$password\) < 8/, n: 3, t: 'El servidor valida: mínimo 8 caracteres. La validación del navegador ayuda, pero cualquiera puede mandar un POST sin formulario. La que cuenta es esta.' },
          { re: /existeEmail/, n: 3, t: 'Si ya hay una cuenta con ese e-mail, responde 409 y no crea nada.' },
          { re: /password_hash\(/, n: 1, t: 'Convierte la clave en un hash BCRYPT de 60 caracteres. Lleva su propia sal y un costo (10 por defecto). No se puede revertir.' },
          { re: /\$modelo->crear\(/, n: 1, t: 'A la base va el hash, nunca la clave. Por eso la columna es VARCHAR(255): hay lugar de sobra por si el algoritmo se alarga.' },
          { re: /abrirSesionUsuario\(\$usuario\)/, n: 1, t: 'Deja la sesión abierta. Es el paso a $_SESSION, el tema que sigue.' },
        ] },
        { snip: 'a_login', pasos: [
          { re: /if \(\$email === ''/, n: 3, t: 'Si falta el e-mail o la clave, responde 400.' },
          { re: /buscarPorEmail/, n: 1, t: 'Busca el usuario con la consulta preparada del tema anterior.' },
          { re: /password_verify/, n: 3, t: 'password_verify toma lo que escribió la persona, lo hashea con la misma sal del hash guardado y compara. Nunca se descifra nada. Si el usuario no existe o la clave no coincide, sale el mismo 401 y el mismo mensaje: el login no sirve para averiguar qué e-mails tienen cuenta.' },
          { re: /\$publico = \[/, n: 6, t: 'Se arma un arreglo sin la clave. El hash no sale del servidor.' },
          { re: /abrirSesionUsuario\(\$publico\)/, n: 1, t: 'Abre la sesión del usuario.' },
          { re: /exito\(200/, n: 1, t: 'Responde 200 con los datos públicos del usuario.' },
        ] },
      ] },
    { id: 'sesion', titulo: '$_SESSION en el servidor', owasp: 'A01 · Control de acceso · A07 · Identificación',
      idea: 'Quién es cada persona se guarda en el servidor. El navegador solo lleva un número de sesión, y cada recurso protegido lo revisa.',
      probar: 'En la consola del navegador: fetch(\'../api/favoritos.php\').then(r => r.status) da 401 sin sesión. Con la cuenta del cliente, un POST a propiedades.php da 403.',
      archivos: [
        { snip: 'c_iniciar', pasos: [
          { re: /session_status\(\) === PHP_SESSION_ACTIVE/, n: 3, t: 'Si la sesión ya está abierta, no la abre de nuevo.' },
          { re: /'httponly' => true/, n: 1, t: 'JavaScript no puede leer la cookie. Si alguien lograra meter un script en la página, no se lleva la sesión.' },
          { re: /'samesite' => 'Lax'/, n: 1, t: 'La cookie no viaja en pedidos que vienen de otros sitios: frena una parte de los ataques CSRF.' },
          { re: /'secure' => true/, n: 1, t: 'Quedó comentado a propósito: se activa cuando el sitio se publique con HTTPS. Es una limitación conocida.' },
          { re: /session_start\(\)/, n: 1, t: 'Recién acá PHP arranca la sesión y le da al navegador su PHPSESSID.' },
        ] },
        { snip: 'c_abrir', pasos: [
          { re: /session_regenerate_id\(true\)/, n: 1, t: 'Cambia el número de sesión y borra el anterior. Si un atacante conocía el viejo, deja de servirle (fijación de sesión). Se hace antes de guardar al usuario.' },
          { re: /\$_SESSION\['usuario'\] = \[/, n: 6, t: 'Acá está $_SESSION: quién es la persona queda guardado en el servidor. El navegador solo conserva el número de sesión, no sus datos ni su rol.' },
          { re: /\$_SESSION\['iniciada_en'\]/, n: 1, t: 'Guarda cuándo empezó la sesión.' },
        ] },
        { snip: 'c_sesion', pasos: [
          { re: /usuarioEnSesion\(\)/, n: 1, t: 'Mira $_SESSION para saber quién hace el pedido.' },
          { re: /if \(\$usuario === null\)/, n: 3, t: 'Si no hay nadie, corta con 401: «no sé quién sos». Todos los endpoints protegidos empiezan por esta guarda.' },
        ] },
        { snip: 'c_rol', pasos: [
          { re: /\$usuario = exigirSesion\(\)/, n: 1, t: 'Primero exige sesión: sin ella, 401.' },
          { re: /\$usuario\['rol'\] !== \$rol/, n: 3, t: 'Hay sesión, pero el rol no alcanza: 403, «te conozco, pero esto no es para vos». Un cliente que intenta borrar una propiedad recibe esto.' },
        ] },
      ] },
  ],

  /* La característica de ISO 25010 que más refactorización pidió, según el código de cada área. */
  isoAreas: [
    { id: 'sesion', tab: 'Sesión y acceso', caracteristica: 'Seguridad (OWASP)',
      antes: 'En la AE2 las claves quedaban en texto plano dentro de un JSON y la «sesión» era un valor del navegador: esconder un botón era toda la protección.',
      cambio: [
        'Las claves pasaron a BCRYPT, con password_hash y password_verify.',
        'La sesión vive en el servidor, en $_SESSION, con cookie HttpOnly y SameSite=Lax.',
        'Al iniciar sesión se renueva el número de sesión con session_regenerate_id.',
        'Las guardas devuelven 401 sin sesión y 403 con rol insuficiente, aunque alguien fuerce el fetch.',
      ],
      medicion: 'Los 53 casos de la API incluyen el 401 y el 403 y dos intentos de inyección SQL (casos 17 y 18). Una prueba de la SPA fuerza un fetch al panel con una cuenta de cliente.',
      limite: 'No hay token anti-CSRF (la mitigación es SameSite=Lax), ni HTTPS en el entorno local, ni límite de intentos de login.',
      snips: ['a_registro', 'a_login', 'c_abrir', 'c_sesion', 'c_rol'] },
    { id: 'datos', tab: 'Datos y modelos', caracteristica: 'Fiabilidad',
      antes: 'En la AE2 los datos eran un JSON y no había nada que pudiera quedar a medias. Con MySQL, un alta toca dos tablas y puede fallar en el medio.',
      cambio: [
        'El alta y la modificación de propiedades, y las solicitudes de compra, van en una transacción: si algo falla, rollBack y no queda nada a medias.',
        'Una PDOException nunca llega al cliente: se registra en el servidor y la persona recibe un 500 con un mensaje genérico.',
        'Cada código HTTP tiene su caso de prueba.',
      ],
      medicion: 'Los 53 casos de la API cubren el alta, la modificación, la baja, la baja repetida (404), el alta con datos repetidos (409) y el registro duplicado (409).',
      limite: 'Ninguna prueba corta la base a mitad de una operación: el rollBack se justifica leyendo el código.',
      snips: ['m_crear', 'm_sol_crear'] },
    { id: 'interfaz', tab: 'Interfaz', caracteristica: 'Usabilidad y accesibilidad',
      antes: 'La maqueta de la AE1 arrancó en 92 en Lighthouse. Fue la característica que más refactorización exigió.',
      cambio: 'LIGHTHOUSE',
      extra: 'Y una corrección que salió de la propia prueba de teclado: el router movía el foco al título también en la primera carga, así que el primer Tab no caía en «Saltar al contenido». Ahora el foco solo se mueve en los cambios de vista posteriores.',
      medicion: 'Lighthouse da 100/100 en las nueve vistas, incluidas las de cliente y agente con sesión. La prueba de la SPA recorre los casos con Tab y Enter.',
      limite: 'Lighthouse no reemplaza una prueba con personas que usan lector de pantalla. Las imágenes pesan unos 2 MB cada una; no afecta la accesibilidad, pero sí hundiría el puntaje de Rendimiento.',
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
    'Contraste del verde grisáceo (4,27:1) y del ocre (2,77:1) por debajo del mínimo de 4,5:1: se separaron los colores de texto de los de fondo.',
    'Un <label> con aria-label, algo que ese elemento no admite.',
    'Nombre accesible que no contenía el texto visible del control.',
    'Salto de h1 a h3 en el catálogo.',
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
