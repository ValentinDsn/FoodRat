"use strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @ts-ignore
const mongoose = require("mongoose");
// @ts-ignore
import {Request, Response} from "express";
// @ts-ignore
const UserSchema = require("../models/user.model");

exports.login = async (req: Request, res: Response) => {
    try {
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        const UserModel = mongoose.model('users', UserSchema);

        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }

        const user = await UserModel.findOne({email});
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (!user.isValidated) {
            return res.status(401).send("You are not validated please wait.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send("Incorrect password or e-mail address");
        }

        const AuthToken = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: 600,
            }
        );

        const RefreshToken = jwt.sign(
            {user_id: user._id, email},
            process.env.REFRESH_TOKEN_KEY,
            {expiresIn: 86400}
        );

        //Response to the front
        const response = {
            user_id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,

            token: AuthToken,
            tokenType: "Bearer",
            expiresIn: 10,

            refreshToken: RefreshToken,
            refreshTokenExpireIn: 1440
        };

        // @ts-ignore
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        return res.status(500).send("An error occurred");
    }
}

exports.register = async (req: Request, res: Response) => {
    try {
        const {email, password, firstname, lastname} = req.body;
        const UserModel = mongoose.model('users', UserSchema);

        if (!(email && password && firstname && lastname)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await UserModel.findOne({email});
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            email: email.toLowerCase(),
            password: encryptedPassword,
            firstname: firstname.charAt(0).toUpperCase() + firstname.slice(1),
            lastname: lastname.charAt(0).toUpperCase() + lastname.slice(1),
        });

        user.save(function (err: any) {
            if (err)
                throw err;
            res.status(201).send("Register successful!");
        });

    } catch (err) {
        console.log(err);
    }
}

exports.refreshT = async (req: Request, res: Response) => {
    const refreshToken = req.body.refresh;
    if (!refreshToken) {
        return res.status(401).send("error: Refresh Token is required");
    }

    try {
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

        const response = {
            isSucces: true,
            newAuthToken: jwt.sign(
                {user_id: decodedToken.user_id, email: decodedToken.email},
                process.env.TOKEN_KEY,
                {expiresIn: 600}
            ),
            newAuthTokenExpireIn: 10,
        };

        // @ts-ignore
        return res.status(200).json(response);

    } catch (err) {
        return res.status(403).send("error: Invalid Refresh Token");
    }
}