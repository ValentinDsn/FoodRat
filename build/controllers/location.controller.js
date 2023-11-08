"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// @ts-ignore
const mongoose = require("mongoose");
const database = require("../models/dbconnexion");
exports.createLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collection_name = req.params.location;
    yield database.db.createCollection(req.params.location).then(resp => {
        res.status(200).send({ "Location crée": req.params.location });
    }).catch(err => {
        res.status(500).send({ "Error": err });
    });
});
exports.deleteLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collection_name = req.params.location;
    yield mongoose.connection.db.dropCollection(req.params.location).then(resp => {
        res.status(200).send({ "Location supprimée": req.params.location });
    }).catch(err => {
        res.status(500).send({ "Error": err });
    });
});
exports.getAllLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let collectionName = [];
    yield new Promise((resolve, reject) => {
        mongoose.connection.db.listCollections().toArray((err, names) => {
            collectionName = names.map(collection => collection.name);
            resolve(0);
        });
    });
    res.status(200).json(collectionName);
});
