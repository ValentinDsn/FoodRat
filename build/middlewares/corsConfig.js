"use strict";
// corsConfig.js
const cors = require('cors');
const allowedOrigins = ['http://localhost:3000']; // Définissez les origines autorisées
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Origine non autorisée par CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
};
module.exports = cors(corsOptions);
