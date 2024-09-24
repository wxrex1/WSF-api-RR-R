const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const users = require("./users");





module.exports = {
  login: async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) return res.sendStatus(401);
    if (!(await bcrypt.compare(password, user.password)))
      return res.sendStatus(401);

    const token = jwt.sign(
      {
        userID: user.id,
        fullName: `${user.lastname} ${user.firstname}`,
      },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      links: {
        self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        user: `${req.protocol}://${req.get('host')}/users/${user.id}`,
        logout: `${req.protocol}://${req.get('host')}/logout`
      }
    });
  },

};
