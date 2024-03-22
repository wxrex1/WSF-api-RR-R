const { User } = require("../models");

module.exports = {
  cget: async (req, res, next) => {
    const users = await User.findAll();
    res.status(200).json(users);
  },
  post: async (req, res, next) => {},
  iget: async (req, res, next) => {},
  patch: async (req, res, next) => {},
  put: async (req, res, next) => {},
  delete: async (req, res, next) => {},
};
