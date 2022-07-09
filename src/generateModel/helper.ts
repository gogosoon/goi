export function dataTypeScheme(type: any, size: any) {
  console.log("Data: ", type, size);
  switch (type) {
    case "Date":
      return `DataTypes.DATE`;
    case "Integer":
      return `DataTypes.INTEGER`;
    case "Float":
      return `DataTypes.FLOAT`;
    case "Binary":
      return `DataTypes.BOOLEAN`;
    case "Radio":
      return `DataTypes.INTEGER`;
    case "Varchar":
      return `DataTypes.STRING(${size})`;
    case "Text":
      return `DataTypes.TEXT`;
    default:
      return `DataTypes.STRING`;
  }
}

export function dataTypeSchemeForModel(type: string) {
  if (type.includes("varchar")) {
    return "string";
  } else if (type.includes("datetime")) {
    return "Date";
  } else if (type.includes("tinyint")) {
    return "boolean";
  } else if (type.includes("int")) {
    return "number";
  } else if (type.includes("text")) {
    return "string";
  } else if (type.includes("float")) {
    return "number";
  } else if (type.includes("date")) {
    return "Date";
  } else if (type.includes("decimal")) {
    return "number";
  } else if (type.includes("char")) {
    return "string";
  } else {
    return "string";
  }
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generateColumn(columnName, type, isPrimary) {
  let column = "";
  if (isPrimary == "PRI") {
    column =
      column +
      `
      @PrimaryKey`;
  }
  column =
    column +
    `
          @Column
          @Field()
          public ${columnName}: ${type};
      `;
  return column;
}
