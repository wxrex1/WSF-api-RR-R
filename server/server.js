//
//
//
//
const express = require("express");
//const format = require("./middlewares/format");
const format = require("./corrections/mw-format");
const yamlFormatter = require("./corrections/yamlFormatter");
const apiVersions = require("./corrections/mw-apiversion");
const app = express();

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
      yml: { format: /(application|text)\/ya?ml/, formatter: yamlFormatter },
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
      xml: {
        rootName: "user",
      },
      yml: {
        rootName: "user",
      },
    }
  );
});
app.get("/format-col", (req, res) => {
  res.render(
    [
      {
        id: 1,
        fullname: "John Doe",
      },
    ],
    {
      csv: {
        newline: "\n",
      },
      xml: {
        rootName: "user",
      },
      yml: {
        rootName: "user",
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
app.get("/format-dash-col", (req, res) => {
  res.render([
    {
      id: 1,
      fullname: "John Doe",
    },
  ]);
});
app.get("/users", (req, res) => {
  res.render([
    {
      id: 1,
      fullname: "John Doe",
    },
  ]);
});
app.get("/users/:id", (req, res) => {
  res.render({
    id: 1,
    fullname: "John Doe",
  });
});
app.get("/users/:id/comments", (req, res) => {
  res.render([
    {
      id: 1,
      fullname: "John Doe",
    },
  ]);
});

app.get(
  "/:apiVersion/products",
  apiVersions(
    {
      v1: (req, res) => {
        res.render([
          {
            id: 1,
            name: 'apple macbook pro m1 13"',
          },
        ]);
      },
      v2: (req, res) => {
        res.render([
          {
            id: "018c68e9-c499-7319-b0cc-153405bca95f",
            marque: "apple",
            category: "laptop",
            family: "macbook pro",
            model: "m1",
            size: '13"',
          },
        ]);
      },
    },
    "v2"
  )
);
app.get(
  "/products",
  apiVersions(
    {
      v1: (req, res) => {
        res.render([
          {
            id: 1,
            name: 'apple macbook pro m1 13"',
          },
        ]);
      },
      v2: (req, res) => {
        console.log("here");
        res.render([
          {
            id: "018c68e9-c499-7319-b0cc-153405bca95f",
            marque: "apple",
            category: "laptop",
            family: "macbook pro",
            model: "m1",
            size: '13"',
          },
        ]);
      },
    },
    "v2"
  )
);

app.get("/v1/products", (req, res) => {
  res.render([
    {
      id: 1,
      name: 'apple macbook pro m1 13"',
    },
  ]);
});

app.get("/v2/products", (req, res) => {
  res.render([
    {
      id: "018c68e9-c499-7319-b0cc-153405bca95f",
      marque: "apple",
      category: "laptop",
      family: "macbook pro",
      model: "m1",
      size: '13"',
    },
  ]);
});

app.get("/v:apiVersion/products", (req, res) => {
  console.log(req.params.apiVersion);
  const product = {
    id: "018c68e9-c499-7319-b0cc-153405bca95f",
    marque: "apple",
    category: "laptop",
    family: "macbook",
    subfamily: "pro",
    model: "m1",
    size: '13"',
  };
  if (req.params.apiVersion === "4") {
    product.screen = {
      size: '13"',
      resolution: "2560x1600",
      type: "Retina",
    };
    delete product.size;
  }
  res.render([product]);
});

// http://localhost:3000/products?_apiVersion=4
app.get("/products", (req, res) => {
  console.log(req.query._apiVersion);
  console.log(req.headers["accept-version"]);
  const product = {
    id: "018c68e9-c499-7319-b0cc-153405bca95f",
    marque: "apple",
    category: "laptop",
    family: "macbook",
    subfamily: "pro",
    model: "m1",
    size: '13"',
  };
  if (req.query._apiVersion === "4") {
    product.screen = {
      size: '13"',
      resolution: "2560x1600",
      type: "Retina",
    };
    delete product.size;
  }
  res.render([product]);
});

app.listen(process.env.PORT, () =>
  console.log("Server is listening on port " + process.env.PORT)
);
console.log("Test 2");
