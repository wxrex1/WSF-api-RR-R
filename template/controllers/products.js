const { Product } = require("../models");

module.exports = {
  cget: async (req, res, next) => {
    const products = await Product.findAll();
    res.status(200).json(products);
  },
  post: async (req, res, next) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },
  iget: async (req, res, next) => {
    const product = await Product.findByPk(req.params.id);
    if (product) res.json(product);
    else res.sendStatus(404);
  },
  patch: async (req, res, next) => {
    // UPDATE table SET col=value WHERE col=value RETURNING *;
    try {
      const [nbUpdated, products] = await Product.update(req.body, {
        where: {
          id: req.params.id,
        },
        returning: true,
      });
      console.log(nbUpdated, products);
      if (nbUpdated) res.json(products[0]);
      else res.sendStatus(404);
    } catch (error) {
      next(error);
    }
  },
  put: async (req, res, next) => {
    const nbDeleted = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    try {
      req.body.id = req.params.id;
      const product = await Product.create(req.body);
      res.status(!nbDeleted ? 201 : 200).json(product);
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    const nbDeleted = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!nbDeleted) res.sendStatus(404);
    else res.sendStatus(204);
  },
};
