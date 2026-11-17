#!/usr/bin/env bash
# =====================================================================
# RN Inmobiliaria — AE4 / TIFAS
# docs/evidencias/prueba-api.sh
#
# Prueba cada endpoint de la API con casos válidos, inválidos y anónimos.
# Imprime el código HTTP que devolvió el servidor y el cuerpo JSON.
#
# Cómo correrlo con XAMPP:
#   1) Importar database/rn_inmobiliaria.sql
#   2) Dejar el proyecto en htdocs y arrancar Apache
#   3) BASE=http://localhost/RNinmobiliriaUPGRADE/api bash docs/evidencias/prueba-api.sh
# =====================================================================
BASE="${BASE:-http://localhost:8080/api}"
GALLETAS_CLIENTE=$(mktemp)
GALLETAS_AGENTE=$(mktemp)
NUM=0

pedir() { # pedir "descripción" "esperado" curl-args...
  NUM=$((NUM+1))
  local desc="$1" esperado="$2"; shift 2
  local salida codigo cuerpo
  salida=$(curl -s -w $'\n%{http_code}' "$@")
  codigo=$(printf '%s' "$salida" | tail -n1)
  cuerpo=$(printf '%s' "$salida" | sed '$d')
  if [ "$codigo" = "$esperado" ]; then estado="OK  "; else estado="FALLA"; fi
  printf '%s  [%02d] %-58s esperado %s / obtenido %s\n' "$estado" "$NUM" "$desc" "$esperado" "$codigo"
  printf '      %s\n\n' "$(printf '%s' "$cuerpo" | head -c 420)"
}

echo "====================================================================="
echo " PRUEBAS DE LA API REST — RN Inmobiliaria AE4"
echo " Base: $BASE     Fecha: $(date '+%d/%m/%Y %H:%M')"
echo "====================================================================="
echo
echo "--- 1. CATÁLOGO PÚBLICO (UC1, UC2, UC3) ---------------------------"
pedir "GET catálogo completo"                200 "$BASE/propiedades.php"
pedir "GET catálogo filtrado por tipo casa"  200 "$BASE/propiedades.php?tipo=casa"
pedir "GET tipo inexistente -> 400"          400 "$BASE/propiedades.php?tipo=castillo"
pedir "GET ficha de la propiedad 1"          200 "$BASE/propiedades.php?id=1"
pedir "GET ficha inexistente -> 404"         404 "$BASE/propiedades.php?id=9999"
pedir "GET id no numérico -> 400"            400 "$BASE/propiedades.php?id=abc"

echo "--- 2. CONTROL DE ACCESO ANÓNIMO (OWASP A01) ---------------------"
pedir "GET sesión sin login (autenticado:false)" 200 "$BASE/sesion.php"
pedir "GET favoritos sin sesión -> 401"      401 "$BASE/favoritos.php"
pedir "POST solicitud sin sesión -> 401"     401 -X POST "$BASE/solicitudes.php" \
      -H 'Content-Type: application/json' -d '{"nombre":"Anónimo"}'
pedir "POST alta de propiedad sin sesión -> 401" 401 -X POST "$BASE/propiedades.php" \
      -H 'Content-Type: application/json' -d '{"titulo":"Casa pirata","tipo":"casa"}'
pedir "DELETE propiedad sin sesión -> 401"   401 -X DELETE "$BASE/propiedades.php?id=1"
pedir "GET listado del panel sin sesión -> 401" 401 "$BASE/propiedades.php?todas=1"

echo "--- 3. AUTENTICACIÓN (UC7, OWASP A02 / A07) --------------------"
pedir "POST login con contraseña incorrecta -> 401" 401 -X POST "$BASE/login.php" \
      -H 'Content-Type: application/json' -d '{"email":"ana@rninmobiliaria.com","password":"incorrecta"}'
pedir "POST login con e-mail inexistente -> 401" 401 -X POST "$BASE/login.php" \
      -H 'Content-Type: application/json' -d '{"email":"nadie@rninmobiliaria.com","password":"tierraroja26"}'
pedir "POST login sin datos -> 400"          400 -X POST "$BASE/login.php" \
      -H 'Content-Type: application/json' -d '{}'
pedir "POST login con JSON roto -> 400"      400 -X POST "$BASE/login.php" \
      -H 'Content-Type: application/json' -d '{esto no es json}'

echo "--- 4. INTENTO DE INYECCIÓN SQL (OWASP A03) ----------------------"
pedir "Login con \"' OR '1'='1\" en el e-mail -> 401" 401 -X POST "$BASE/login.php" \
      -H 'Content-Type: application/json' -d "{\"email\":\"' OR '1'='1\",\"password\":\"cualquiera\"}"
pedir "Login con comentario SQL -> 401"      401 -X POST "$BASE/login.php" \
      -H 'Content-Type: application/json' -d "{\"email\":\"ana@rninmobiliaria.com'--\",\"password\":\"x\"}"
pedir "Ficha con DROP TABLE en el id -> 400"  400 "$BASE/propiedades.php?id=1;%20DROP%20TABLE%20usuarios"

echo "--- 5. SESIÓN DEL CLIENTE (UC7, UC8, UC4) ------------------"
pedir "POST login correcto de Ana (cliente)" 200 -c "$GALLETAS_CLIENTE" -X POST "$BASE/login.php" \
      -H 'Content-Type: application/json' -d '{"email":"ana@rninmobiliaria.com","password":"tierraroja26"}'
pedir "GET sesión con cookie de Ana"         200 -b "$GALLETAS_CLIENTE" "$BASE/sesion.php"
pedir "GET favoritos de Ana"                 200 -b "$GALLETAS_CLIENTE" "$BASE/favoritos.php"
pedir "POST favorito propiedad 3"            201 -b "$GALLETAS_CLIENTE" -X POST "$BASE/favoritos.php" \
      -H 'Content-Type: application/json' -d '{"propiedad_id":3}'
pedir "POST el mismo favorito otra vez -> 200" 200 -b "$GALLETAS_CLIENTE" -X POST "$BASE/favoritos.php" \
      -H 'Content-Type: application/json' -d '{"propiedad_id":3}'
pedir "POST favorito de propiedad inexistente -> 404" 404 -b "$GALLETAS_CLIENTE" -X POST "$BASE/favoritos.php" \
      -H 'Content-Type: application/json' -d '{"propiedad_id":9999}'
pedir "DELETE favorito propiedad 3"          200 -b "$GALLETAS_CLIENTE" -X DELETE "$BASE/favoritos.php?propiedad_id=3"
pedir "DELETE favorito que no estaba -> 404" 404 -b "$GALLETAS_CLIENTE" -X DELETE "$BASE/favoritos.php?propiedad_id=3"
pedir "POST solicitud de compra válida"      201 -b "$GALLETAS_CLIENTE" -X POST "$BASE/solicitudes.php" \
      -H 'Content-Type: application/json' \
      -d '{"nombre":"Ana Benítez","telefono":"+54 9 376 4170186","direccion":"Av. Uruguay 1200, Villa Sarita","email":"ana@rninmobiliaria.com","medio_pago":"transferencia","propiedades":[1,3],"mensaje":"Quiero coordinar una visita."}'
pedir "POST solicitud sin propiedades -> 400" 400 -b "$GALLETAS_CLIENTE" -X POST "$BASE/solicitudes.php" \
      -H 'Content-Type: application/json' \
      -d '{"nombre":"Ana Benítez","telefono":"3764170186","direccion":"Av. Uruguay 1200","email":"ana@rninmobiliaria.com","medio_pago":"efectivo","propiedades":[]}'
pedir "POST solicitud con medio de pago inválido -> 400" 400 -b "$GALLETAS_CLIENTE" -X POST "$BASE/solicitudes.php" \
      -H 'Content-Type: application/json' \
      -d '{"nombre":"Ana Benítez","telefono":"3764170186","direccion":"Av. Uruguay 1200","email":"ana@rninmobiliaria.com","medio_pago":"criptomonedas","propiedades":[1]}'
pedir "GET solicitudes propias de Ana"       200 -b "$GALLETAS_CLIENTE" "$BASE/solicitudes.php"

echo "--- 6. CLIENTE INTENTANDO HACER DE AGENTE (403) ------------------"
pedir "POST alta de propiedad como cliente -> 403" 403 -b "$GALLETAS_CLIENTE" -X POST "$BASE/propiedades.php" \
      -H 'Content-Type: application/json' \
      -d '{"titulo":"Casa fantasma","tipo":"casa","barrio":"Centro","precio":1,"superficie":1}'
pedir "DELETE propiedad como cliente -> 403" 403 -b "$GALLETAS_CLIENTE" -X DELETE "$BASE/propiedades.php?id=1"
pedir "GET todas las solicitudes como cliente -> 403" 403 -b "$GALLETAS_CLIENTE" "$BASE/solicitudes.php?todas=1"

echo "--- 7. CRUD DEL AGENTE (UC9) -----------------------------------"
pedir "POST login de Rodrigo (agente)"       200 -c "$GALLETAS_AGENTE" -X POST "$BASE/login.php" \
      -H 'Content-Type: application/json' -d '{"email":"rodrigo@rninmobiliaria.com","password":"posadas2026"}'
pedir "GET listado del panel con las dadas de baja" 200 -b "$GALLETAS_AGENTE" "$BASE/propiedades.php?todas=1"
pedir "POST alta de propiedad nueva"         201 -b "$GALLETAS_AGENTE" -X POST "$BASE/propiedades.php" \
      -H 'Content-Type: application/json' \
      -d '{"titulo":"Departamento 2 ambientes en Villa Cabello","tipo":"departamento","barrio":"Villa Cabello, Posadas","precio":48000,"superficie":55,"ambientes":2,"descripcion":"Departamento a estrenar con balcón.","destacada":false,"fotos":[{"ruta":"img/casa-centro-living.png","texto_alt":"Living del departamento"}]}'
pedir "POST alta con datos inválidos -> 400"  400 -b "$GALLETAS_AGENTE" -X POST "$BASE/propiedades.php" \
      -H 'Content-Type: application/json' \
      -d '{"titulo":"ab","tipo":"castillo","barrio":"","precio":"gratis","superficie":-5}'
pedir "POST alta con slug repetido -> 409"    409 -b "$GALLETAS_AGENTE" -X POST "$BASE/propiedades.php" \
      -H 'Content-Type: application/json' \
      -d '{"slug":"villa-sarita","titulo":"Casa repetida en Villa Sarita","tipo":"casa","barrio":"Villa Sarita","precio":1000,"superficie":100}'
pedir "PUT modificación de la propiedad 4"   200 -b "$GALLETAS_AGENTE" -X PUT "$BASE/propiedades.php?id=4" \
      -H 'Content-Type: application/json' \
      -d '{"titulo":"Departamento 2 ambientes en Villa Cabello","tipo":"departamento","barrio":"Villa Cabello, Posadas","precio":51000,"superficie":55,"ambientes":2,"descripcion":"Precio actualizado.","destacada":true,"fotos":[{"ruta":"img/casa-centro-living.png","texto_alt":"Living del departamento"}]}'
pedir "PUT sobre un id inexistente -> 404"   404 -b "$GALLETAS_AGENTE" -X PUT "$BASE/propiedades.php?id=9999" \
      -H 'Content-Type: application/json' \
      -d '{"titulo":"Casa inexistente","tipo":"casa","barrio":"Centro","precio":1000,"superficie":50}'
pedir "GET todas las solicitudes como agente" 200 -b "$GALLETAS_AGENTE" "$BASE/solicitudes.php?todas=1"
pedir "PATCH estado de la solicitud 1"       200 -b "$GALLETAS_AGENTE" -X PATCH "$BASE/solicitudes.php?id=1" \
      -H 'Content-Type: application/json' -d '{"estado":"contactada"}'
pedir "PATCH con un estado inválido -> 400"  400 -b "$GALLETAS_AGENTE" -X PATCH "$BASE/solicitudes.php?id=1" \
      -H 'Content-Type: application/json' -d '{"estado":"archivada"}'
pedir "DELETE de la propiedad 4"             200 -b "$GALLETAS_AGENTE" -X DELETE "$BASE/propiedades.php?id=4"
pedir "DELETE de la misma propiedad -> 404"  404 -b "$GALLETAS_AGENTE" -X DELETE "$BASE/propiedades.php?id=4"

echo "--- 8. REGISTRO (UC6) ------------------------------------------"
pedir "POST registro con e-mail repetido -> 409" 409 -X POST "$BASE/registro.php" \
      -H 'Content-Type: application/json' \
      -d '{"nombre":"Ana Benítez","email":"ana@rninmobiliaria.com","password":"otraclave1","password2":"otraclave1"}'
pedir "POST registro con contraseñas distintas -> 400" 400 -X POST "$BASE/registro.php" \
      -H 'Content-Type: application/json' \
      -d '{"nombre":"Jesús De Olivera","email":"jesus.prueba@rninmobiliaria.com","password":"clave12345","password2":"clave54321"}'
pedir "POST registro con e-mail inválido -> 400" 400 -X POST "$BASE/registro.php" \
      -H 'Content-Type: application/json' \
      -d '{"nombre":"Jesús De Olivera","email":"jesus.arroba.nada","password":"clave12345","password2":"clave12345"}'
pedir "POST registro válido"                 201 -X POST "$BASE/registro.php" \
      -H 'Content-Type: application/json' \
      -d '{"nombre":"Santino Calamari","email":"santino.prueba@rninmobiliaria.com","password":"misiones2026","password2":"misiones2026"}'

echo "--- 9. CIERRE DE SESIÓN ------------------------------------------"
pedir "POST logout de Ana"                   200 -b "$GALLETAS_CLIENTE" -c "$GALLETAS_CLIENTE" -X POST "$BASE/logout.php"
pedir "GET favoritos después del logout -> 401" 401 -b "$GALLETAS_CLIENTE" "$BASE/favoritos.php"
pedir "GET con método no permitido -> 405"   405 -X PUT "$BASE/login.php"

rm -f "$GALLETAS_CLIENTE" "$GALLETAS_AGENTE"
echo "====================================================================="
echo " FIN DE LAS PRUEBAS — $NUM casos"
echo "====================================================================="
