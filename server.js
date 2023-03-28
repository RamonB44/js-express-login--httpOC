const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

require('dotenv').config();

var corsOptions = {
    origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: "expressjs-cookie-session",
        secret: process.env.COOKIE_SECRET, // should use as secret environment variable
        httpOnly: true
    })
);

const connection = require("./app/db.js");

/* drop and resync tables *********************/

if (process.env.NODE_ENV != "production") {
    connection.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    });
} else {
    connection.sequelize.sync()
        .then(() => {
            console.log("Synced db.");
        })
        .catch((err) => {
            console.log("Failed to sync db: " + err.message);
        });
}


// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to express.js application." });
});

require("./routes/routes")(app);

// set port, listen for requests
const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


