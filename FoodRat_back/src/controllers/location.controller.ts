// @ts-ignore
const mongoose = require("mongoose")

const database = require ("../models/dbconnexion");

exports.createLocation = async (req, res) => {
    const collection_name = req.params.location
    await database.db.createCollection(req.params.location).then(resp => {
        res.status(200).send({"Location crée": req.params.location});
    }).catch(err => {
        res.status(500).send({"Error" : err});
    });
};

exports.deleteLocation = async (req, res) => {
    const collection_name = req.params.location
    await mongoose.connection.db.dropCollection(req.params.location).then(resp => {
        res.status(200).send({"Location supprimée": req.params.location});
    }).catch(err => {
        res.status(500).send({"Error" : err});
    });
};

exports.getAllLocation = async (req,res) => {
    let collectionName : string[] = [];
    await new Promise((resolve, reject) => {
        mongoose.connection.db.listCollections().toArray((err, names) => {
            collectionName = names.map(collection => collection.name);
            resolve(0);
        });
    });
    res.status(200).json(collectionName);
}