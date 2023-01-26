"use strict";
// @ts-ignore
const itemController = require("../controllers/item.controller");
// @ts-ignore
const locationController = require("../controllers/location.controller");
// @ts-ignore
const express = require('express');
// @ts-ignore
const router = express.Router({ mergeParams: true });
// @ts-ignore
const checkData = require('../middlewares/checkData');
router.get('/', itemController.getAllItems);
router.get('/:location/', checkData.checkIfCollectionExist, itemController.getAllItemsFromLocation);
router.get('/:location/:id', checkData.checkIfCollectionExist, itemController.getItemFromLocation);
router.post('/createLocation/:location', checkData.checkIfCollectionAlreadyExist, locationController.createLocation);
router.post('/:location/addItem/', checkData.checkIfCollectionExist, itemController.createItem);
router.post('/:location/addItemByBarcode/:barcode', checkData.checkIfCollectionExist, itemController.createItemByBarcode);
router.delete('/:location/deleteItem/:id', checkData.checkIfCollectionExist, itemController.deleteItem);
router.delete('/deleteLocation/:location', checkData.checkIfCollectionExist, locationController.deleteLocation);
router.patch('/:location/updateItem/:id', checkData.checkIfCollectionExist, itemController.updateAnItem);
module.exports = router;
