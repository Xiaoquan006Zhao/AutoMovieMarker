const mysql = require("mysql2/promise");

const database_url = new URL(process.env.DATABASE_URL);
const dbHost = database_url.hostname;
const dbPort = database_url.port;
const dbName = database_url.pathname.slice(1);
const dbUser = database_url.username;
const dbPassword = database_url.password;

let pool;

async function createPool() {
  if (pool) return pool;

  pool = await mysql.createPool({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    ssl: { rejectUnauthorized: true },
  });

  return pool;
}

module.exports = { createPool };
