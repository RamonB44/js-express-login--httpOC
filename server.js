const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const connection = require('./app/db.js');
const { Server: SocketIoServer } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const http = require('http');

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: ['http://localhost:4200', 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Access-Control-Allow-Headers', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Origin'],
    preflightContinue: true,
};

const io = new SocketIoServer(server, {
    cors: corsOptions,
    credentials: true,
    pingInterval: 5000,
    allowUpgrades: true,
});

io.engine.on('connection_error', (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
});

/* Create a new Socket Connection */
const pubClient = require('./app/redis.js');
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

require('dotenv').config();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('socketio', io);


app.use(
    cookieSession(
        {
            name: "refresh_token",
            secret: process.env.REFRESH_TOKEN_PRIVATE_KEY, // Secret key for refresh token cookie
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    )
);

app.use(
    cookieSession(
        {
            name: "access_token",
            secret: process.env.ACCESS_TOKEN_PRIVATE_KEY, // Secret key for access token cookie
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
        }
    )
);


/* Drop and resync tables */
if (process.env.NODE_ENV !== 'production') {
    connection.sequelize.sync({ force: true }).then(() => {
        console.log('Drop and re-sync db.');
    });
} else {
    connection.sequelize.sync()
        .then(() => {
            console.log('Synced db.');
        })
        .catch((err) => {
            console.log(`Failed to sync db: ${err.message}`);
        });
}

// set port, listen for requests
const PORT = process.env.APP_PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

/* Declare routes */
require('./routes/routes')(app);