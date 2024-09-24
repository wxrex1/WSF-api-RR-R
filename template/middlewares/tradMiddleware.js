const i18n = require('i18n');
const path = require('path');

// Configure i18n
i18n.configure({
    locales: ['en', 'fr', 'es'], // Add more locales as needed
    directory: path.join(__dirname, '../locales'),
    defaultLocale: 'en',
    cookie: 'lang'
});

const tradMiddleware = (req, res, next) => {
    i18n.init(req, res);
    const currentLocale = req.cookies.lang || 'en';
    req.setLocale(currentLocale);
    next();
};

module.exports = tradMiddleware;