const i18next = require('i18next');
const path = require('path');

// Configure i18n
i18next.configure({
    locales: ['en', 'fr'], // Add more locales as needed
    directory: path.join(__dirname, '../locales'),
    defaultLocale: 'en',
    cookie: 'lang'
});

const tradMiddleware = (req, res, next) => {
    i18next.init(req, res);
    const currentLocale = req.cookies.lang || 'en';
    req.setLocale(currentLocale);
    next();
};

module.exports = tradMiddleware;