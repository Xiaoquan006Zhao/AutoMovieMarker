const mysql = require("mysql2/promise");

let pool;

async function createPool() {
  if (pool) return pool;

  pool = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "movies",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

module.exports = { createPool };
