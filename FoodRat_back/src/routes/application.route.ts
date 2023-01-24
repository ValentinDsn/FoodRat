// @ts-ignore
const itemController = require("../controllers/item.controller");
// @ts-ignore
const locationController = require("../controllers/location.controller");
// @ts-ignore
const express = require('express');
// @ts-ignore
const router = express.Router({ mergeParams: true });

router.get('/', itemController.getAllItems);
// router.get('/:location/', itemController.getAllItemsFromLocation);
// router.get('/:location/:id', itemController.getItemFromLocation);

// router.post('/createLocation', locationController.createLocation);
router.post('/:location/addItem/', itemController.createItem);
router.delete('/:location/deleteItem/:id', itemController.deleteItem);
router.patch('/:location/updateItem/:id', itemController.updateAnItem);

module.exports = router;