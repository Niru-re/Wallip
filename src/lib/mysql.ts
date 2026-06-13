import mysql from "mysql2/promise";

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const mysqlPool = mysql.createPool({
  host: requireEnv("MYSQL_HOST", MYSQL_HOST),
  port: Number(requireEnv("MYSQL_PORT", MYSQL_PORT)),
  user: requireEnv("MYSQL_USER", MYSQL_USER),
  password: requireEnv("MYSQL_PASSWORD", MYSQL_PASSWORD),
  database: requireEnv("MYSQL_DATABASE", MYSQL_DATABASE),
  connectionLimit: 10,
  // For local dev, this is usually fine; for prod set appropriately.
  waitForConnections: true,
});

