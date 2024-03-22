const { Model, DataTypes } = require("sequelize");

module.exports = function ProductModelGenerator(connection) {
  class Product extends Model {}

  Product.init(
    {
      id: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: 3,
        },
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: 3,
        },
      },
      category: DataTypes.STRING,
    },
    {
      sequelize: connection,
    }
  );

  return Product;
};
