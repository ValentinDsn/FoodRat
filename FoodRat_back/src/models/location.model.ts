// @ts-ignore
const mongoose = require("mongoose");
// @ts-ignore
const Schema = mongoose.Schema;

// Data model
const LocationSchema = new Schema({
    location_name: String,
    user_id : String,
});

const Model = mongoose.model("Location", LocationSchema);

module.exports = Model;
