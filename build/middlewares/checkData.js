"use strict";
// @ts-ignore
const mongoose = require("mongoose");
const checkIfCollectionAlreadyExist = (req, res, next) => {
    const collectionName = req.params.location;
    mongoose.connection.db.listCollections({ name: collectionName })
        .next(function (err, collinfo) {
        if (collinfo) {
            res.status(409).send({ Error: "Collection already exist" });
            return;
        }
        next();
    });
};
const checkIfCollectionExist = (req, res, next) => {
    const collectionName = req.params.location;
    mongoose.connection.db.listCollections({ name: collectionName })
        .next(function (err, collinfo) {
        if (!collinfo) {
            res.status(404).send({ Error: "Collection not found" });
            return;
        }
        next();
    });
};
// @ts-ignore
const checkData = {
    checkIfCollectionExist: checkIfCollectionExist,
    checkIfCollectionAlreadyExist: checkIfCollectionAlreadyExist,
};
module.exports = checkData;
