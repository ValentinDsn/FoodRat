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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// @ts-ignore
const mongoose = require("mongoose");
// @ts-ignore
const UserSchema = require("../models/user.model");
exports.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        const user = yield User.findOne({ email });
        if (!user) {
            res.status(400).send("User not found");
        }
        else {
            if (user.isValidated) {
                if (yield bcryptjs_1.default.compare(password, user.password)) {
                    user.token = jsonwebtoken_1.default.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, {
                        expiresIn: "2h",
                    });
                    res.status(200).json(user);
                }
                else {
                    res.status(400).send("Bad password");
                }
            }
            else {
                res.status(400).send("You are not validated please wait.");
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstname, lastname } = req.body;
        if (!(email && password && firstname && lastname)) {
            res.status(400).send("All input is required");
        }
        const oldUser = yield User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }
        const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User.create({
            email: email.toLowerCase(),
            password: encryptedPassword,
            firstname: firstname.toLowerCase(),
            lastname: lastname.toLowerCase()
        });
        user.token = jsonwebtoken_1.default.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, {
            expiresIn: "2h",
        });
        res.status(201).json(user);
    }
    catch (err) {
        console.log(err);
    }
});
