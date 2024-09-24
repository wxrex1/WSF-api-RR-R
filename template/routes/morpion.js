const { Router } = require("express");
const MorpionController = require("../controllers/morpion");
const router = new Router();


const { validateGameId } = require("../middlewares/validateGameId");
const { validatePlayerId } = require("../middlewares/validatePlayerId");
const { validateMovePosition } = require("../middlewares/validateMovePosition");

// Route to create a new game
router.post("/create", MorpionController.createGame);

// Route to get a game by ID
router.get("/:id", validateGameId, MorpionController.getGame);

// Route to make a move in a game
router.post("/move", validateGameId, validatePlayerId, validateMovePosition, MorpionController.makeMove);

// Route to check the winner of a game
router.get("/:id/winner", validateGameId, MorpionController.checkWinner);

module.exports = router;