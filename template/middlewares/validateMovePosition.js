const validateMovePosition = (req, res, next) => {
    const { position } = req.body;
    if (position < 0 || position > 8) {
        return res.status(400).json({ error: "Invalid move position" });
    }
    if (req.game.board[position] !== null) {
        return res.status(400).json({ error: "Position already taken" });
    }
    next();
};

module.exports = {
    validateMovePosition
};