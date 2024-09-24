const { Model, DataTypes } = require("sequelize");

module.exports = function createMorpionModel(connection) {
	class Morpion extends Model {}

	Morpion.setup = function () {
		Morpion.init(
			{
				gameBoard: {
					type: DataTypes.ARRAY(DataTypes.STRING),
					allowNull: true,
					defaultValue: Array(9).fill(null),
				},
				gameId: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					allowNull: false,
					autoIncrement: true,
				},
				player1Id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				player2Id: {
					type: DataTypes.INTEGER,
					allowNull: true,
				},
				gameWinner: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				currentPlayer: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
			},
			{
				sequelize: connection,
				modelName: 'Morpion',
			}
		);
	};

	return Morpion;
};
