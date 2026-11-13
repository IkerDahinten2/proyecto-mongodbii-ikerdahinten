// Se abre la sesion para la transaccion
session = db.getMongo().startSession();
session.startTransaction();

// Se consulta la zona antes de tocarla
db.zonas.find({ _id: ObjectId("650000000000000000000201") });

// Se resta un cupo de la zona
session.getDatabase(db.getName()).zonas.updateOne(
  { _id: ObjectId("650000000000000000000201") },
  { $inc: { cupos_disponibles: NumberInt(-1) } },
  { session: session }
);

// Se guarda el ticket del vehiculo que entro
session.getDatabase(db.getName()).parqueos.insertOne(
  {
    vehiculo_id: ObjectId("650000000000000000000401"),
    zona_id: ObjectId("650000000000000000000201"),
    sede_id: ObjectId("650000000000000000000101"),
    hora_entrada: new Date(),
    hora_salida: null,
    estado: "Activo",
    tiempo_total_minutos: null,
    costo_total: null
  },
  { session: session }
);

// Se confirma la transaccion
session.commitTransaction();
session.endSession();

// Se consulta como quedo la zona y el parqueo despues de la transaccion
db.zonas.find({ _id: ObjectId("650000000000000000000201") });
db.parqueos.find({ vehiculo_id: ObjectId("650000000000000000000401"), estado: "Activo" });
