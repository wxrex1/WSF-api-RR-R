//
//
//
//
const express = require("express");
//const format = require("./middlewares/format");
const format = require("./corrections/mw-format");
const yamlFormatter = require("./corrections/yamlFormatter");
const apiVersions = require("./corrections/mw-apiversion");
const negociate_trad = require("./corrections/mw-translation");
const app = express();
const i18next = require("i18next");

i18next.init({
  fallbackLng: ["en", "fr", "de"],
  resources: {
    en: {
      translation: {
        top: "top",
        male: "male",
        bottom: "bottom",
        female: "female",
      },
    },
    fr: {
      translation: {
        top: "haut",
        male: "homme",
        bottom: "bas",
        female: "femme",
      },
    },
    de: {
      translation: {
        top: "oben",
        male: "männlich",
        bottom: "unten",
        female: "weiblich",
      },
    },
  },
});

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

app.use(negociate_trad(i18next));

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

const itemUserHateoas = {
  comments: "/comments",
  self: true,
  all: true,
  verifyEmail: {
    path: "/verify-email",
    method: "POST",
  },
};

app.get("/users/:id", hateoas(itemUserHateoas), (req, res) => {
  res.render({
    id: 1,
    fullname: "John Doe",
  });
});

app.get("/users/:id", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const links = Object.entries(itemUserHateoas)
    .map(([key, value]) => {
      const linkItem = {
        rel: key,
      };

      let path;
      if (typeof value === "boolean") {
        switch (key) {
          case "self":
            path = baseUrl;
            break;
          case "all":
            path = baseUrl.replace(/\/[^/]+$/, "");
            break;
        }
      } else if (typeof value === "object") {
        linkItem.type = value.method;
        path = baseUrl + value.path;
      }
      linkItem.path = path;

      let result = `<${linkItem.path}>; rel="${linkItem.rel}"`;
      if (linkItem.type) {
        result += `; type="${linkItem.type}"`;
      }

      return result;
    })
    .join(", ");

  res.setHeader("Link", links);

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

app.get("/clothes2", (req, res) => {
  res.render([
    {
      id: 1,
      name: "t-shirt",
      category: res.t("top"),
      gender: res.t("male"),
    },
    {
      id: 2,
      name: "jeans",
      category: res.t("bottom"),
      gender: res.t("female"),
    },
  ]);
});

app.get("/clothes", (req, res) => {
  let acceptedLanguage = req.headers["accept-language"] ?? "*";
  if (acceptedLanguage !== "*") {
    // fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5
    acceptedLanguage = acceptedLanguage
      .split(",")
      .map((ponderatedLanguage) => {
        // fr-CH ou fr;q=0.9
        const [lng, ponderation] = ponderatedLanguage.trim().split(";");
        // ["fr-CH", 1] ou [fr, 0.9]
        return [
          lng,
          ponderation ? parseFloat(ponderation.replace("q=", "")) : 1,
        ];
      })
      .sort((a, b) => {
        // a = ["fr-CH", 1]
        // b = [fr, 0.9]
        if (a[1] > b[1]) return -1;
        if (a[1] < b[1]) return 1;
        return 0;
      });

    acceptedLanguage =
      acceptedLanguage.find(([lng]) => i18next.languages.includes(lng))?.[0] ??
      "*";
  }
  i18next.changeLanguage(acceptedLanguage);

  res.render([
    {
      id: 1,
      name: "t-shirt",
      category: i18next.t("top"),
      gender: i18next.t("male"),
    },
    {
      id: 2,
      name: "jeans",
      category: i18next.t("bottom"),
      gender: i18next.t("female"),
    },
  ]);
});

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
