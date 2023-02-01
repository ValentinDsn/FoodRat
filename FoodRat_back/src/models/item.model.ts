// @ts-ignore
const mongoose = require("mongoose")
// @ts-ignore
const Schema = mongoose.Schema;

//Data model
const ItemSchema = new Schema({
    item_name: String,
    item_barcode: Number,
    item_quantity: Number,
    item_expiration_date: Date,
    item_nutriscore_grade:String,
});

module.exports = ItemSchema