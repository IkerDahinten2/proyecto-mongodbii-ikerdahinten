// Cuantos parqueos se registraron por sede en el ultimo mes
// La fecha de "hace un mes" se calcula adentro del pipeline con
// $dateSubtract, un operador propio de Mongo, para no usar new Date() de JS
db.parqueos.aggregate([
  {
    $match: {
      $expr: {
        $gte: [
          "$hora_entrada",
          { $dateSubtract: { startDate: "$$NOW", unit: "month", amount: 1 } }
        ]
      }
    }
  },
  { $group: { _id: "$sede_id", total: { $sum: 1 } } },
  { $lookup: { from: "sedes", localField: "_id", foreignField: "_id", as: "sede" } },
  { $unwind: "$sede" },
  { $project: { _id: 0, sede: "$sede.nombre", total_parqueos: "$total" } },
  { $sort: { total_parqueos: -1 } }
]);

// Cual es la zona mas ocupada de cada sede
// Se agrupa por sede y zona, se ordena de mayor a menor, y se vuelve a
// agrupar por sede tomando el primero de cada grupo (el que tiene mas usos)
db.parqueos.aggregate([
  { $group: { _id: { sede: "$sede_id", zona: "$zona_id" }, total: { $sum: 1 } } },
  { $sort: { "_id.sede": 1, total: -1 } },
  { $group: { _id: "$_id.sede", zonaTop: { $first: "$_id.zona" }, usos: { $first: "$total" } } },
  { $lookup: { from: "sedes", localField: "_id", foreignField: "_id", as: "s" } },
  { $lookup: { from: "zonas", localField: "zonaTop", foreignField: "_id", as: "z" } },
  { $unwind: "$s" },
  { $unwind: "$z" },
  { $project: { _id: 0, sede: "$s.nombre", zona_mas_ocupada: "$z.codigo", usos: 1 } }
]);

// Cual es el ingreso total generado por parqueo en cada sede
// Solo se cuentan los finalizados porque los activos todavia no tienen costo
db.parqueos.aggregate([
  { $match: { estado: "Finalizado" } },
  { $group: { _id: "$sede_id", total: { $sum: "$costo_total" } } },
  { $lookup: { from: "sedes", localField: "_id", foreignField: "_id", as: "s" } },
  { $unwind: "$s" },
  { $project: { _id: 0, sede: "$s.nombre", ingreso_total: { $round: ["$total", 2] } } },
  { $sort: { ingreso_total: -1 } }
]);

// Que cliente ha usado mas veces el parqueadero
db.parqueos.aggregate([
  { $lookup: { from: "vehiculos", localField: "vehiculo_id", foreignField: "_id", as: "v" } },
  { $unwind: "$v" },
  { $group: { _id: "$v.cliente_id", visitas: { $sum: 1 } } },
  { $sort: { visitas: -1 } },
  { $limit: 1 },
  { $lookup: { from: "usuarios", localField: "_id", foreignField: "_id", as: "u" } },
  { $unwind: "$u" },
  { $project: { _id: 0, cliente: { $concat: ["$u.nombre", " ", "$u.apellido"] }, visitas: 1 } }
]);

// Que tipo de vehiculo es mas frecuente por sede
db.parqueos.aggregate([
  { $lookup: { from: "vehiculos", localField: "vehiculo_id", foreignField: "_id", as: "v" } },
  { $unwind: "$v" },
  { $group: { _id: { sede: "$sede_id", tipo: "$v.tipo" }, conteo: { $sum: 1 } } },
  { $sort: { "_id.sede": 1, conteo: -1 } },
  { $group: { _id: "$_id.sede", tipoTop: { $first: "$_id.tipo" }, total: { $first: "$conteo" } } },
  { $lookup: { from: "sedes", localField: "_id", foreignField: "_id", as: "s" } },
  { $unwind: "$s" },
  { $project: { _id: 0, sede: "$s.nombre", tipo_vehiculo_mas_frecuente: "$tipoTop", total: 1 } }
]);

// Historial de parqueos de un cliente
// Se usa el DPI en el filtro porque si es unico (el nombre se puede
// repetir). Aqui se deja el DPI de Pedro Aguilar como ejemplo, para
// consultar otro cliente solo hay que cambiar ese valor
db.parqueos.aggregate([
  { $lookup: { from: "vehiculos", localField: "vehiculo_id", foreignField: "_id", as: "v" } },
  { $unwind: "$v" },
  { $lookup: { from: "usuarios", localField: "v.cliente_id", foreignField: "_id", as: "u" } },
  { $unwind: "$u" },
  { $match: { "u.dpi": "3000000000200" } },
  { $lookup: { from: "sedes", localField: "sede_id", foreignField: "_id", as: "s" } },
  { $lookup: { from: "zonas", localField: "zona_id", foreignField: "_id", as: "z" } },
  { $unwind: "$s" },
  { $unwind: "$z" },
  {
    $project: {
      _id: 0,
      fecha: "$hora_entrada",
      sede: "$s.nombre",
      zona: "$z.codigo",
      tipo_vehiculo: "$v.tipo",
      tiempo_minutos: "$tiempo_total_minutos",
      costo: "$costo_total"
    }
  },
  { $sort: { fecha: -1 } }
]);

// Vehiculos parqueados actualmente en cada sede
db.parqueos.aggregate([
  { $match: { estado: "Activo" } },
  { $lookup: { from: "vehiculos", localField: "vehiculo_id", foreignField: "_id", as: "v" } },
  { $lookup: { from: "sedes", localField: "sede_id", foreignField: "_id", as: "s" } },
  { $unwind: "$v" },
  { $unwind: "$s" },
  { $project: { _id: 0, sede: "$s.nombre", placa: "$v.placa", tipo: "$v.tipo", hora_entrada: 1 } },
  { $sort: { sede: 1, hora_entrada: 1 } }
]);

// Zonas que en algun momento excedieron su capacidad
// Para cada parqueo se cuentan cuantos otros parqueos de la misma zona se
// cruzan en el tiempo (si un parqueo sigue activo se toma "ahorita" como su
// salida). El mayor cruce encontrado por zona es la ocupacion pico real
db.parqueos.aggregate([
  {
    $lookup: {
      from: "parqueos",
      let: {
        zonaActual: "$zona_id",
        entradaActual: "$hora_entrada",
        salidaActual: { $ifNull: ["$hora_salida", "$$NOW"] }
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$zona_id", "$$zonaActual"] },
                { $lte: ["$hora_entrada", "$$salidaActual"] },
                { $gte: [{ $ifNull: ["$hora_salida", "$$NOW"] }, "$$entradaActual"] }
              ]
            }
          }
        }
      ],
      as: "traslapados"
    }
  },
  { $addFields: { ocupacion_simultanea: { $size: "$traslapados" } } },
  { $group: { _id: "$zona_id", ocupacion_pico: { $max: "$ocupacion_simultanea" } } },
  { $lookup: { from: "zonas", localField: "_id", foreignField: "_id", as: "z" } },
  { $unwind: "$z" },
  { $match: { $expr: { $gt: ["$ocupacion_pico", "$z.capacidad_maxima"] } } },
  { $lookup: { from: "sedes", localField: "z.sede_id", foreignField: "_id", as: "s" } },
  { $unwind: "$s" },
  {
    $project: {
      _id: 0,
      sede: "$s.nombre",
      zona: "$z.codigo",
      capacidad_maxima: "$z.capacidad_maxima",
      ocupacion_pico_detectada: "$ocupacion_pico"
    }
  }
]);
