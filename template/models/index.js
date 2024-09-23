const connection = require("./db");
const UserModel = require("./users")(connection);
const MorpionModel = require("./morpion")(connection);


module.exports = {
  db: connection,
  User: UserModel,
  Morpion: MorpionModel,
};
