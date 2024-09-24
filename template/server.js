require("dotenv").config();
const express = require("express");
const UserRouter = require("./routes/users");
const MorpionRouter = require("./routes/morpion");
const SecurityRouter = require("./routes/security");
const checkAuth = require("./middlewares/checkAuth");
//const { format } = require("sequelize/lib/utils");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Morpion API");
});

app.use("/security", SecurityRouter);
app.use("/users", UserRouter);
app.use("/morpion", MorpionRouter);

app.listen(process.env.PORT, () =>
  console.log("Server listening on port " + process.env.PORT)
);
