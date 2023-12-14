const Papa = require("papaparse");

const formatters = {
  json: { format: /(application|text)\/json.*/, formatter: jsonformatter },
  csv: { format: /text\/csv/, formatter: csvformatter },
  xml: { format: /(application|text)\/xml/, formatter: xmlformatter },
};

function jsonformatter(data) {
  return JSON.stringify(data);
}

function csvformatter(data, config) {
  if (!Array.isArray(data)) data = [data];
  return Papa.unparse(data, config);
}

function xmlformatter(data) {
  return "XML";
}

module.exports = function format(globalOptions = {}) {
  if (globalOptions.formatters) {
    Object.assign(formatters, globalOptions.formatters);
  }

  return function (req, res, next) {
    const acceptHeader =
      req.headers.Accept ?? req.headers.accept ?? "application/json";

    let formatKey = undefined;
    for (let key in formatters) {
      if (formatters[key].format.test(acceptHeader)) {
        formatKey = key;
        break;
      }
    }

    if (formatKey === undefined) {
      return res.sendStatus(406);
    }

    res.render = function (data, callOptions = {}) {
      res.set("Content-Type", acceptHeader);
      const formatter = formatters[formatKey].formatter;
      const middlewaresOptions = {
        rootName: "root",
      };
      const config = {
        ...(globalOptions[formatKey] ?? {}),
        ...middlewaresOptions,
        ...(callOptions[formatKey] ?? {}),
      };
      // const config = Object.assign({}, globalOptions[formatKey] ?? {}, callOptions[formatKey] ?? {});
      res.send(formatter(data, config));
    };

    next();
  };
};
