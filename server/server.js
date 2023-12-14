//
//
//
//
const express = require("express");
const format = require("./middlewares/format");
const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res, next) {
  console.log("Query params", req.query);
  res.json({
    id: 1,
    fullname: "John Doe",
  });
});

app.use(
  format({
    csv: {
      newline: "-",
    },
    formatters: {
      yml: { format: /(application|text)\/ya?ml/, formatter: (data) => "YAML" },
    },
  })
);

app.get("/format", (req, res) => {
  res.render(
    {
      id: 1,
      fullname: "John Doe",
    },
    {
      csv: {
        newline: "\n",
      },
    }
  );
});
app.get("/format-dash", (req, res) => {
  res.render({
    id: 1,
    fullname: "John Doe",
  });
});

app.listen(process.env.PORT, () =>
  console.log("Server is listening on port " + process.env.PORT)
);
console.log("Test 2");
