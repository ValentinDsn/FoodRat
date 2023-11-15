// @ts-ignore
import mongoose from "mongoose";
// @ts-ignore
import UserSchema from '../models/user.model'
const UserModel = mongoose.model("Users", UserSchema);

exports.getUserInfo = (req, res) => {
    UserModel.findOne({_id: req.user_id}, (err, user) => {
        if (err) {
            res.status(404).send({message: err});
        }
        if (!user) {
            return res.status(500).send({message: "Error : User not found"});
        }
        res.status(200).json(user);
    })
};

exports.updateAnUser = (req, res) => {

    UserModel.findByIdAndUpdate(req.user_id, req.body, { new: true }, (err, userResult) => {
        if (err) {
            return res.status(500).send({ message: "Error updating user" });
        }
        if (!userResult) {
            return res.status(404).send({ message: "User not found with ID: " + req.user_id });
        } else {
            return res.status(200).send({ message: "User updated"});
        }
    });
};