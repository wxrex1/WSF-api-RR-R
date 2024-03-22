const { Router } = require("express");
const ProductController = require("../controllers/products");
const router = new Router();

// Collection route : GET : list products
router.get("", /* middlewares */ ProductController.cget);
// Collection route : POST : create an product
router.post("", /* middlewares */ ProductController.post);

// Item route : GET : fetch an product
router.get("/:id", /* middlewares */ ProductController.iget);
// Item route : PATCH : modify an product
router.patch("/:id", /* middlewares */ ProductController.patch);
// Item route : PUT : replace an product
router.put("/:id", /* middlewares */ ProductController.put);
// Item route : DELETE : delete an product
router.delete("/:id", /* middlewares */ ProductController.delete);

module.exports = router;
