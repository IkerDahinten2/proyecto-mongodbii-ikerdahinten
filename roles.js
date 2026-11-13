// El script se puede ejecutar varias veces: si un rol o usuario ya existe,
// se elimina y se vuelve a crear con la definicion actual (createRole y
// createUser fallan si el nombre ya existe)
function recrearRol(definicion) {
  if (db.getRole(definicion.role)) db.dropRole(definicion.role);
  db.createRole(definicion);
}

function recrearUsuario(definicion) {
  if (db.getUser(definicion.user)) db.dropUser(definicion.user);
  db.createUser(definicion);
}

// Se crea el rol del administrador, acceso total
recrearRol({
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
recrearRol({
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
recrearRol({
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
recrearUsuario({
  user: "admin_andrea",
  pwd: passwordPrompt(),
  roles: [{ role: "administrador_total", db: "campus_parking" }]
});

recrearUsuario({
  user: "empleado_centro01",
  pwd: passwordPrompt(),
  roles: [{ role: "empleado_de_sede", db: "campus_parking" }]
});

recrearUsuario({
  user: "cliente_jose",
  pwd: passwordPrompt(),
  roles: [{ role: "cliente_final", db: "campus_parking" }]
});

// Se consulta que si hayan quedado creados los roles y los usuarios
db.getRoles();
db.getUsers();
