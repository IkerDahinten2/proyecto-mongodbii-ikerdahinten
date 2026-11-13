// Este script se corre despues de db_config.js
// Todos los _id se escriben a mano con ObjectId() para poder referenciarlos
// entre colecciones sin necesitar variables ni loops de JS

// Se insertan las 3 sedes
db.sedes.insertMany([
  { _id: ObjectId("650000000000000000000101"), nombre: "Campus Parking Centro", ciudad: "Guatemala", direccion: "6a Avenida 4-30, Zona 1" },
  { _id: ObjectId("650000000000000000000102"), nombre: "Campus Parking Norte", ciudad: "Quetzaltenango", direccion: "Calzada Independencia 12-45" },
  { _id: ObjectId("650000000000000000000103"), nombre: "Campus Parking Sur", ciudad: "Escuintla", direccion: "Ruta al Pacifico Km 58" }
]);
db.sedes.find();

// Se insertan las 15 zonas (5 por sede)
// Los campos int (capacidad_maxima y cupos_disponibles) se escriben con
// NumberInt() para que coincidan con el bsonType "int" del schema
db.zonas.insertMany([
  // Sede Centro
  { _id: ObjectId("650000000000000000000201"), sede_id: ObjectId("650000000000000000000101"), codigo: "Z1", capacidad_maxima: NumberInt(20), cupos_disponibles: NumberInt(18), tipos_permitidos: ["Carro"], tarifa_por_hora: 8.0 },
  { _id: ObjectId("650000000000000000000202"), sede_id: ObjectId("650000000000000000000101"), codigo: "Z2", capacidad_maxima: NumberInt(15), cupos_disponibles: NumberInt(13), tipos_permitidos: ["Carro", "Camion"], tarifa_por_hora: 10.0 },
  { _id: ObjectId("650000000000000000000203"), sede_id: ObjectId("650000000000000000000101"), codigo: "Z3", capacidad_maxima: NumberInt(30), cupos_disponibles: NumberInt(28), tipos_permitidos: ["Moto"], tarifa_por_hora: 4.0 },
  { _id: ObjectId("650000000000000000000204"), sede_id: ObjectId("650000000000000000000101"), codigo: "Z4", capacidad_maxima: NumberInt(10), cupos_disponibles: NumberInt(9), tipos_permitidos: ["Bicicleta"], tarifa_por_hora: 2.0 },
  { _id: ObjectId("650000000000000000000205"), sede_id: ObjectId("650000000000000000000101"), codigo: "Z5", capacidad_maxima: NumberInt(12), cupos_disponibles: NumberInt(11), tipos_permitidos: ["Carro", "Moto"], tarifa_por_hora: 12.0 },
  // Sede Norte
  { _id: ObjectId("650000000000000000000206"), sede_id: ObjectId("650000000000000000000102"), codigo: "Z1", capacidad_maxima: NumberInt(20), cupos_disponibles: NumberInt(19), tipos_permitidos: ["Carro"], tarifa_por_hora: 8.0 },
  { _id: ObjectId("650000000000000000000207"), sede_id: ObjectId("650000000000000000000102"), codigo: "Z2", capacidad_maxima: NumberInt(15), cupos_disponibles: NumberInt(14), tipos_permitidos: ["Carro", "Camion"], tarifa_por_hora: 10.0 },
  { _id: ObjectId("650000000000000000000208"), sede_id: ObjectId("650000000000000000000102"), codigo: "Z3", capacidad_maxima: NumberInt(30), cupos_disponibles: NumberInt(27), tipos_permitidos: ["Moto"], tarifa_por_hora: 4.0 },
  { _id: ObjectId("650000000000000000000209"), sede_id: ObjectId("650000000000000000000102"), codigo: "Z4", capacidad_maxima: NumberInt(10), cupos_disponibles: NumberInt(8), tipos_permitidos: ["Bicicleta"], tarifa_por_hora: 2.0 },
  { _id: ObjectId("650000000000000000000210"), sede_id: ObjectId("650000000000000000000102"), codigo: "Z5", capacidad_maxima: NumberInt(12), cupos_disponibles: NumberInt(10), tipos_permitidos: ["Carro", "Moto"], tarifa_por_hora: 12.0 },
  // Sede Sur
  { _id: ObjectId("650000000000000000000211"), sede_id: ObjectId("650000000000000000000103"), codigo: "Z1", capacidad_maxima: NumberInt(20), cupos_disponibles: NumberInt(17), tipos_permitidos: ["Carro"], tarifa_por_hora: 8.0 },
  { _id: ObjectId("650000000000000000000212"), sede_id: ObjectId("650000000000000000000103"), codigo: "Z2", capacidad_maxima: NumberInt(15), cupos_disponibles: NumberInt(12), tipos_permitidos: ["Carro", "Camion"], tarifa_por_hora: 10.0 },
  { _id: ObjectId("650000000000000000000213"), sede_id: ObjectId("650000000000000000000103"), codigo: "Z3", capacidad_maxima: NumberInt(30), cupos_disponibles: NumberInt(29), tipos_permitidos: ["Moto"], tarifa_por_hora: 4.0 },
  { _id: ObjectId("650000000000000000000214"), sede_id: ObjectId("650000000000000000000103"), codigo: "Z4", capacidad_maxima: NumberInt(10), cupos_disponibles: NumberInt(7), tipos_permitidos: ["Bicicleta"], tarifa_por_hora: 2.0 },
  { _id: ObjectId("650000000000000000000215"), sede_id: ObjectId("650000000000000000000103"), codigo: "Z5", capacidad_maxima: NumberInt(12), cupos_disponibles: NumberInt(9), tipos_permitidos: ["Carro", "Moto"], tarifa_por_hora: 12.0 }
]);
db.zonas.find();

// Se inserta el administrador
db.usuarios.insertOne({
  _id: ObjectId("650000000000000000000301"),
  nombre: "Andrea",
  apellido: "Marroquin",
  dpi: "1000000000101",
  email: "admin@campusparking.com",
  telefono: "50212345678",
  rol: "Administrador",
  sede_asignada: null,
  fecha_registro: ISODate("2025-01-10")
});
db.usuarios.find({ rol: "Administrador" });

// Se insertan los 10 empleados, repartidos entre las 3 sedes
db.usuarios.insertMany([
  { _id: ObjectId("650000000000000000000302"), nombre: "Jose", apellido: "Dahinten", dpi: "2000000000100", email: "empleado0@campusparking.com", telefono: "50211001000", rol: "Empleado de sede", sede_asignada: ObjectId("650000000000000000000101"), fecha_registro: ISODate("2025-01-25") },
  { _id: ObjectId("650000000000000000000303"), nombre: "Maria", apellido: "Lopez", dpi: "2000000000101", email: "empleado1@campusparking.com", telefono: "50211001001", rol: "Empleado de sede", sede_asignada: ObjectId("650000000000000000000102"), fecha_registro: ISODate("2025-02-09") },
  { _id: ObjectId("650000000000000000000304"), nombre: "Luis", apellido: "Gonzalez", dpi: "2000000000102", email: "empleado2@campusparking.com", telefono: "50211001002", rol: "Empleado de sede", sede_asignada: ObjectId("650000000000000000000103"), fecha_registro: ISODate("2025-02-24") },
  { _id: ObjectId("650000000000000000000305"), nombre: "Ana", apellido: "Ramirez", dpi: "2000000000103", email: "empleado3@campusparking.com", telefono: "50211001003", rol: "Empleado de sede", sede_asignada: ObjectId("650000000000000000000101"), fecha_registro: ISODate("2025-03-11") },
  { _id: ObjectId("650000000000000000000306"), nombre: "Carlos", apellido: "Castillo", dpi: "2000000000104", email: "empleado4@campusparking.com", telefono: "50211001004", rol: "Empleado de sede", sede_asignada: ObjectId("650000000000000000000102"), fecha_registro: ISODate("2025-03-26") },
  { _id: ObjectId("650000000000000000000307"), nombre: "Sofia", apellido: "Morales", dpi: "2000000000105", email: "empleado5@campusparking.com", telefono: "50211001005", rol: "Empleado de sede", sede_asignada: ObjectId("650000000000000000000103"), fecha_registro: ISODate("2025-04-10") },
  { _id: ObjectId("650000000000000000000308"), nombre: "Diego", apellido: "Ortiz", dpi: "2000000000106", email: "empleado6@campusparking.com", telefono: "50211001006", rol: "Empleado de sede", sede_asignada: ObjectId("650000000000000000000101"), fecha_registro: ISODate("2025-04-25") },
  { _id: ObjectId("650000000000000000000309"), nombre: "Valeria", apellido: "Reyes", dpi: "2000000000107", email: "empleado7@campusparking.com", telefono: "50211001007", rol: "Empleado de sede", sede_asignada: ObjectId("650000000000000000000102"), fecha_registro: ISODate("2025-05-10") },
  { _id: ObjectId("650000000000000000000310"), nombre: "Andres", apellido: "Mendez", dpi: "2000000000108", email: "empleado8@campusparking.com", telefono: "50211001008", rol: "Empleado de sede", sede_asignada: ObjectId("650000000000000000000103"), fecha_registro: ISODate("2025-05-25") },
  { _id: ObjectId("650000000000000000000311"), nombre: "Camila", apellido: "Chavez", dpi: "2000000000109", email: "empleado9@campusparking.com", telefono: "50211001009", rol: "Empleado de sede", sede_asignada: ObjectId("650000000000000000000101"), fecha_registro: ISODate("2025-06-09") }
]);
db.usuarios.find({ rol: "Empleado de sede" });

// Se insertan los 15 clientes
db.usuarios.insertMany([
  { _id: ObjectId("650000000000000000000312"), nombre: "Pedro", apellido: "Aguilar", dpi: "3000000000200", email: "cliente0@correo.com", telefono: "50212002000", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-06-24") },
  { _id: ObjectId("650000000000000000000313"), nombre: "Laura", apellido: "Vasquez", dpi: "3000000000201", email: "cliente1@correo.com", telefono: "50212002001", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-07-09") },
  { _id: ObjectId("650000000000000000000314"), nombre: "Miguel", apellido: "Cifuentes", dpi: "3000000000202", email: "cliente2@correo.com", telefono: "50212002002", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-07-24") },
  { _id: ObjectId("650000000000000000000315"), nombre: "Fernanda", apellido: "Paz", dpi: "3000000000203", email: "cliente3@correo.com", telefono: "50212002003", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-08-08") },
  { _id: ObjectId("650000000000000000000316"), nombre: "Ricardo", apellido: "Solorzano", dpi: "3000000000204", email: "cliente4@correo.com", telefono: "50212002004", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-08-23") },
  { _id: ObjectId("650000000000000000000317"), nombre: "Daniela", apellido: "Barrios", dpi: "3000000000205", email: "cliente5@correo.com", telefono: "50212002005", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-09-07") },
  { _id: ObjectId("650000000000000000000318"), nombre: "Oscar", apellido: "Estrada", dpi: "3000000000206", email: "cliente6@correo.com", telefono: "50212002006", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-09-22") },
  { _id: ObjectId("650000000000000000000319"), nombre: "Paola", apellido: "Juarez", dpi: "3000000000207", email: "cliente7@correo.com", telefono: "50212002007", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-10-07") },
  { _id: ObjectId("650000000000000000000320"), nombre: "Hugo", apellido: "Roldan", dpi: "3000000000208", email: "cliente8@correo.com", telefono: "50212002008", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-10-22") },
  { _id: ObjectId("650000000000000000000321"), nombre: "Renata", apellido: "Herrera", dpi: "3000000000209", email: "cliente9@correo.com", telefono: "50212002009", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-11-06") },
  { _id: ObjectId("650000000000000000000322"), nombre: "Manuel", apellido: "Pineda", dpi: "3000000000210", email: "cliente10@correo.com", telefono: "50212002010", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-11-21") },
  { _id: ObjectId("650000000000000000000323"), nombre: "Gabriela", apellido: "Xitumul", dpi: "3000000000211", email: "cliente11@correo.com", telefono: "50212002011", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-12-06") },
  { _id: ObjectId("650000000000000000000324"), nombre: "Victor", apellido: "Coy", dpi: "3000000000212", email: "cliente12@correo.com", telefono: "50212002012", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2025-12-21") },
  { _id: ObjectId("650000000000000000000325"), nombre: "Lucia", apellido: "Guzman", dpi: "3000000000213", email: "cliente13@correo.com", telefono: "50212002013", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2026-01-05") },
  { _id: ObjectId("650000000000000000000326"), nombre: "Ivan", apellido: "Rios", dpi: "3000000000214", email: "cliente14@correo.com", telefono: "50212002014", rol: "Cliente", sede_asignada: null, fecha_registro: ISODate("2026-01-20") }
]);
db.usuarios.find({ rol: "Cliente" });

// Se insertan los 30 vehiculos, de 4 tipos distintos, cada uno de un cliente
db.vehiculos.insertMany([
  { _id: ObjectId("650000000000000000000401"), placa: "P100001", tipo: "Carro", marca: "Toyota", modelo: "2017", color: "Rojo", cliente_id: ObjectId("650000000000000000000312") },
  { _id: ObjectId("650000000000000000000402"), placa: "P100002", tipo: "Moto", marca: "Yamaha", modelo: "2018", color: "Negro", cliente_id: ObjectId("650000000000000000000313") },
  { _id: ObjectId("650000000000000000000403"), placa: "P100003", tipo: "Bicicleta", marca: "GW", modelo: "2019", color: "Blanco", cliente_id: ObjectId("650000000000000000000314") },
  { _id: ObjectId("650000000000000000000404"), placa: "P100004", tipo: "Camion", marca: "Isuzu", modelo: "2020", color: "Gris", cliente_id: ObjectId("650000000000000000000315") },
  { _id: ObjectId("650000000000000000000405"), placa: "P100005", tipo: "Carro", marca: "Mazda", modelo: "2021", color: "Azul", cliente_id: ObjectId("650000000000000000000316") },
  { _id: ObjectId("650000000000000000000406"), placa: "P100006", tipo: "Moto", marca: "Honda", modelo: "2022", color: "Rojo", cliente_id: ObjectId("650000000000000000000317") },
  { _id: ObjectId("650000000000000000000407"), placa: "P100007", tipo: "Bicicleta", marca: "Scott", modelo: "2023", color: "Negro", cliente_id: ObjectId("650000000000000000000318") },
  { _id: ObjectId("650000000000000000000408"), placa: "P100008", tipo: "Camion", marca: "Hino", modelo: "2024", color: "Blanco", cliente_id: ObjectId("650000000000000000000319") },
  { _id: ObjectId("650000000000000000000409"), placa: "P100009", tipo: "Carro", marca: "Hyundai", modelo: "2016", color: "Gris", cliente_id: ObjectId("650000000000000000000320") },
  { _id: ObjectId("650000000000000000000410"), placa: "P100010", tipo: "Moto", marca: "Suzuki", modelo: "2017", color: "Azul", cliente_id: ObjectId("650000000000000000000321") },
  { _id: ObjectId("650000000000000000000411"), placa: "P100011", tipo: "Bicicleta", marca: "Trek", modelo: "2018", color: "Rojo", cliente_id: ObjectId("650000000000000000000322") },
  { _id: ObjectId("650000000000000000000412"), placa: "P100012", tipo: "Camion", marca: "Ford", modelo: "2019", color: "Negro", cliente_id: ObjectId("650000000000000000000323") },
  { _id: ObjectId("650000000000000000000413"), placa: "P100013", tipo: "Carro", marca: "Kia", modelo: "2020", color: "Blanco", cliente_id: ObjectId("650000000000000000000324") },
  { _id: ObjectId("650000000000000000000414"), placa: "P100014", tipo: "Moto", marca: "Yamaha", modelo: "2021", color: "Gris", cliente_id: ObjectId("650000000000000000000325") },
  { _id: ObjectId("650000000000000000000415"), placa: "P100015", tipo: "Bicicleta", marca: "GW", modelo: "2022", color: "Azul", cliente_id: ObjectId("650000000000000000000326") },
  { _id: ObjectId("650000000000000000000416"), placa: "P100016", tipo: "Camion", marca: "Isuzu", modelo: "2023", color: "Rojo", cliente_id: ObjectId("650000000000000000000312") },
  { _id: ObjectId("650000000000000000000417"), placa: "P100017", tipo: "Carro", marca: "Toyota", modelo: "2024", color: "Negro", cliente_id: ObjectId("650000000000000000000313") },
  { _id: ObjectId("650000000000000000000418"), placa: "P100018", tipo: "Moto", marca: "Honda", modelo: "2016", color: "Blanco", cliente_id: ObjectId("650000000000000000000314") },
  { _id: ObjectId("650000000000000000000419"), placa: "P100019", tipo: "Bicicleta", marca: "Scott", modelo: "2017", color: "Gris", cliente_id: ObjectId("650000000000000000000315") },
  { _id: ObjectId("650000000000000000000420"), placa: "P100020", tipo: "Camion", marca: "Hino", modelo: "2018", color: "Azul", cliente_id: ObjectId("650000000000000000000316") },
  { _id: ObjectId("650000000000000000000421"), placa: "P100021", tipo: "Carro", marca: "Mazda", modelo: "2019", color: "Rojo", cliente_id: ObjectId("650000000000000000000317") },
  { _id: ObjectId("650000000000000000000422"), placa: "P100022", tipo: "Moto", marca: "Suzuki", modelo: "2020", color: "Negro", cliente_id: ObjectId("650000000000000000000318") },
  { _id: ObjectId("650000000000000000000423"), placa: "P100023", tipo: "Bicicleta", marca: "Trek", modelo: "2021", color: "Blanco", cliente_id: ObjectId("650000000000000000000319") },
  { _id: ObjectId("650000000000000000000424"), placa: "P100024", tipo: "Camion", marca: "Ford", modelo: "2022", color: "Gris", cliente_id: ObjectId("650000000000000000000320") },
  { _id: ObjectId("650000000000000000000425"), placa: "P100025", tipo: "Carro", marca: "Hyundai", modelo: "2023", color: "Azul", cliente_id: ObjectId("650000000000000000000321") },
  { _id: ObjectId("650000000000000000000426"), placa: "P100026", tipo: "Moto", marca: "Yamaha", modelo: "2024", color: "Rojo", cliente_id: ObjectId("650000000000000000000322") },
  { _id: ObjectId("650000000000000000000427"), placa: "P100027", tipo: "Bicicleta", marca: "GW", modelo: "2016", color: "Negro", cliente_id: ObjectId("650000000000000000000323") },
  { _id: ObjectId("650000000000000000000428"), placa: "P100028", tipo: "Camion", marca: "Isuzu", modelo: "2017", color: "Blanco", cliente_id: ObjectId("650000000000000000000324") },
  { _id: ObjectId("650000000000000000000429"), placa: "P100029", tipo: "Carro", marca: "Kia", modelo: "2018", color: "Gris", cliente_id: ObjectId("650000000000000000000325") },
  { _id: ObjectId("650000000000000000000430"), placa: "P100030", tipo: "Moto", marca: "Honda", modelo: "2019", color: "Azul", cliente_id: ObjectId("650000000000000000000326") }
]);
db.vehiculos.find();

// Se insertan los 50 parqueos
// Los primeros 8 quedan Activos (sin hora_salida, sin tiempo ni costo)
// El resto queda Finalizado con tiempo_total_minutos y costo_total ya
// calculados a mano segun la tarifa de su zona (tiempo/60 * tarifa_por_hora)
db.parqueos.insertMany([
  // Activos
  { vehiculo_id: ObjectId("650000000000000000000401"), zona_id: ObjectId("650000000000000000000201"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-07-15T08:00:00Z"), hora_salida: null, estado: "Activo", tiempo_total_minutos: null, costo_total: null },
  { vehiculo_id: ObjectId("650000000000000000000402"), zona_id: ObjectId("650000000000000000000208"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-07-15T14:30:00Z"), hora_salida: null, estado: "Activo", tiempo_total_minutos: null, costo_total: null },
  { vehiculo_id: ObjectId("650000000000000000000403"), zona_id: ObjectId("650000000000000000000214"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-07-16T09:15:00Z"), hora_salida: null, estado: "Activo", tiempo_total_minutos: null, costo_total: null },
  { vehiculo_id: ObjectId("650000000000000000000404"), zona_id: ObjectId("650000000000000000000202"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-07-16T16:45:00Z"), hora_salida: null, estado: "Activo", tiempo_total_minutos: null, costo_total: null },
  { vehiculo_id: ObjectId("650000000000000000000405"), zona_id: ObjectId("650000000000000000000206"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-07-17T07:20:00Z"), hora_salida: null, estado: "Activo", tiempo_total_minutos: null, costo_total: null },
  { vehiculo_id: ObjectId("650000000000000000000406"), zona_id: ObjectId("650000000000000000000213"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-07-17T13:10:00Z"), hora_salida: null, estado: "Activo", tiempo_total_minutos: null, costo_total: null },
  { vehiculo_id: ObjectId("650000000000000000000407"), zona_id: ObjectId("650000000000000000000204"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-07-18T06:50:00Z"), hora_salida: null, estado: "Activo", tiempo_total_minutos: null, costo_total: null },
  { vehiculo_id: ObjectId("650000000000000000000408"), zona_id: ObjectId("650000000000000000000207"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-07-18T10:05:00Z"), hora_salida: null, estado: "Activo", tiempo_total_minutos: null, costo_total: null },

  // Finalizados, 45 minutos cada uno
  { vehiculo_id: ObjectId("650000000000000000000409"), zona_id: ObjectId("650000000000000000000211"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-06-01T08:00:00Z"), hora_salida: ISODate("2026-06-01T08:45:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(45), costo_total: 6.00 },
  { vehiculo_id: ObjectId("650000000000000000000410"), zona_id: ObjectId("650000000000000000000203"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-06-02T09:30:00Z"), hora_salida: ISODate("2026-06-02T10:15:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(45), costo_total: 3.00 },
  { vehiculo_id: ObjectId("650000000000000000000411"), zona_id: ObjectId("650000000000000000000209"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-06-03T11:00:00Z"), hora_salida: ISODate("2026-06-03T11:45:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(45), costo_total: 1.50 },
  { vehiculo_id: ObjectId("650000000000000000000412"), zona_id: ObjectId("650000000000000000000212"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-06-04T13:20:00Z"), hora_salida: ISODate("2026-06-04T14:05:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(45), costo_total: 7.50 },
  { vehiculo_id: ObjectId("650000000000000000000413"), zona_id: ObjectId("650000000000000000000201"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-06-05T15:10:00Z"), hora_salida: ISODate("2026-06-05T15:55:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(45), costo_total: 6.00 },
  { vehiculo_id: ObjectId("650000000000000000000414"), zona_id: ObjectId("650000000000000000000208"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-06-06T07:45:00Z"), hora_salida: ISODate("2026-06-06T08:30:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(45), costo_total: 3.00 },
  { vehiculo_id: ObjectId("650000000000000000000415"), zona_id: ObjectId("650000000000000000000214"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-06-07T10:00:00Z"), hora_salida: ISODate("2026-06-07T10:45:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(45), costo_total: 1.50 },
  { vehiculo_id: ObjectId("650000000000000000000416"), zona_id: ObjectId("650000000000000000000202"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-06-08T12:30:00Z"), hora_salida: ISODate("2026-06-08T13:15:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(45), costo_total: 7.50 },
  { vehiculo_id: ObjectId("650000000000000000000417"), zona_id: ObjectId("650000000000000000000206"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-06-09T14:00:00Z"), hora_salida: ISODate("2026-06-09T14:45:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(45), costo_total: 6.00 },
  { vehiculo_id: ObjectId("650000000000000000000418"), zona_id: ObjectId("650000000000000000000213"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-06-10T16:20:00Z"), hora_salida: ISODate("2026-06-10T17:05:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(45), costo_total: 3.00 },

  // Finalizados, 120 minutos cada uno
  { vehiculo_id: ObjectId("650000000000000000000419"), zona_id: ObjectId("650000000000000000000204"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-06-11T08:00:00Z"), hora_salida: ISODate("2026-06-11T10:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(120), costo_total: 4.00 },
  { vehiculo_id: ObjectId("650000000000000000000420"), zona_id: ObjectId("650000000000000000000207"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-06-12T09:00:00Z"), hora_salida: ISODate("2026-06-12T11:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(120), costo_total: 20.00 },
  { vehiculo_id: ObjectId("650000000000000000000421"), zona_id: ObjectId("650000000000000000000211"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-06-13T10:00:00Z"), hora_salida: ISODate("2026-06-13T12:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(120), costo_total: 16.00 },
  { vehiculo_id: ObjectId("650000000000000000000422"), zona_id: ObjectId("650000000000000000000203"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-06-14T11:00:00Z"), hora_salida: ISODate("2026-06-14T13:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(120), costo_total: 8.00 },
  { vehiculo_id: ObjectId("650000000000000000000423"), zona_id: ObjectId("650000000000000000000209"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-06-15T12:00:00Z"), hora_salida: ISODate("2026-06-15T14:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(120), costo_total: 4.00 },
  { vehiculo_id: ObjectId("650000000000000000000424"), zona_id: ObjectId("650000000000000000000212"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-06-16T13:00:00Z"), hora_salida: ISODate("2026-06-16T15:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(120), costo_total: 20.00 },
  { vehiculo_id: ObjectId("650000000000000000000425"), zona_id: ObjectId("650000000000000000000201"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-06-17T14:00:00Z"), hora_salida: ISODate("2026-06-17T16:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(120), costo_total: 16.00 },
  { vehiculo_id: ObjectId("650000000000000000000426"), zona_id: ObjectId("650000000000000000000208"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-06-18T15:00:00Z"), hora_salida: ISODate("2026-06-18T17:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(120), costo_total: 8.00 },
  { vehiculo_id: ObjectId("650000000000000000000427"), zona_id: ObjectId("650000000000000000000214"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-06-19T16:00:00Z"), hora_salida: ISODate("2026-06-19T18:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(120), costo_total: 4.00 },
  { vehiculo_id: ObjectId("650000000000000000000428"), zona_id: ObjectId("650000000000000000000202"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-06-20T17:00:00Z"), hora_salida: ISODate("2026-06-20T19:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(120), costo_total: 20.00 },

  // Finalizados, 200 minutos cada uno
  { vehiculo_id: ObjectId("650000000000000000000429"), zona_id: ObjectId("650000000000000000000206"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-06-21T07:00:00Z"), hora_salida: ISODate("2026-06-21T10:20:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(200), costo_total: 26.67 },
  { vehiculo_id: ObjectId("650000000000000000000430"), zona_id: ObjectId("650000000000000000000213"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-06-22T08:00:00Z"), hora_salida: ISODate("2026-06-22T11:20:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(200), costo_total: 13.33 },
  { vehiculo_id: ObjectId("650000000000000000000401"), zona_id: ObjectId("650000000000000000000201"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-06-23T09:00:00Z"), hora_salida: ISODate("2026-06-23T12:20:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(200), costo_total: 26.67 },
  { vehiculo_id: ObjectId("650000000000000000000402"), zona_id: ObjectId("650000000000000000000208"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-06-24T10:00:00Z"), hora_salida: ISODate("2026-06-24T13:20:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(200), costo_total: 13.33 },
  { vehiculo_id: ObjectId("650000000000000000000403"), zona_id: ObjectId("650000000000000000000214"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-06-25T11:00:00Z"), hora_salida: ISODate("2026-06-25T14:20:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(200), costo_total: 6.67 },
  { vehiculo_id: ObjectId("650000000000000000000404"), zona_id: ObjectId("650000000000000000000202"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-06-26T12:00:00Z"), hora_salida: ISODate("2026-06-26T15:20:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(200), costo_total: 33.33 },
  { vehiculo_id: ObjectId("650000000000000000000405"), zona_id: ObjectId("650000000000000000000206"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-06-27T13:00:00Z"), hora_salida: ISODate("2026-06-27T16:20:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(200), costo_total: 26.67 },
  { vehiculo_id: ObjectId("650000000000000000000406"), zona_id: ObjectId("650000000000000000000213"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-06-28T14:00:00Z"), hora_salida: ISODate("2026-06-28T17:20:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(200), costo_total: 13.33 },
  { vehiculo_id: ObjectId("650000000000000000000407"), zona_id: ObjectId("650000000000000000000204"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-06-29T15:00:00Z"), hora_salida: ISODate("2026-06-29T18:20:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(200), costo_total: 6.67 },
  { vehiculo_id: ObjectId("650000000000000000000408"), zona_id: ObjectId("650000000000000000000207"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-06-30T16:00:00Z"), hora_salida: ISODate("2026-06-30T19:20:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(200), costo_total: 33.33 },

  // Finalizados, 300 minutos cada uno
  { vehiculo_id: ObjectId("650000000000000000000409"), zona_id: ObjectId("650000000000000000000211"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-07-01T06:00:00Z"), hora_salida: ISODate("2026-07-01T11:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 40.00 },
  { vehiculo_id: ObjectId("650000000000000000000410"), zona_id: ObjectId("650000000000000000000203"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-07-02T07:00:00Z"), hora_salida: ISODate("2026-07-02T12:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 20.00 },
  { vehiculo_id: ObjectId("650000000000000000000411"), zona_id: ObjectId("650000000000000000000209"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-07-03T08:00:00Z"), hora_salida: ISODate("2026-07-03T13:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 10.00 },
  { vehiculo_id: ObjectId("650000000000000000000412"), zona_id: ObjectId("650000000000000000000212"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-07-04T09:00:00Z"), hora_salida: ISODate("2026-07-04T14:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 50.00 },
  { vehiculo_id: ObjectId("650000000000000000000413"), zona_id: ObjectId("650000000000000000000201"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-07-05T10:00:00Z"), hora_salida: ISODate("2026-07-05T15:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 40.00 },
  { vehiculo_id: ObjectId("650000000000000000000414"), zona_id: ObjectId("650000000000000000000208"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-07-06T11:00:00Z"), hora_salida: ISODate("2026-07-06T16:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 20.00 },
  { vehiculo_id: ObjectId("650000000000000000000415"), zona_id: ObjectId("650000000000000000000214"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-07-07T12:00:00Z"), hora_salida: ISODate("2026-07-07T17:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 10.00 },
  { vehiculo_id: ObjectId("650000000000000000000416"), zona_id: ObjectId("650000000000000000000202"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-07-08T13:00:00Z"), hora_salida: ISODate("2026-07-08T18:00:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 50.00 },
  { vehiculo_id: ObjectId("650000000000000000000417"), zona_id: ObjectId("650000000000000000000206"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-07-09T06:30:00Z"), hora_salida: ISODate("2026-07-09T11:30:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 40.00 },
  { vehiculo_id: ObjectId("650000000000000000000418"), zona_id: ObjectId("650000000000000000000213"), sede_id: ObjectId("650000000000000000000103"), hora_entrada: ISODate("2026-07-10T07:30:00Z"), hora_salida: ISODate("2026-07-10T12:30:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 20.00 },
  { vehiculo_id: ObjectId("650000000000000000000419"), zona_id: ObjectId("650000000000000000000204"), sede_id: ObjectId("650000000000000000000101"), hora_entrada: ISODate("2026-07-11T08:30:00Z"), hora_salida: ISODate("2026-07-11T13:30:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 10.00 },
  { vehiculo_id: ObjectId("650000000000000000000420"), zona_id: ObjectId("650000000000000000000207"), sede_id: ObjectId("650000000000000000000102"), hora_entrada: ISODate("2026-07-12T09:30:00Z"), hora_salida: ISODate("2026-07-12T14:30:00Z"), estado: "Finalizado", tiempo_total_minutos: NumberInt(300), costo_total: 50.00 }
]);
// Se verifica que si haya quedado el total correcto y que los 8 activos
// si esten marcados como tal (no es una suposicion, es una consulta real)
db.parqueos.find();
db.parqueos.find({ estado: "Activo" });

// Verificacion final, total de usuarios entre admin + empleados + clientes
db.usuarios.find();
