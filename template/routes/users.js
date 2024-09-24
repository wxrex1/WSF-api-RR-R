const { Router } = require("express");
const UserController = require("../controllers/users");
const checkAuth = require("../middlewares/checkAuth");
const checkRole = require("../middlewares/checkRole");
const router = new Router();

router.get("/", UserController.cget);

// Collection route : GET : list users
router.get("/admin", /* middlewares */ checkAuth, checkRole("admin"), UserController.cget);      

// Collection route : POST : create an user
router.post("/register", /* middlewares */ UserController.register);                                     

// Item route : GET : fetch an user                                      
router.get("/:id", /* middlewares */ UserController.iget);

router.patch("/:id", /* middlewares */ checkAuth, UserController.patch);

router.put("/:id", /* middlewares */ UserController.put);

router.delete("/:id", /* middlewares */ UserController.delete);

module.exports = router;
