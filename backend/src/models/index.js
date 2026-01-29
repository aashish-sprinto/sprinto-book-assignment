import sequelize from "../db/sequelize.js";
import Author from "./Author.js";
import Book from "./Book.js";
import User from "./User.js";

// Associations
Author.hasMany(Book, {
  foreignKey: "author_id",
  as: "books",
});

Book.belongsTo(Author, {
  foreignKey: "author_id",
  as: "author",
});

User.belongsTo(Author, {
  foreignKey: "author_id",
  as: "author",
});

Author.hasOne(User, {
  foreignKey: "author_id",
  as: "user",
});

export { sequelize, Author, Book, User };
