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
    item_img:String,
    item_img_small:String,
    item_location:String,
    location_id : String,
    user_id : String,
});

// @ts-ignore
const ItemModel = mongoose.model("Items", ItemSchema);

module.exports = ItemModel;
