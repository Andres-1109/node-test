// Plain JS on purpose: sequelize-cli loads this file directly (no ts-node), so it can't be .ts.
require('dotenv').config();

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'postgres',
};

module.exports = {
  development: common,
  test: common,
  production: common,
};
