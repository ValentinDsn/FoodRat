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

router.get('/', auth.verifyToken,itemController.getAllItems);
router.get('/getAllLocations',auth.verifyToken, locationController.getAllLocation);
router.get('/getProductInfoFromApi/:barcode',auth.verifyToken, apiController.getProductInfoFromApi)
router.get('/:location/', auth.verifyToken, checkData.checkIfCollectionExist, itemController.getAllItemsFromLocation);
router.get('/:location/:id', auth.verifyToken, checkData.checkIfCollectionExist, itemController.getItemFromLocation);

router.post('/createLocation/:location', auth.verifyToken, checkData.checkIfCollectionAlreadyExist,locationController.createLocation);
router.post('/:location/addItem/', auth.verifyToken, checkData.checkIfCollectionExist, itemController.createItem);
router.post('/:location/addItemByBarcode/:barcode', auth.verifyToken, checkData.checkIfCollectionExist, itemController.createItemByBarcode);
router.post('/register', authController.register);
router.post('/login', authController.login);

router.delete('/:location/deleteItem/:id', auth.verifyToken, checkData.checkIfCollectionExist, itemController.deleteItem);
router.delete('/deleteLocation/:location', auth.verifyToken, checkData.checkIfCollectionExist,locationController.deleteLocation);

router.patch('/:location/updateItem/:id', auth.verifyToken, checkData.checkIfCollectionExist, itemController.updateAnItem);

module.exports = router;