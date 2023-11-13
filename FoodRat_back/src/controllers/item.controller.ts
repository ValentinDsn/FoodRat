const foodFact= require("../controllers/foodfactAPI.controllers")
// @ts-ignore
const ItemModel = require("../models/item.model");
//Create a item
exports.createItem = (req, res) => {
    const item = new ItemModel(req.body);

    item.user_id = req.user_id;
    item.location_id = req.location_id;
    item.item_location=req.params.location;

    item.save(function (err, savedItem) {
        if (err)
            throw err;
        res.json({"id": savedItem._id, "location_id": savedItem.location_id});
    });
};

//Create a item
exports.createItemByBarcode = async (req, res) => {
    const ItemModel = require("../models/item.model");

    foodFact.getProductInfo(req.params.barcode).then((response) => {
        const item = new ItemModel({
            item_name:response.products[0]["product_name"],
            item_barcode:response.products[0]["code"],
            item_quantity:req.body.item_quantity,
            location_id:req.location_id,
            item_location:req.params.location,
            user_id:req.user_id,
            });

        item.save(function (err, savedItem) {
            if (err)
                throw err;
            res.json({"id": savedItem._id, "location_id": savedItem.location_id});
        });

    }).catch(error => {console.log(error);
        res.status(500).send(error);
        });
};

exports.getAllItems = async (req,res) => {
    try {
        // Recherche directe de tous les items qui ont l'user_id sans chercher par localisation
        const allItems = await ItemModel.find({ user_id: req.user_id });

        // Envoyer les résultats
        res.status(200).send(allItems);
    } catch (error) {
        // @ts-ignore
        res.status(500).send({ Error: error.message });
    }
};


exports.getAllItemsFromLocation = (req, res) => {
    ItemModel.find({ location_id: req.location_id }, (err, items) => {
        if (err) {
            // Gérer les erreurs de base de données ou d'autres erreurs internes - code 500 Internal Server Error.
            res.status(500).send({ message: "Error retrieving items: " + err });
        } else if (!items.length) {
            // Si aucun item n'est trouvé, return un message indiquant que la liste est vide - code 404 Not found.
            res.status(404).send({ message: "No items found in this location" });
        } else {
            // Si des items sont trouvés, envoie la réponse - code 200 - OK.
            res.status(200).json(items);
        }
    });
};

exports.getItemFromLocation = (req, res) => {

    ItemModel.findOne({_id:req.params.id},(err,item) => {
        if (err){
            res.status(404).send({message: err});
        }
        res.status(200).json(item);
    })
};

exports.deleteItem = (req,res) => {
    ItemModel.remove({_id: req.params.id}, (err, result) => {
        if (err) {
            // Si une erreur survient, renvoyez un statut d'erreur avec le message.
            return res.status(500).send({message: "Error deleting item: " + err.message});
        }
        if(result.deletedCount == 0){
            // Si aucun document n'est supprimé, renvoyez un statut 'Not Found'.
            return res.status(404).send({message: "No item found with the provided ID"});
        }
        // Si l'item est supprimé avec succès, renvoyez un message de confirmation.
        return res.status(200).send({message: "Item deleted successfully"});
    });
};

exports.updateAnItem = (req, res) => {
    ItemModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err) {
            res.status(404).send({message: err});
        } else {
            res.status(200).send({message: "Item updated"});
        }
    })
};