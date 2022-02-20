const jwt = require('jsonwebtoken');
const Users = require('../Models/userModel');
const Stores = require('../Models/storeModel');
const Bags = require('../Models/bagModel');
const {
    SERVERERROR,
    SUCCESSCODE,
    CLIENTSIDEERROR
} = require('../constants/common');
const { v4: uuidv4 } = require('uuid');

const controller = {};


controller.signup = async (req, res) => {
    try {
        const userEmail = req.body.email;
        const user = await Users.findOne({ email: userEmail });

        // if email already exist
        if (user) {
            res.status(CLIENTSIDEERROR.ALREADYEXISTCODE).json({
                errors: { message: "Email already exist." },
                status: false,
            });
        }
        else {
            let userData = new Users(req.body);
            let createdUser = await userData.save();

            res.status(SUCCESSCODE.CREATED)
                .json({
                    message: "User created successfully",
                    status: true,
                    user: createdUser
                });
        }


    } catch (error) {
        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}


controller.signin = async (req, res) => {
    try {
        const userEmail = req.body.email;
        const userPassword = req.body.password;

        const user = await Users.findOne({ email: userEmail, password: userPassword });

        // if user does not exist in database
        if (!user) {
            return res.status(CLIENTSIDEERROR.NOTFOUNDCODE)
                .json({
                    message: "Wrong Email or Password",
                    status: false,
                });
        }

        // creating JWT token
        const token = jwt.sign(
            {
                email: req.body.email,
                password: req.body.password
            },
            "secret",
            {
                expiresIn: "3h"
            }
        );


        res.status(SUCCESSCODE.STANDARD)
            .json({
                message: "Login successfully",
                status: true,
                token,
                user
            });

    } catch (error) {
        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}

controller.createStore = async (req, res) => {
    try {

        const { userId } = req.body;
        const user = await Users.findOne({ _id: userId });

        // if user does not exist in database
        if (!user) {
            return res.status(CLIENTSIDEERROR.NOTFOUNDCODE)
                .json({
                    message: "User does not exist",
                    status: false,
                });
        }

        let store = new Stores(req.body);
        const createdStore = await store.save();

        res.status(SUCCESSCODE.STANDARD)
            .json({
                message: "Store created successfully",
                status: true,
                store: createdStore
            });

    } catch (error) {

        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}

controller.stores = async (req, res) => {
    try {
        const userId = req.body.userId;
        const store = await Stores.find({ userId: userId });

        res.status(SUCCESSCODE.STANDARD)
            .json({
                message: "Stores fetched successfully",
                status: true,
                store
            });

    } catch (error) {
        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}

controller.createBag = async (req, res) => {
    try {

        const { storeId } = req.body;
        const store = await Stores.findOne({ _id: storeId });

        // if user does not exist in database
        if (!store) {
            return res.status(CLIENTSIDEERROR.NOTFOUNDCODE)
                .json({
                    message: "Store does not exist",
                    status: false,
                });
        }

        var uuid = uuidv4();
        req.body.uuid = uuid;
        const bag = new Bags(req.body);
        const createdBag = await bag.save();

        res.status(SUCCESSCODE.STANDARD)
            .json({
                message: "Bag create successfully",
                status: true,
                bag: createdBag
            });

    } catch (error) {
        console.log(error);
        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}

controller.bags = async (req, res) => {
    try {

        const storeId = req.body.storeId;
        const area = req.body.area;
        let bag = null;

        // if area is present
        if (area) {
            bag = await Bags.find({ storeId: storeId, area: area });
        }
        // if area is not present then return all bags
        else {
            bag = await Bags.find({ storeId: storeId });
        }

        res.status(SUCCESSCODE.STANDARD)
            .json({
                message: "Bags fetched successfully",
                status: true,
                bag
            });

    } catch (error) {
        console.log(error);
        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}

controller.updateArea = async (req, res) => {
    try {
        const bagId = req.body.bagId;
        const newArea = req.body.newArea;
        const bagFound = await Bags.findOne({ _id: bagId });

        // if bag not found
        if (!bagFound) {
            return res.status(CLIENTSIDEERROR.NOTFOUNDCODE).json({
                errors: { message: "Bag not found" },
                status: false,
            });
        }

        // updating area of bag by bag id
        const query = { _id: bagId };
        const update = { $set: { area: newArea } }
        const bag = await Bags.updateOne(query, update, { runValidators: true });


        const updatedBag = await Bags.findOne({ _id: bagId });

        res.status(SUCCESSCODE.STANDARD)
            .json({
                message: "Bag updated successfully",
                status: true,
                bag: updatedBag
            });

    } catch (error) {
        console.log(error);
        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}

controller.deleteBag = async (req, res) => {
    try {
        const bagId = req.body.bagId;
        const bagFound = await Bags.findOne({ _id: bagId });

        // if bag not found
        if (!bagFound) {
            return res.status(CLIENTSIDEERROR.NOTFOUNDCODE).json({
                errors: { message: "Bag not found" },
                status: false,
            });
        }

        // if bag is in DAMAGED or REPAIR area then we can not delete bag
        if (bagFound.area != "READY") {
            return res.status(CLIENTSIDEERROR.BADREQUESTCODE).json({
                errors: { message: "Bag must be in READY area to delete it." },
                status: false,
            });
        }

        // deleting bag
        const bag = await Bags.deleteOne({ _id: bagId });

        res.status(SUCCESSCODE.STANDARD)
            .json({
                message: "Bag deleted successfully",
                status: true
            });

    } catch (error) {
        console.log(error);
        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}

controller.transferOwnership = async (req, res) => {
    try {
        const { oldOwnerId, newOwnerEmail, stores } = req.body;


        const queryForOldOwner = { _id: oldOwnerId };
        const user = await Users.findOne(queryForOldOwner);

        // if user(old owner) not found
        if (!user) {
            return res.status(CLIENTSIDEERROR.NOTFOUNDCODE).json({
                errors: { message: "User not found" },
                status: false,
            });
        }

        const queryForNewOwner = { email: newOwnerEmail };
        const newUser = await Users.findOne(queryForNewOwner);

        // if user(new owner) not found
        if (!newUser) {
            return res.status(CLIENTSIDEERROR.NOTFOUNDCODE).json({
                errors: { message: "New User not found" },
                status: false,
            });
        }


        // update all the stores owner by new user id
        const filter = { "_id": { $in: stores } };
        const update = { $set: { userId: newUser._id } };
        const updatedStores = await Stores.updateMany(filter, update);

        res.status(SUCCESSCODE.STANDARD)
            .json({
                message: "Stores transferred successfully",
                status: true
            });

    } catch (error) {
        console.log(error);
        res.status(SERVERERROR.CODE).json({
            errors: { message: error.toString() },
            status: false,
        });
    }
}

module.exports = controller;