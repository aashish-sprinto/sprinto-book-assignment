import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Author = sequelize.define(
  "Author",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    biography: {
      type: DataTypes.TEXT,
    },
    born_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "authors",
    timestamps: true,
  }
);

export default Author;
