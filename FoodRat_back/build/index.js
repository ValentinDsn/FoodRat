"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const dotenv_1 = __importDefault(require("dotenv"));
// @ts-ignore
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 6000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({ message: "Welcome in FoodRat" });
});
// db connection
const db = require("./models/dbconnexion");
const ApplicationRoute = require('./routes/application.route');
app.use("/application", ApplicationRoute);
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
