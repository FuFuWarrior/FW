const express = require('express');

const validationRoute = require('./routes/validateRoute'); 

const app  = express();

app.use(express.json());

app.get('/', function(req, res) {
    res.header("Content-Type", "application/json; charset=UTF-8");

    return res.status(200).json({
        message: "My Rule-Validation API",
        status: "success",
        data: {
            name: "Victor Anwanakak",
            github: "@fufuwarrior",
            email: "vanwanakak@gmail.com",
            mobile: "08180964221",
        }
    });
})

app.use(validationRoute);

module.exports = app;