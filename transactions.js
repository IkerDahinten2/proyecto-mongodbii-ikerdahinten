// Registro del ingreso de un vehiculo como transaccion multi-documento.
// Se resta un cupo de la zona y se inserta el ticket del parqueo: o se
// aplican las dos operaciones o ninguna.
//
// Compatible con el shell clasico mongo y con mongosh: las operaciones se
// hacen sobre session.getDatabase(), que ya esta ligada a la sesion, en vez
// de pasar { session } como opcion (mongosh no acepta esa opcion).

function registrarIngreso(vehiculoId, zonaId) {
  var session = db.getMongo().startSession();
  var sdb = session.getDatabase(db.getName());

  session.startTransaction();
  try {
    var zona = sdb.zonas.findOne({ _id: zonaId });
    if (!zona) throw new Error("La zona no existe");

    var vehiculo = sdb.vehiculos.findOne({ _id: vehiculoId });
    if (!vehiculo) throw new Error("El vehiculo no existe");

    if (zona.tipos_permitidos.indexOf(vehiculo.tipo) === -1) {
      throw new Error("La zona " + zona.codigo + " no permite vehiculos tipo " + vehiculo.tipo);
    }

    // Un vehiculo no puede estar parqueado dos veces al mismo tiempo
    if (sdb.parqueos.findOne({ vehiculo_id: vehiculoId, estado: "Activo" })) {
      throw new Error("El vehiculo " + vehiculo.placa + " ya tiene un parqueo activo");
    }

    // El filtro cupos_disponibles > 0 evita el sobrecupo: si la zona esta
    // llena no coincide ningun documento y no se descuenta nada
    var resultado = sdb.zonas.updateOne(
      { _id: zonaId, cupos_disponibles: { $gt: 0 } },
      { $inc: { cupos_disponibles: NumberInt(-1) } }
    );
    if (resultado.matchedCount === 0) {
      throw new Error("La zona " + zona.codigo + " no tiene cupos disponibles");
    }

    var ticket = sdb.parqueos.insertOne({
      vehiculo_id: vehiculoId,
      zona_id: zonaId,
      sede_id: zona.sede_id,
      hora_entrada: new Date(),
      hora_salida: null,
      estado: "Activo",
      tiempo_total_minutos: null,
      costo_total: null
    });

    session.commitTransaction();
    print("Ingreso registrado. Ticket: " + ticket.insertedId);
    return ticket.insertedId;
  } catch (error) {
    // Se deshace cualquier cambio parcial
    session.abortTransaction();
    print("Ingreso rechazado: " + error.message);
    return null;
  } finally {
    session.endSession();
  }
}

// Ejemplo: se registra el ingreso del vehiculo P100009 (Carro, sin parqueo
// activo) en la zona Z1 de la sede Centro
var VEHICULO = ObjectId("650000000000000000000409");
var ZONA = ObjectId("650000000000000000000201");

print("Cupos antes: " + db.zonas.findOne({ _id: ZONA }).cupos_disponibles);
registrarIngreso(VEHICULO, ZONA);
print("Cupos despues: " + db.zonas.findOne({ _id: ZONA }).cupos_disponibles);
