import axios from 'axios';
// @ts-ignore
const mongoose = require("mongoose")
const ItemSchema = require("../models/item.model")
const foodFact= require("../controllers/foodfactAPI.controllers")

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

//Create a item
exports.createItemByBarcode = async (req, res) => {
    const item_location=req.params.location;
    const ItemModel = mongoose.model(item_location, ItemSchema);


    foodFact.getProductInfo(req.params.barcode).then((response) => {
        const item = new ItemModel({
            item_name:response.products[0]["product_name"],
            item_barcode:response.products[0]["code"],
            item_quantity:req.body.item_quantity,
            });

        item.save(function (err, savedItem) {
            if (err)
                throw err;
            res.json({"id": savedItem._id});
        });

    }).catch(error => {console.log(error);
        res.status(500).send(error);
        });
};

exports.getAllItems = async (req,res) => {
    let allItems : string[] = [];
    let collectionName : string[] = [];
    const promises : string[] = [];

    await new Promise((resolve, reject) => {
        mongoose.connection.db.listCollections().toArray((err, names) => {
            collectionName = names.map(collection => collection.name);
            resolve(0);
        });
    });

        collectionName.forEach((item) => {
            promises.push(
                mongoose.model(item, ItemSchema).find().then((item) => {
                    for (const item2 in item) {
                        allItems.push(item[item2]);
                    }
                })
            )
        })
    Promise.all(promises).then(() =>
        res.status(200).send(allItems)
    );
}

exports.getAllItemsFromLocation = (req, res) => {
    const item_location=req.params.location;
    const ItemModel = mongoose.model(item_location, ItemSchema);
    ItemModel.find((err,item) => {
        if (err){
            res.status(404).send({message: err});
        }
        res.status(200).json(item);
    })
};

exports.getItemFromLocation = (req, res) => {
    const item_location=req.params.location;
    const ItemModel = mongoose.model(item_location, ItemSchema);
    ItemModel.findOne({_id:req.params.id},(err,item) => {
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