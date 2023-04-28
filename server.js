const express = require("express");
const cors = require("cors");
const connection = require("./app/db.js");
const ArduinoReader = require("./app/arduino.js")
const { Server: SocketIoServer } = require('socket.io');
const { createAdapter } = require("@socket.io/redis-adapter");

const app = express();

const http = require("http").Server(app)

const corsOptions = {
    origin: ["http://localhost:4200", "http://localhost:3000", "http://localhost:3001"],
};

const io = new SocketIoServer(http, {
    cors: corsOptions,
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ['Access-Control-Allow-Headers', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Origin'],
    credentials: true,
    pingInterval: 5000,
    allowUpgrades: true,
    // pingTimeout: 60000 // 2 minutos y 30 segundos
});

io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});
/* Create a new Socket Connection */
const pubClient = require("./app/redis.js");
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
io.listen(3001);

require('dotenv').config();

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.set("socketio", io);

app.set("arduino", ArduinoReader);

/*app.use(
    cookieSession({
        name: "expressjs-cookie-session",
        secret: process.env.COOKIE_SECRET, // should use as secret environment variable
        httpOnly: true
    })
);*/

/* Drop and resync tables */
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

// set port, listen for requests
const PORT = process.env.APP_PORT || 8080;

http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

/* Declare routes */
require("./routes/routes")(app);

