"use strict";
// @ts-ignore
const { auth, checkData, corsConfig } = require('../middlewares');
// @ts-ignore
const { itemController, locationController, apiController } = require('../controllers');
// @ts-ignore
const express = require('express');
// @ts-ignore
const router = express.Router({ mergeParams: true });
// @ts-ignore
router.use(corsConfig);
router.get('/', itemController.getAllItems);
router.get('/getAllLocations', locationController.getAllLocation);
router.get('/getProductInfoFromApi/:barcode', apiController.getProductInfoFromApi);
router.get('/:location/', checkData.checkIfCollectionExist, itemController.getAllItemsFromLocation);
router.get('/:location/:id', checkData.checkIfCollectionExist, itemController.getItemFromLocation);
router.post('/createLocation/:location', checkData.checkIfCollectionAlreadyExist, locationController.createLocation);
router.post('/:location/addItem/', checkData.checkIfCollectionExist, itemController.createItem);
router.post('/:location/addItemByBarcode/:barcode', checkData.checkIfCollectionExist, itemController.createItemByBarcode);
router.delete('/:location/deleteItem/:id', checkData.checkIfCollectionExist, itemController.deleteItem);
router.delete('/deleteLocation/:location', checkData.checkIfCollectionExist, locationController.deleteLocation);
router.patch('/:location/updateItem/:id', checkData.checkIfCollectionExist, itemController.updateAnItem);
module.exports = router;
