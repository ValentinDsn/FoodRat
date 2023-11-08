"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
//Variable mongoose pour utiliser le module mongoose
// @ts-ignore
const mongoose = require('mongoose');
//URL de la bdd
// @ts-ignore
const url_mongo = process.env.DB_Host + process.env.DB_Name;
//Connexion à la bdd
mongoose.connect(url_mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
exports.db = mongoose.connection;
//Message de connexion
exports.db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
exports.db.once('open', function () {
    console.log("Connexion à la base OK");
});
