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

exports.getAllItems = async (req,res) => {
    let allItems : string[] = [];
    let collectionName : string[] = [];
    const promises : string[] = [];

    await new Promise((resolve, reject) => {
        mongoose.connection.db.listCollections().toArray((err, names) => {
            collectionName = names.map(collection => collection.name);
            resolve();
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