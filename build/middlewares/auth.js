"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const config = process.env;
const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        req.user = jwt.verify(token, config.TOKEN_KEY);
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};
const isValidated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield User.findById(req.user.user_id).catch(err => {
        if (err)
            return res.status(500).send('Error reading user data.');
    }).then(user => {
        if (user.isValidated) {
            return next();
        }
        else {
            return res.status(403).send('You are not authorized to access this resource.');
        }
    });
});
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield User.findById(req.user.user_id).catch(err => {
        if (err)
            return res.status(500).send('Error reading user data.');
    }).then(user => {
        if (user.role === 'admin') {
            return next();
        }
        else {
            return res.status(403).send('You are not authorized to access this resource.');
        }
    });
});
module.exports = {
    verifyToken: verifyToken,
    isValidated: isValidated,
    isAdmin: isAdmin
};
