// @ts-ignore
const mongoose = require("mongoose")

const ItemSchema = require("../models/item.model")

//Create a item
exports.createItem = (req, res) => {
    const item_location=req.params.location;
    const ItemModel = mongoose.model(item_location, ItemSchema);
    const item = new ItemModel(req.body);

    item.save(function (err, savedItem) {
        if (err)
            throw err;

        res.json({"id": savedItem._id});
    });
};

exports.getAllItems = (req, res) => {
    ItemSchema.find((err,item) => {
        if (err){
            res.status(404).send({message: err});
        }
        res.status(200).json(item);
    })
};

exports.deleteItem = (req,res) => {
    const item_location=req.params.location;
    const ItemModel = mongoose.model(item_location, ItemSchema);
    ItemModel.remove({_id: req.params.id}, (err) =>{
        if (err){
            res.status(404).send({message: err});
        }
        res.status(200).send({message: "Item deleted"});
    });
};

exports.updateAnItem = (req, res) => {
    const item_location=req.params.location;
    const ItemModel = mongoose.model(item_location, ItemSchema);
    ItemModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err) {
            res.status(404).send({message: err});
        } else {
            res.status(200).send({message: "Item updated"});
        }
    })
};