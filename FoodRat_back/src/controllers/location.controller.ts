// @ts-ignore
const mongoose = require("mongoose")

const database = require ("../models/dbconnexion");

exports.createLocation = async (req, res) => {
    const collection_name = req.params.location
    await database.db.createCollection(req.params.location).then(resp => {
        res.status(200).send({"Location crée": req.params.location});
    }).catch(err => {
        res.status(500).send({"Erreur" : err});
    });
};

exports.deleteLocation = async (req, res) => {
    const collection_name = req.params.location
    await mongoose.connection.db.dropCollection(req.params.location).then(resp => {
        res.status(200).send({"Location supprimée": req.params.location});
    }).catch(err => {
        res.status(500).send({"Erreur" : err});
    });
};