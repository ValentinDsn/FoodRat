// corsConfig.js
const cors = require('cors');

const allowedOrigins = ['http://localhost:3006','http://192.168.1.20:3006','http://10.54.128.192:3006']; // Définissez les origines autorisées

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origine non autorisée par CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization, x-access-token',
    credentials: true,
};

module.exports = cors(corsOptions);
