import { Sequelize } from "sequelize";

interface SequelizeOptions {
  username: string;
  password: string;
  database: string;
  host: string;
}

export function initializeSequelize({
  username,
  password,
  database,
  host,
}: SequelizeOptions) {
  const sequelize = new Sequelize({
    host,
    username,
    password,
    database,
    port: 3306,
    dialect: "mysql",
    dialectOptions: {
      bigNumberStrings: true,
    },
    logging: console.log,
    pool: {
      max: 10,
      idle: 30,
    },
  });
  return sequelize;
}
