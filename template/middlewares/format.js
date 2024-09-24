const express = require('express');
const { Parser } = require('json2csv');
const xml = require('jsontoxml');
const yaml = require('js-yaml');

const app = express();

// Middleware to format response
function formatResponse(req, res, next) {
    res.formatResponse = (data, options = {}) => {
        const format = req.query.format || 'json';
        let formattedData;

        switch (format) {
            case 'csv':
                const parser = new Parser(options.csv || {});
                formattedData = parser.parse(data);
                res.setHeader('Content-Type', 'text/csv');
                break;
            case 'xml':
                formattedData = xml(data, options.xml || {});
                res.setHeader('Content-Type', 'application/xml');
                break;
            case 'yml':
            case 'yaml':
                formattedData = yaml.dump(data, options.yml || {});
                res.setHeader('Content-Type', 'application/x-yaml');
                break;
            default:
                formattedData = JSON.stringify(data);
                res.setHeader('Content-Type', 'application/json');
        }

        res.send(formattedData);
    };

    next();
}
module.exports = {
    formatResponse,
};
