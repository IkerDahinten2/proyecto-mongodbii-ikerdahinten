// Se crea el rol del administrador, acceso total
db.createRole({
  role: "administrador_total",
  privileges: [
    {
      resource: { db: "campus_parking", collection: "" },
      actions: ["find", "insert", "update", "remove", "createIndex", "dropIndex", "collMod"]
    }
  ],
  roles: [
    { role: "userAdmin", db: "campus_parking" }
  ]
});

// Se crea el rol del empleado de sede
// Nota: mongo no deja restringir por documento, solo por coleccion. Que un
// empleado solo vea SU sede se controla desde el backend agregando siempre
// el filtro sede_id en la consulta, no lo hace mongo solo
db.createRole({
  role: "empleado_de_sede",
  privileges: [
    { resource: { db: "campus_parking", collection: "usuarios" }, actions: ["find"] },
    { resource: { db: "campus_parking", collection: "vehiculos" }, actions: ["find"] },
    { resource: { db: "campus_parking", collection: "sedes" }, actions: ["find"] },
    { resource: { db: "campus_parking", collection: "zonas" }, actions: ["find", "update"] },
    { resource: { db: "campus_parking", collection: "parqueos" }, actions: ["find", "insert", "update"] }
  ],
  roles: []
});

// Se crea el rol del cliente, solo lectura
db.createRole({
  role: "cliente_final",
  privileges: [
    { resource: { db: "campus_parking", collection: "usuarios" }, actions: ["find"] },
    { resource: { db: "campus_parking", collection: "vehiculos" }, actions: ["find"] },
    { resource: { db: "campus_parking", collection: "parqueos" }, actions: ["find"] },
    { resource: { db: "campus_parking", collection: "zonas" }, actions: ["find"] },
    { resource: { db: "campus_parking", collection: "sedes" }, actions: ["find"] }
  ],
  roles: []
});

// Se crean los usuarios de prueba con cada rol
db.createUser({
  user: "admin_andrea",
  pwd: passwordPrompt(),
  roles: [{ role: "administrador_total", db: "campus_parking" }]
});

db.createUser({
  user: "empleado_centro01",
  pwd: passwordPrompt(),
  roles: [{ role: "empleado_de_sede", db: "campus_parking" }]
});

db.createUser({
  user: "cliente_jose",
  pwd: passwordPrompt(),
  roles: [{ role: "cliente_final", db: "campus_parking" }]
});

// Se le asigna el rol de empleado a un usuario que ya existia
db.grantRolesToUser("empleado_centro01", [
  { role: "empleado_de_sede", db: "campus_parking" }
]);

// Se consulta que si hayan quedado creados los roles y los usuarios
db.getRoles();
db.getUsers();
