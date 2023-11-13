import * as mongoose from "mongoose";

const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = (req.body.token || req.query.token || req.headers["x-access-token"]).split(" ")[1];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decodedToken = jwt.verify(token, config.TOKEN_KEY);
        req.user_id = decodedToken.user_id;
    } catch (err) {
        console.log(err);
        return res.status(401).send("Invalid Token");
    }
    return next();
};

const isValidated = async (req, res, next) => {
    const User = mongoose.model('users',UserModel)

    await User.findById(req.user_id).catch(err => {
        if(err) return res.status(500).send('Error reading user data.');
    }).then(user => {
        if(user.isValidated) {
            return next();
        } else {
            return res.status(403).send('You are not authorized to access this resource.');
        }
    });
}


module.exports = {
    verifyToken: verifyToken,
    isValidated: isValidated,
};