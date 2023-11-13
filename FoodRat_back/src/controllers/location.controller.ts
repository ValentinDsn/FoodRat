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

        // Vérifiez si des items ont été supprimés
        if (itemResult.deletedCount === 0) {
            // Put warning for no items
        }
    })

    await LocationModel.deleteOne({ location_name: collection_name, user_id: user_id })
        .then(() => {
            res.status(200).send({ "Location Deleted": req.params.location });
        })
        .catch((err) => {
            res.status(500).send({ "Error": err });
        });
};

exports.getAllLocation = async (req, res) => {
    const user_id = req.user_id;
    console.log(user_id);

    LocationModel.find({ user_id: user_id })
        .then((locations) => {
            const collectionNames = locations.map((location) => location.location_name);
            res.status(200).json(collectionNames);
        })
        .catch((err) => {
            res.status(500).send({ Error: err.message });
        });
};