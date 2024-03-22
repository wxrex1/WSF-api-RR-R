require("dotenv").config();
const express = require("express");
const UserRouter = require("./routes/users");

const app = express();

app.use("/users", UserRouter);

app.listen(process.env.PORT, () =>
  console.log("Server listening on port " + process.env.PORT)
);
