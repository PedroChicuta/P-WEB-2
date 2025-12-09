const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

function createSequelizeInstance(dbFilePath) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const dbPath = dbFilePath || path.join(dataDir, 'contatos-orm.db');

  const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: false,
    });

  return sequelize;
}

module.exports = { createSequelizeInstance };
