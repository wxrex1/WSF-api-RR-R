const { Router } = require("express");
const SecurityController = require("../controllers/security");
const router = new Router();
const checkAuth = require("../middlewares/checkAuth");

// Collection route : GET : list users
router.post("/login", /* middlewares */ checkAuth, SecurityController.login);   


module.exports = router;
