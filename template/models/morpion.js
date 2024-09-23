const { Model, DataTypes } = require("sequelize");

module.exports = function createMorpionModel(connection) {
	class Morpion extends Model {}

	Morpion.setup = function () {
		Morpion.init(
			{
        gameBoard: {
					type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.STRING)),
					allowNull: true,
					defaultValue: [
						["", "", ""],["", "", ""],["", "", ""],
					],
				},
				gameId: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					allowNull: false,
				},
				player1: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				player2: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				gameWinner: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				activePlayer: {
					type: DataTypes.STRING,
					allowNull: false,
					defaultValue: "player1",
				},
			},
			{
				sequelize: connection,
			}
		);
	};

	return Morpion;
};

