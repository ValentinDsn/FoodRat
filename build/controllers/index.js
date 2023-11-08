"use strict";
// @ts-ignore
const itemController = require("./item.controller");
// @ts-ignore
const locationController = require("./location.controller");
// @ts-ignore
const apiController = require("./foodfactAPI.controllers");
const authController = require("./auth.controllers");
module.exports = {
    itemController,
    locationController,
    apiController,
    authController
};
