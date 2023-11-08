"use strict";
import axios from 'axios';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @ts-ignore
const mongoose = require("mongoose");
// @ts-ignore
import {Request, Response} from "express";
// @ts-ignore
const UserSchema = require("../models/user.model");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const UserModel = mongoose.model('users', UserSchema);

        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }

        if (!user.isValidated) {
            return res.status(400).send("You are not validated please wait.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).send("Bad password");
        }

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token;
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send("An error occurred");
    }
}

exports.register =async (req: Request, res: Response) => {
    try {
        const { email, password, firstname, lastname } = req.body;
        const UserModel = mongoose.model('users', UserSchema);

        if (!(email && password && firstname && lastname)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await UserModel.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            email: email.toLowerCase(),
            password: encryptedPassword,
            firstname: firstname.toLowerCase(),
            lastname: lastname.toLowerCase()
        });

        user.token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.save(function (err, savedUser) {
            if (err)
                throw err;
            res.status(201).json(user);
        });

    } catch (err) {
        console.log(err);
    }
};