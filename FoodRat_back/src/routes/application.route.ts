// @ts-ignore
const {auth,checkData, corsConfig} = require('../middlewares');
// @ts-ignore
const {itemController,locationController, apiController, authController} = require('../controllers');
// @ts-ignore
const express = require('express');
// @ts-ignore
const router = express.Router({ mergeParams: true });
// @ts-ignore
router.use(corsConfig);
router.options('*', corsConfig); // Gère les requêtes OPTIONS pour toutes les routes

router.get('/', auth.verifyToken, auth.isValidated, itemController.getAllItems);
router.get('/getAllLocations',auth.verifyToken, auth.isValidated, locationController.getAllLocation);
router.get('/getProductInfoFromApi/:barcode',auth.verifyToken, auth.isValidated, apiController.getProductInfoFromApi)
router.get('/:location/', auth.verifyToken, auth.isValidated, checkData.checkIfCollectionExist, itemController.getAllItemsFromLocation);
router.get('/:location/:id', auth.verifyToken, auth.isValidated, checkData.checkIfCollectionExist, itemController.getItemFromLocation);

router.post('/createLocation/:location', auth.verifyToken, auth.isValidated, checkData.checkIfCollectionAlreadyExist,locationController.createLocation);
router.post('/:location/addItem/', auth.verifyToken, auth.isValidated, checkData.checkIfCollectionExist, itemController.createItem);
router.post('/:location/addItemByBarcode/:barcode', auth.verifyToken, auth.isValidated, checkData.checkIfCollectionExist, itemController.createItemByBarcode);

router.delete('/deleteLocation/:location', auth.verifyToken, auth.isValidated, checkData.checkIfCollectionExist,locationController.deleteLocation);
router.delete('/:location/deleteItem/:id', auth.verifyToken, auth.isValidated, checkData.checkIfCollectionExist, itemController.deleteItem);

router.patch('/:location/updateItem/:id', auth.verifyToken, auth.isValidated, checkData.checkIfCollectionExist, checkData.checkIfItemExists, itemController.updateAnItem);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;