const { User } = require("../models");

const createHateoasLinks = (user) => {
  const userId = user.id;
  return {
    self: `/users/${userId}`,
    update: `/users/${userId}`,
    delete: `/users/${userId}`,
  };
};

module.exports = {
  cget: async (req, res, next) => {
    try {
      const users = await User.findAll();
      const usersWithLinks = users.map(user => ({
        ...user.toJSON(),
        links: createHateoasLinks(user),
      }));
      res.status(200).json(usersWithLinks);
    } catch (error) {
      next(error);
    }
  },
  post: async (req, res, next) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json({
        ...user.toJSON(),
        links: createHateoasLinks(user),
      });
    } catch (error) {
      next(error);
    }
  },
  iget: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (user) {
        res.json({
          ...user.toJSON(),
          links: createHateoasLinks(user),
        });
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  },
  patch: async (req, res, next) => {
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res.sendStatus(403);
    }
    try {
      const [_, users] = await User.update(req.body, {
        where: {
          id: req.params.id,
        },
        individualHooks: true,
        returning: true,
      });

      if (users.length) {
        const user = users[0];
        res.json({
          ...user.toJSON(),
          links: createHateoasLinks(user),
        });
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  },
  put: async (req, res, next) => {
    try {
      const nbDeleted = await User.destroy({
        where: {
          id: req.params.id,
        },
      });
      req.body.id = req.params.id;
      const user = await User.create(req.body);
      res.status(!nbDeleted ? 201 : 200).json({
        ...user.toJSON(),
        links: createHateoasLinks(user),
      });
    } catch (error) {
      next(error);
    }
  },
  delete: async (req, res, next) => {
    try {
      const nbDeleted = await User.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (!nbDeleted) {
        res.sendStatus(404);
      } else {
        res.status(204).json({
          message: "User deleted",
          links: {
            create: "/users",
            list: "/users",
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
};