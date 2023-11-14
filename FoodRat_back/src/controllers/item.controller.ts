const foodFact = require("../controllers/foodfactAPI.controllers")
// @ts-ignore
const ItemModel = require("../models/item.model");
//Create a item
exports.createItem = (req, res) => {
    const item = new ItemModel(req.body);

    item.user_id = req.user_id;
    item.location_id = req.location_id;
    item.item_location = req.params.location;

    item.save(function (err, savedItem) {
        if (err)
            throw err;
        res.json({"id": savedItem._id, "location_id": savedItem.location_id});
    });
};

//Create a item
exports.createItemByBarcode = (req, res) => {
    const ItemModel = require("../models/item.model");

    foodFact.getProductInfo(req.params.barcode).then((response) => {
        const item = new ItemModel({
            item_name: response.products[0]["product_name"],
            item_barcode: response.products[0]["code"],
            item_quantity: req.body.item_quantity,
            location_id: req.location_id,
            item_location: req.params.location,
            user_id: req.user_id,
        });

        item.save(function (err, savedItem) {
            if (err)
                throw err;
            res.json({"id": savedItem._id, "location_id": savedItem.location_id});
        });

    }).catch(error => {
        console.log(error);
        res.status(500).send(error);
    });
};

exports.getAllItems = (req, res) => {
    ItemModel.find({user_id: req.user_id}, (err, allItems) => {
        if (err) {
            res.status(500).send({Error: err.message});
        } else {
            res.status(200).send(allItems);
        }
    });
};


exports.getAllItemsFromLocation = (req, res) => {
    ItemModel.find({location_id: req.location_id}, (err, items) => {
        if (err) {
            res.status(500).send({message: "Error retrieving items: " + err});
        } else if (!items.length) {
            res.status(404).send({message: "No items found in this location or location not found"});
        } else {
            res.status(200).json(items);
        }
    });
};

exports.getItemFromLocation = (req, res) => {

    ItemModel.findOne({_id: req.params.id}, (err, item) => {
        if (err) {
            res.status(404).send({message: err});
        }
        if (!item) {
            return res.status(500).send({message: "Error : item not found"});
        }
        res.status(200).json(item);
    })
};

exports.deleteItem = (req, res) => {
    ItemModel.remove({_id: req.params.id}, (err, result) => {
        if (err) {
            return res.status(500).send({message: "Error deleting item: " + err.message});
        }
        if (result.deletedCount == 0) {
            return res.status(404).send({message: "No item found with the provided ID"});
        }
        return res.status(200).send({message: "Item deleted successfully"});
    });
};

exports.updateAnItem = (req, res) => {

    ItemModel.findByIdAndUpdate(req.params.id, req.body, (err, itemResult) => {
        if (err) {
            res.status(404).send({message: err});
        }
        if (!itemResult) {
            return res.status(500).send({message: "Error updating item : item not found"});
        } else {
            res.status(200).send({message: "Item updated"});
        }
    })
};