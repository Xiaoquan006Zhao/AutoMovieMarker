const mysql = require("mysql2/promise");

const database_url = new URL(process.env.DATABASE_URL);
const dbHost = database_url.hostname;
const dbPort = database_url.port;
const dbName = database_url.pathname.slice(1);
const dbUser = database_url.username;
const dbPassword = database_url.password;

const admin_database_url = new URL(process.env.ADMIN_DATABASE_URL);
const admin_dbHost = admin_database_url.hostname;
const admin_dbPort = admin_database_url.port;
const admin_dbName = admin_database_url.pathname.slice(1);
const admin_dbUser = admin_database_url.username;
const admin_dbPassword = admin_database_url.password;

let readPool;
let adminPool;

async function createPool(user_id) {
  if (user_id === "user_2OA2AyJCnYAfGM18bPIzDOxNhqU") {
    return await createAdminPool();
  } else {
    return await createReadPool();
  }
}

async function createReadPool() {
  if (readPool) return readPool;

  readPool = await mysql.createPool({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    ssl: { rejectUnauthorized: true },
  });

  return readPool;
}

async function createAdminPool() {
  if (adminPool) return adminPool;

  adminPool = await mysql.createPool({
    host: admin_dbHost,
    port: admin_dbPort,
    database: admin_dbName,
    user: admin_dbUser,
    password: admin_dbPassword,
    ssl: { rejectUnauthorized: true },
  });

  return adminPool;
}

module.exports = { createPool };
