const express = require('express');
const router = express.Router()

const controller = require('./controller');
// checkAuth is for checking valid JWT token
const checkAuth = require('../middleware/basicAuth');

router.post("/sign-up", controller.signup);

router.post("/sign-in", controller.signin);

router.post("/create-store", checkAuth, controller.createStore);

router.post("/stores", checkAuth, controller.stores);

router.post("/create-bag", checkAuth, controller.createBag);

router.post("/bags", checkAuth, controller.bags);

router.put("/update-area", checkAuth, controller.updateArea);

router.delete("/delete-bag", checkAuth, controller.deleteBag);

router.put("/transfer-ownership", checkAuth, controller.transferOwnership);

module.exports = router;