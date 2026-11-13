// Se elimina la coleccion si ya existia de antes
db.usuarios.drop();
db.vehiculos.drop();
db.sedes.drop();
db.zonas.drop();
db.parqueos.drop();

// Se crea la coleccion usuarios con su validacion
db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "apellido", "dpi", "email", "rol"],
      additionalProperties: false,
      properties: {
        _id: {},
        nombre: { bsonType: "string" },
        apellido: { bsonType: "string" },
        dpi: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
        telefono: { bsonType: "string" },
        rol: { enum: ["Administrador", "Empleado de sede", "Cliente"] },
        sede_asignada: { bsonType: ["objectId", "null"] },
        fecha_registro: { bsonType: "date" }
      }
    }
  }
});

// Se crean los indices de usuarios, el DPI y el email no se pueden repetir
db.usuarios.createIndex({ dpi: 1 }, { unique: true });
db.usuarios.createIndex({ email: 1 }, { unique: true });
// Este index es para buscar rapido los empleados de una sede
db.usuarios.createIndex({ sede_asignada: 1 });
// Este index es para filtrar por tipo de usuario
db.usuarios.createIndex({ rol: 1 });

// Se crea la coleccion vehiculos con su validacion
db.createCollection("vehiculos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["placa", "tipo", "cliente_id"],
      additionalProperties: false,
      properties: {
        _id: {},
        placa: { bsonType: "string" },
        tipo: { enum: ["Carro", "Moto", "Bicicleta", "Camion"] },
        marca: { bsonType: "string" },
        modelo: { bsonType: "string" },
        color: { bsonType: "string" },
        cliente_id: { bsonType: "objectId" }
      }
    }
  }
});

// Se crean los indices de vehiculos, la placa no se puede repetir
db.vehiculos.createIndex({ placa: 1 }, { unique: true });
// Este index es para buscar los vehiculos de un cliente
db.vehiculos.createIndex({ cliente_id: 1 });
// Este index es para la consulta del tipo de vehiculo mas frecuente
db.vehiculos.createIndex({ tipo: 1 });

// Se crea la coleccion sedes con su validacion
db.createCollection("sedes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "ciudad", "direccion"],
      additionalProperties: false,
      properties: {
        _id: {},
        nombre: { bsonType: "string" },
        ciudad: { bsonType: "string" },
        direccion: { bsonType: "string" }
      }
    }
  }
});

// Se crea el index de sedes para agrupar reportes por ciudad
db.sedes.createIndex({ ciudad: 1 });

// Se crea la coleccion zonas con su validacion
// La capacidad, la tarifa y los tipos permitidos van en la zona y no en la
// sede, porque dentro de la misma sede puede haber una zona solo de motos
// con una tarifa y otra zona de carros con otra tarifa distinta
db.createCollection("zonas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "sede_id", "codigo", "capacidad_maxima",
        "cupos_disponibles", "tipos_permitidos", "tarifa_por_hora"
      ],
      additionalProperties: false,
      properties: {
        _id: {},
        sede_id: { bsonType: "objectId" },
        codigo: { bsonType: "string" },
        capacidad_maxima: { bsonType: "int", minimum: 1 },
        cupos_disponibles: { bsonType: "int", minimum: 0 },
        tipos_permitidos: {
          bsonType: "array",
          minItems: 1,
          items: { enum: ["Carro", "Moto", "Bicicleta", "Camion"] }
        },
        tarifa_por_hora: { bsonType: "double", minimum: 0.0 }
      }
    }
  }
});

// El codigo de zona no se repite dentro de la misma sede
db.zonas.createIndex({ sede_id: 1, codigo: 1 }, { unique: true });
// Este index es para saber que zonas de una sede todavia tienen cupo
db.zonas.createIndex({ sede_id: 1, cupos_disponibles: 1 });

// Se crea la coleccion parqueos con su validacion
// Aqui se usan referencias (vehiculo_id, zona_id, sede_id) y no se
// embebe nada, porque el vehiculo o la zona pueden cambiar despues y un
// parqueo viejo no deberia quedar con datos desactualizados
db.createCollection("parqueos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["vehiculo_id", "zona_id", "sede_id", "hora_entrada", "estado"],
      additionalProperties: false,
      properties: {
        _id: {},
        vehiculo_id: { bsonType: "objectId" },
        zona_id: { bsonType: "objectId" },
        sede_id: { bsonType: "objectId" },
        hora_entrada: { bsonType: "date" },
        hora_salida: { bsonType: ["date", "null"] },
        estado: { enum: ["Activo", "Finalizado"] },
        tiempo_total_minutos: { bsonType: ["int", "null"], minimum: 0 },
        costo_total: { bsonType: ["double", "null"], minimum: 0.0 }
      }
    }
  }
});

// Se crean los indices de parqueos
db.parqueos.createIndex({ estado: 1 });
// Este index es para el reporte de ocupacion por zona
db.parqueos.createIndex({ zona_id: 1, estado: 1 });
// Este index es para filtrar parqueos por fecha
db.parqueos.createIndex({ hora_entrada: 1 });
// Este index es para el historial de un vehiculo o cliente
db.parqueos.createIndex({ vehiculo_id: 1 });
// Este index es para el reporte de ocupacion por sede
db.parqueos.createIndex({ sede_id: 1, estado: 1 });

// Se consulta que si hayan quedado creadas las 5 colecciones (esto es
// una consulta real a la base, no una suposicion de que si funciono)
db.getCollectionNames();
