# Campus Parking — Sistema de Gestión de Parqueaderos con MongoDB

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![mongosh](https://img.shields.io/badge/mongosh-Shell-13AA52?style=flat&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

Sistema backend para la administración de múltiples sedes de parqueo, diseñado
sobre MongoDB para reemplazar el manejo actual de hojas de cálculo locales,
eliminando duplicación de datos y centralizando la información de sedes,
zonas, vehículos, usuarios y parqueos.

## Contenido

1. [Introducción](#1-introducción-al-proyecto)
2. [Justificación de MongoDB](#2-justificación-del-uso-de-mongodb)
3. [Modelo de datos](#3-diseño-del-modelo-de-datos)
4. [Datos de prueba](#4-estructura-de-los-datos-de-prueba-test_datasetjs)
5. [Agregaciones](#5-explicación-de-cada-agregación-aggregationsjs)
6. [Transacción](#6-transacción-mongodb-transactionsjs)
7. [Roles](#7-roles-rolesjs)
8. [Conclusiones](#8-conclusiones-y-mejoras-posibles)
9. [Instalación y ejecución](#9-instalación-y-ejecución)
10. [Flujo de ramas](#10-flujo-de-ramas)

---

## 1. Introducción al proyecto

Campus Parking administra parqueaderos en distintas ciudades. Hoy en día cada
sede lleva su información en hojas de cálculo separadas, lo que provoca:

- Datos duplicados entre sedes (el mismo cliente registrado varias veces).
- Errores humanos al copiar tarifas o cupos de una hoja a otra.
- Imposibilidad de generar reportes unificados entre sedes en tiempo real.

Este proyecto migra esa información a una base de datos MongoDB, con:

- Un modelo de datos validado (`$jsonSchema`) para que no se puedan insertar
  datos incompletos o mal formados.
- Datos de prueba realistas para simular el uso real del sistema.
- Consultas analíticas (agregaciones) para responder preguntas de negocio.
- Control de acceso por rol (Administrador, Empleado de sede, Cliente).
- Una transacción que garantiza que nunca se registre un ingreso sin
  descontar el cupo correspondiente (y viceversa).

---

## 2. Justificación del uso de MongoDB

Se eligió MongoDB (y no una base relacional como PostgreSQL o MySQL) por
razones concretas de este dominio, no solo porque el proyecto lo pedía:

- **Esquema semi-flexible por entidad**: un vehículo tipo "Bicicleta" no
  necesita los mismos campos que un "Camión", y cada zona puede tener reglas
  distintas de tarifa y tipos permitidos. Modelar esto en documentos evita
  tablas con columnas nulas o herencia compleja que sí serían necesarias en
  un modelo relacional estricto.
- **Consultas orientadas a documento**: la mayoría de las consultas de este
  sistema (historial de un cliente, ocupación de una sede) se resuelven bien
  navegando de un documento a otros relacionados, sin necesitar los joins
  complejos de múltiples tablas normalizadas.
- **Escalabilidad horizontal**: si Campus Parking crece a más ciudades o
  países, MongoDB permite crecer distribuyendo por sede/región sin rediseñar
  el esquema.

**¿Cuándo NO se usaría MongoDB?** Cuando el dominio requiere integridad
referencial estricta y transaccionalidad compleja como regla general (no la
excepción), por ejemplo un sistema bancario con transferencias entre muchas
cuentas y auditoría contable estricta. Ahí un motor relacional con
transacciones ACID nativas end-to-end, llaves foráneas obligatorias y
constraints a nivel de motor es más apropiado y más simple de razonar.

**Nota honesta:** este mismo proyecto sí necesitó una transacción
(`transactions.js`) para mantener consistencia entre `zonas` y `parqueos`.
Eso no invalida la elección de MongoDB — MongoDB soporta transacciones
multi-documento desde la versión 4.0 — pero es importante reconocer que la
consistencia entre esas dos colecciones específicas SÍ es un requisito
"relacional" dentro de un modelo mayormente documental. Es decir, no es
NoSQL "puro" en todos sus rincones, y eso es normal: la mayoría de sistemas
reales terminan siendo hilos híbridos según qué tan crítica es la
consistencia de cada parte del dominio.

---

## 3. Diseño del modelo de datos

### 3.1 Colecciones creadas

| Colección   | Propósito |
|-------------|-----------|
| `usuarios`  | Administradores, empleados de sede y clientes. |
| `vehiculos` | Vehículos registrados, cada uno ligado a un cliente. |
| `sedes`     | Ubicaciones físicas de Campus Parking. |
| `zonas`     | Secciones dentro de una sede, con su propio cupo y tarifa. |
| `parqueos`  | Eventos de ingreso/salida de un vehículo. |

### 3.2 Decisiones de referencias vs. embebidos

- **`usuarios` con `rol` (enum) en vez de 3 colecciones separadas**: los 3
  tipos de usuario comparten casi todos los campos base. Separarlos hubiera
  significado triplicar el mismo esquema de validación para una diferencia
  que en realidad es solo un permiso.
- **`vehiculos` referencia a `cliente_id` (no embebido)**: un cliente puede
  tener varios vehículos, y embeber el vehículo dentro del cliente
  complicaría los `$lookup` que se necesitan para reportes por tipo de
  vehículo. Referencia = más flexible para 1 a muchos que crece con el tiempo.
- **`zonas` con capacidad, tarifa y tipos permitidos a nivel de ZONA (no de
  sede)**: dentro de una misma sede puede existir una zona solo de motos con
  tarifa baja y otra de carros con tarifa más alta. Guardar esos valores en
  `sedes` obligaría a que toda la sede comparta una sola tarifa, lo cual no
  refleja la realidad del negocio.
- **`parqueos` con referencias a `vehiculo_id`, `zona_id`, `sede_id` (no
  embebidos)**: un parqueo es un evento puntual, pero el vehículo o la zona
  pueden cambiar después (ej. la sede ajusta su tarifa). Si se embebiera esa
  información dentro de cada parqueo, un parqueo viejo quedaría con datos
  desactualizados o inconsistentes frente al vehículo/zona actual.

### 3.3 Validaciones `$jsonSchema` por colección

- **`usuarios`**: exige `nombre`, `apellido`, `dpi`, `email` y `rol`.
  El `email` se valida con una expresión regular. El `rol` solo acepta 3
  valores (`enum`). `sede_asignada` solo aplica a empleados. Se usa
  `additionalProperties: false` para que nadie pueda insertar campos no
  contemplados (por ejemplo, un campo de contraseña en texto plano por error).
- **`vehiculos`**: exige `placa`, `tipo` y `cliente_id`. El `tipo` está
  restringido a los 4 valores permitidos por el enunciado.
- **`sedes`**: exige `nombre`, `ciudad` y `direccion`, todos strings simples.
- **`zonas`**: exige `sede_id`, `codigo`, `capacidad_maxima`,
  `cupos_disponibles`, `tipos_permitidos` y `tarifa_por_hora`. Se valida que
  `capacidad_maxima` sea al menos 1, `cupos_disponibles` no sea negativo, y
  `tipos_permitidos` sea un arreglo con al menos un valor válido.
- **`parqueos`**: exige `vehiculo_id`, `zona_id`, `sede_id`, `hora_entrada` y
  `estado`. Los campos `hora_salida`, `tiempo_total_minutos` y `costo_total`
  aceptan `null` porque un parqueo "Activo" todavía no los tiene definidos.

### 3.4 Índices creados y su justificación técnica

| Índice | Colección | Tipo | Por qué |
|---|---|---|---|
| `dpi` | usuarios | único simple | Nadie puede repetir número de identificación (DPI). |
| `email` | usuarios | único simple | Nadie puede repetir correo (login). |
| `sede_asignada` | usuarios | simple | Buscar rápido qué empleados trabajan en una sede. |
| `rol` | usuarios | simple | Filtrar por tipo de usuario. |
| `placa` | vehiculos | único simple | No se puede repetir placa entre vehículos. |
| `cliente_id` | vehiculos | simple | Traer todos los vehículos de un cliente. |
| `tipo` | vehiculos | simple | Soporta la agregación de "tipo más frecuente". |
| `ciudad` | sedes | simple | Reportes agrupados por ciudad. |
| `sede_id + codigo` | zonas | único compuesto | El código de zona (`Z1`, `Z2`...) se repite entre sedes, pero no dentro de la misma sede. |
| `sede_id + cupos_disponibles` | zonas | compuesto | Saber rápido qué zonas de una sede aún tienen cupo. |
| `estado` | parqueos | simple | Consultas frecuentes de "activos vs finalizados". |
| `zona_id + estado` | parqueos | compuesto | Reporte de ocupación por zona (el que pide el enunciado explícitamente). |
| `hora_entrada` | parqueos | simple | Reportes por rango de fechas ("último mes"). |
| `vehiculo_id` | parqueos | simple | Soporta los `$lookup` de historial de cliente/vehículo. |
| `sede_id + estado` | parqueos | compuesto | Reporte de ocupación agrupado por sede. |

---

## 4. Estructura de los datos de prueba (`test_dataset.js`)

Todos los `_id` se escriben a mano con `ObjectId()` para poder referenciar
documentos entre colecciones sin depender de variables ni loops de JavaScript.
Los campos enteros se insertan con `NumberInt()` para cumplir el `bsonType: "int"`
del esquema.

| Colección | Documentos | Detalle |
|-----------|-----------:|---------|
| `sedes` | 3 | Guatemala, Quetzaltenango y Escuintla |
| `zonas` | 15 | 5 por sede, con distintas combinaciones de cupo, tarifa y tipos permitidos |
| `usuarios` | 26 | 1 administrador, 10 empleados repartidos entre sedes y 15 clientes |
| `vehiculos` | 30 | Los 4 tipos (Carro, Moto, Bicicleta, Camión), cada uno ligado a un cliente |
| `parqueos` | 50 | 8 **Activos** (sin salida) y 42 **Finalizados** con tiempo y costo calculados según la tarifa de su zona |

Al final del script se ejecutan consultas de verificación (conteos y parqueos
activos) para comprobar que los datos quedaron cargados correctamente.

---

## 5. Explicación de cada agregación (`aggregations.js`)

1. **Parqueos por sede en el último mes**: la fecha límite se calcula dentro
   del pipeline con `$dateSubtract` sobre `$$NOW`; se agrupa por `sede_id` y
   se hace `$lookup` para mostrar el nombre de la sede.
2. **Zona más ocupada por sede**: patrón `$group` → `$sort` → `$group` con
   `$first`, la forma estándar de obtener el "top 1 por categoría".
3. **Ingreso total por sede**: suma `costo_total` solo de parqueos
   `"Finalizado"`, ya que los activos aún no tienen costo.
4. **Cliente más frecuente**: navega `parqueos` → `vehiculos` → `usuarios`
   para contar visitas por cliente.
5. **Tipo de vehículo más frecuente por sede**: mismo patrón que la
   consulta 2, agrupando por tipo de vehículo.
6. **Historial de un cliente**: filtra por **DPI** (campo único, a diferencia
   del nombre). Se deja un DPI de ejemplo; para consultar otro cliente basta
   con cambiar ese valor.
7. **Vehículos parqueados actualmente**: filtra `estado: "Activo"` y hace
   `$lookup` a vehículo y sede.
8. **Zonas que excedieron su capacidad**: calcula la **ocupación simultánea
   histórica**: para cada parqueo cuenta cuántos otros de la misma zona se
   traslapan en el tiempo (los activos toman "ahora" como salida). El máximo
   por zona es su pico real, que se compara con `capacidad_maxima`.

---

## 6. Transacción MongoDB (`transactions.js`)

### Escenario

Registrar el **ingreso de un vehículo**: insertar el ticket en `parqueos` y
descontar un cupo en `zonas` como una sola unidad atómica.

### Paso a paso

1. Se abre una sesión (`db.getMongo().startSession()`) y se inicia la
   transacción (`session.startTransaction()`).
2. Se consulta el estado de la zona antes del cambio.
3. Se descuenta un cupo con `$inc: { cupos_disponibles: NumberInt(-1) }`
   dentro de la sesión.
4. Se inserta el documento del parqueo en estado `"Activo"` dentro de la
   misma sesión.
5. `session.commitTransaction()` confirma ambas operaciones juntas y
   `session.endSession()` cierra la sesión.
6. Se consulta la zona y el parqueo para verificar el resultado.

> Las transacciones multi-documento requieren que MongoDB se ejecute como
> **replica set** (ver sección 9).

---

## 7. Roles (`roles.js`)

### Descripción de cada rol

- **`administrador_total`**: lectura y escritura completa sobre todas las
  colecciones de la base, más el rol nativo `userAdmin` para poder crear y
  administrar otros usuarios.
- **`empleado_de_sede`**: solo lectura sobre `usuarios` y `vehiculos`,
  lectura sobre `sedes`, lectura/escritura sobre `zonas` (para reflejar
  cambios de cupo) y `parqueos` (para registrar ingresos/salidas).
- **`cliente_final`**: solo lectura sobre todas las colecciones relevantes
  para consultar su propia información, su historial y la disponibilidad
  general de zonas.

### Limitación reconocida (importante para la sustentación)

El RBAC nativo de MongoDB Community controla permisos **a nivel de
colección**, no a nivel de documento. Esto significa que, con roles nativos,
no se puede restringir directamente "este empleado solo puede ver los
parqueos de SU sede" ni "este cliente solo puede ver SU propia información"
— eso se implementa en la capa de aplicación (el backend siempre agrega un
filtro obligatorio como `{ sede_id: sedeDelEmpleadoLogueado }` o
`{ cliente_id: clienteLogueado }` a cada consulta, usando el dato guardado en
la sesión del usuario autenticado, nunca un valor que el cliente pueda
manipular). MongoDB Atlas ofrece mecanismos más avanzados (vistas con
`$$USER_ROLES`, Queryable Encryption) para escenarios de seguridad a nivel de
documento, pero quedan fuera del alcance de este proyecto.

### Ejemplo de creación de usuarios con esos roles

```js
db.createUser({
  user: "empleado_centro01",
  pwd: passwordPrompt(),
  roles: [{ role: "empleado_de_sede", db: "campus_parking" }]
});

db.grantRolesToUser("empleado_centro01", [
  { role: "empleado_de_sede", db: "campus_parking" }
]);
```

---

## 8. Conclusiones y mejoras posibles

**Conclusiones:**

- MongoDB resultó adecuado para el núcleo del sistema (catálogos de
  vehículos, sedes, zonas) gracias a su flexibilidad de esquema, pero el
  flujo de ingreso/salida de vehículos sí necesitó una transacción
  multi-documento para garantizar consistencia, lo cual confirma que
  "NoSQL" no significa "sin necesidad de consistencia fuerte" en ninguna
  parte del sistema — depende de qué tan crítica es cada operación.
- Separar `zonas` de `sedes` (en vez de anidar zonas dentro de la sede)
  permitió indexar y consultar zonas de forma independiente, lo cual fue
  clave para varias de las agregaciones.

**Mejoras posibles a futuro:**

- Mover la restricción de "empleado solo ve su sede" a un mecanismo más
  robusto que dependa menos de la disciplina del código del backend (por
  ejemplo, evaluando MongoDB Atlas con reglas de acceso a nivel de documento).
- Agregar un campo de auditoría (`creado_por`, `modificado_en`) en
  `parqueos` para poder rastrear cambios manuales hechos por empleados.
- Implementar un job programado que recalcule `cupos_disponibles` desde
  cero periódicamente, como mecanismo de "auto-corrección" ante cualquier
  inconsistencia que se escape de las transacciones.
- Agregar paginación e índices adicionales conforme crezca el volumen real
  de parqueos históricos, ya que los reportes de tipo Q8 (traslape de
  fechas) son más costosos computacionalmente que un `$group` simple.

---

## 9. Instalación y ejecución

### Requisitos

- MongoDB **5.0** (necesario para `$dateSubtract`), configurado como **replica set** para soportar transacciones.
- El shell clásico **`mongo`** (incluido en MongoDB 5.0).

> **Compatibilidad:** los scripts están escritos para el shell clásico `mongo`, que guarda
> todos los números como `double`, y usa la API de sesiones de ese shell. Con `mongosh`
> (MongoDB 6+) fallan dos cosas:
> - `test_dataset.js`: `tarifa_por_hora` se inserta como entero y el esquema exige `double`.
> - `transactions.js`: `mongosh` no acepta la opción `{ session: session }` en los métodos de colección.

### Opción rápida con Docker

```bash
docker run -d --name campus-parking -p 27017:27017 mongo:5 --replSet rs0
docker exec campus-parking mongo --quiet --eval "rs.initiate()"
```

### Orden de ejecución de los scripts

```bash
git clone https://github.com/IkerDahinten2/proyecto-mongodbii-ikerdahinten.git
cd proyecto-mongodbii-ikerdahinten
mongo campus_parking db_config.js
mongo campus_parking test_dataset.js
mongo campus_parking aggregations.js
mongo campus_parking transactions.js
```

`roles.js` usa `passwordPrompt()` para pedir las contraseñas de forma segura,
así que debe ejecutarse desde una sesión interactiva (`mongo campus_parking`) con `load("roles.js")`.

### Pruebas realizadas

Los scripts se ejecutaron en orden sobre MongoDB 5.0 (replica set en Docker):

| Verificación | Resultado |
|--------------|-----------|
| Colecciones y esquemas (`db_config.js`) | ✅ Sin errores |
| Datos de prueba | ✅ 3 sedes, 15 zonas, 26 usuarios, 30 vehículos, 50 parqueos |
| Validación `$jsonSchema` | ✅ Rechaza documentos incompletos |
| 8 agregaciones | ✅ Todas ejecutan y devuelven resultados coherentes |
| Transacción | ✅ Inserta el parqueo y descuenta 1 cupo de la zona |
| Roles y usuarios | ✅ Se crean los 3 roles y los 3 usuarios |

| Script | Función |
|--------|---------|
| `db_config.js` | Crea las colecciones con validación `$jsonSchema` y sus índices |
| `test_dataset.js` | Inserta los datos de prueba |
| `aggregations.js` | Ejecuta las 8 consultas analíticas |
| `transactions.js` | Registra un ingreso de vehículo de forma atómica |
| `roles.js` | Crea los roles y usuarios de prueba |

---

## 10. Flujo de ramas

| Rama | Propósito |
|------|-----------|
| `main` | Versión estable |
| `dev` | Integración de cambios |
| `backend` | Scripts de base de datos |

---

## Autor

**Iker Dahinten** — [@IkerDahinten2](https://github.com/IkerDahinten2)
