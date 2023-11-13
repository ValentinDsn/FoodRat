// @ts-ignore
const LocationModel = require("../models/location.model");
// @ts-ignore
const ItemModel = require("../models/item.model");
// @ts-ignore
const mongoose = require('mongoose');

const checkIfCollectionAlreadyExist = (req, res, next) => {
    const collectionName = req.params.location;
    const user_id = req.user_id;

    LocationModel.findOne({ location_name: collectionName, user_id: user_id })
        .then((location) => {
            if (location) {
                res.status(409).send({ Error: "Location already exists for this user" });
                return;
            }
            next();
        })
        .catch((err) => {
            res.status(500).send({ Error: err.message });
        });
};

const checkIfCollectionExist = (req, res, next) => {
    const collectionName = req.params.location;
    const user_id = req.user_id;

    LocationModel.findOne({ location_name: collectionName, user_id: user_id })
        .then((location) => {
            if (!location) {
                res.status(404).send({ Error: "Location not found for this user" });
                return;
            }
            req.location_id = location._id;
            next();
        })
        .catch((err) => {
            res.status(500).send({ Error: err.message });
        });
};

const checkIfItemExists = (req, res, next) => {
    const itemId = req.params.id;
    const user_id = req.user_id;
    const collectionName = req.params.location;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).send({ Error: `The provided ID: ${itemId} is not a valid ObjectId.` });
    }

    ItemModel.findOne({ _id: itemId, 'item_location': collectionName, 'user_id': user_id })
        .then(item => {
            if (!item) {
                res.status(404).send({ Error: "Item not found or you do not have permission to access it" });
                return;
            }
            next();
        })
        .catch(err => {
            res.status(500).send({ Error: err.message });
        });
};

// @ts-ignore
const checkData = {
    checkIfCollectionExist : checkIfCollectionExist,
    checkIfCollectionAlreadyExist : checkIfCollectionAlreadyExist,
    checkIfItemExists : checkIfItemExists,

};

module.exports = checkData;