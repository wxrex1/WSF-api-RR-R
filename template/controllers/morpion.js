const { Morpion } = require("../models");
const { User } = require("../models");

module.exports = {
    createGame: async (req, res) => {
        try {
            const { player1Id, player2Id } = req.body;
            const newGame = await Morpion.create({ player1Id, player2Id, board: Array(9).fill(null), currentPlayer: player1Id });
            res.status(201).json(newGame);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getGame: async (req, res) => {
        try {
            const game = await Morpion.findByPk(req.params.id);
            if (!game) {
                return res.status(404).json({ error: "Game not found" });
            }
            res.status(200).json(game);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    makeMove: async (req, res) => {
        try {
            const { gameId, playerId, position } = req.body;
            const game = await Morpion.findByPk(gameId);
            if (!game) {
                return res.status(404).json({ error: "Game not found" });
            }

            if (game.currentPlayer !== playerId) {
                return res.status(400).json({ error: "It's not your turn" });
            }

            if (game.board[position] !== null) {
                return res.status(400).json({ error: "Position already taken" });
            }

            game.board[position] = playerId;
            game.currentPlayer = game.currentPlayer === game.player1Id ? game.player2Id : game.player1Id;
            await game.save();

            res.status(200).json(game);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    checkWinner: async (req, res) => {
        try {
            const game = await Morpion.findByPk(req.params.id);
            if (!game) {
                return res.status(404).json({ error: "Game not found" });
            }

            const winner = calculateWinner(game.board);
            res.status(200).json({ winner });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

function calculateWinner(board) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}