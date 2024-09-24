const { Morpion } = require("../models");

const validateGameId = async (req, res, next) => {
    try {
        const game = await Morpion.findByPk(req.params.id || req.body.gameId);
        if (!game) {
            return res.status(404).json({ error: "Game not found" });
        }
        req.game = game;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    validateGameId,
};