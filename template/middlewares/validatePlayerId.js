const { User } = require("../models");

const validatePlayerId = async (req, res, next) => {
    try {
        const { playerId } = req.body;
        if (!playerId) {
            return res.status(400).json({ error: "Player ID is required" });
        }
        const player = await User.findByPk(playerId);
        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }
        if (req.game.player1Id !== playerId && req.game.player2Id !== playerId) {
            return res.status(400).json({ error: "Player is not part of this game" });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    validatePlayerId
};