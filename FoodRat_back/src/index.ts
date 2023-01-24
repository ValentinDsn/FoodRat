// @ts-ignore
import dotenv from 'dotenv';
// @ts-ignore
import express from 'express';
const app = express();

dotenv.config();
const port = process.env.PORT || 6000;

app.use(express.json());

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