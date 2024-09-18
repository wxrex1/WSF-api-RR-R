const Sequelize = require("sequelize");

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const connection = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
});

connection.authenticate().then(() => console.log("Database connected")).catch((error) => console.log("Database connection failed:", error));

module.exports = connection;
