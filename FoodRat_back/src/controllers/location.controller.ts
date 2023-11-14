// @ts-ignore
const LocationModel = require("../models/location.model");
// @ts-ignore
const ItemModel = require("../models/item.model");

exports.createLocation = async (req, res) => {
    const collection_name = req.params.location
    const user_id = req.user_id;

    const newLocation = new LocationModel({
        location_name: collection_name,
        user_id: user_id,
    });

    await newLocation.save()
        .then(() => {
            res.status(200).send({"Location Created": req.params.location});
        })
        .catch((err) => {
            res.status(500).send({"Error": err});
        });
};

exports.deleteLocation = async (req, res) => {
    const collection_name = req.params.location
    const user_id = req.user_id;


    ItemModel.deleteMany({ location_id: req.location_id }, (err, itemResult) => {
        if (err) {
            return res.status(500).send({message: "Error deleting items: " + err.message});
        }

        if (itemResult.deletedCount === 0) {
            // Put warning for no items
        }
    })

    LocationModel.deleteOne({ location_name: collection_name, user_id: user_id }, (err, locationResult) => {
        if (err) {
            return res.status(500).send({message: "Error deleting location : " + err.message});
        }
        if (locationResult.deletedCount === 0) {
            return res.status(500).send({message: "Error deleting location : location not found" });
        }
        else {
            res.status(200).send({ "Location Deleted": req.params.location });
        }
    })
};

exports.getAllLocation = async (req, res) => {
    const user_id = req.user_id;

    LocationModel.find({ user_id: user_id })
        .then((locations) => {
            const collectionInfos = locations.map((location) => {
                return {
                    _id: location._id,
                    name: location.location_name,
                }
            });
            res.status(200).json(collectionInfos);
        })
        .catch((err) => {
            res.status(500).send({ Error: err.message });
        });
};