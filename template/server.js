require("dotenv").config();
const express = require("express");
const UserRouter = require("./routes/users");
const ProductRouter = require("./routes/products");

const app = express();

app.use(express.json());

app.use("/users", UserRouter);
app.use("/products", ProductRouter);

app.listen(process.env.PORT, () =>
  console.log("Server listening on port " + process.env.PORT)
);
