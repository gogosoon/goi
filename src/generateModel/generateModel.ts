import fs from "fs-extra";
import { errorMsg, getInput } from "../utils/input";
import {
  capitalizeFirstLetter,
  dataTypeSchemeForModel,
  generateColumn,
} from "./helper";
import { initializeSequelize } from "./sequelize";
import { terminal } from "terminal-kit";
import { parse } from "env-file-reader";

const ENV = ".env";
const ENV_LOCAL = ".env.local";
const DB_HOST = "DB_HOST";
const DB_USER = "DB_USER";
const DB_PASS = "DB_PASS";
const DB_NAME = "DB_NAME";

export async function generateModel(): Promise<void> {
  try {
    let env = ENV_LOCAL;
    if (!fs.existsSync(ENV_LOCAL)) {
      console.log("\nCan't find .env.local file. Reading .env file");
      if (!fs.existsSync(ENV)) {
        console.log("\nCan't find .env file. Reading .env file");
        env = await getInput("\nEnter the env file : ");
      } else {
        env = ENV;
      }
    }
    if (!fs.existsSync(env)) {
      throw new Error("\nCan't find " + env + " file");
    }
    const parsedEnvFile = parse(env);

    let username = parsedEnvFile[DB_USER];
    let password = parsedEnvFile[DB_PASS];
    let database = parsedEnvFile[DB_NAME];
    let host = parsedEnvFile[DB_HOST];

    if (!host) {
      host = await getInput("\nEnter the DB host : ");
    }

    if (!username) {
      username = await getInput("\n\nEnter the DB username : ");
    }

    if (!database) {
      database = await getInput("\nEnter the database name : ");
    }

    const tableName = await getInput(
      "\nEnter the tablename to generate model : "
    );
    console.log("\n");
    const sequelize = initializeSequelize({
      username,
      password,
      database,
      host,
    });

    const response = await sequelize.query(
      "show columns from " + "`" + tableName + "`"
    );
    const modelName = capitalizeFirstLetter(tableName) + "Model";
    const fileName = `${modelName}.ts`;
    let tempModelNames: string = `import {
      Sequelize,
      Table,
      AutoIncrement,
      Column,
      PrimaryKey,
      CreatedAt,
      UpdatedAt,
      DeletedAt,
      HasMany,
      HasOne,
      BelongsTo,
      ForeignKey,
      BelongsToMany,
      Model
    } from "sequelize-typescript";
    import sequelize from ".";
    import { Field, ID, ObjectType } from "type-graphql";
    
    @Table({
      tableName: "${tableName}",
    })
    @ObjectType()
    export class ${modelName} extends Model {`;

    response[0].forEach((columnInfo) => {
      // console.log("Types: " , columnInfo["Type"])
      tempModelNames =
        tempModelNames +
        generateColumn(
          columnInfo["Field"],
          dataTypeSchemeForModel(columnInfo["Type"]),
          columnInfo["Key"]
        );
    });

    tempModelNames =
      tempModelNames +
      `}
    sequelize.addModels([${modelName}]);
    `;

    fs.writeFileSync(fileName, tempModelNames);
    terminal.green("Model Generated ! ");
  } catch (error) {
    console.log("\n\n");
    errorMsg(error);
  }

  process.exit();
}
