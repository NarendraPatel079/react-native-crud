const express = require("express");
const mongoose = require("mongoose");
const route = require("./route/routes");
const cors = require("cors");
const bodyParser = require("body-parser");

require('dotenv').config();

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/users', route);

const PORT = process.env.DEFAULT_CONNECTION_PORT;
const url = process.env.MONGODB_CONNECT_URL;
// console.log(url);

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
}).catch(error => {
    console.log("Error: ", error.message);
});
mongoose.set('useCreateIndex', true);
