// Import node modules
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors')
const utils = require('./utils')

// CORS options
const corsOptions = {
    credentials: true,
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
}

// Import routers
const api_router = require('./routers/api')

// Load env variables in dev environment
dotenv.config()

// Establish connection to MongoDB Atlas
mongoose.connect(process.env.MONGODB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
const mongo_connection = mongoose.connection

mongo_connection.on('error', () => { // If connection to Atlas fails
    console.log('Failed to connect to MongoDB Atlas!')
});
mongo_connection.once('open', () => { // If connection to Atlas succeeds
    console.log("Connection established with MongoDB Atlas!")

    // Start Express server
    const app = express()
    //// For cors
    app.use(cors(corsOptions))
    //// For session
    app.use(session({
        secret: utils.getRandomHexString(32),
        store: MongoStore.create({
            ttl: (24 * 3600), // 24 hours
            client: mongo_connection.getClient()
        }),
        name: "amazo_session",
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: (24 * 3600) // 24 hours
        },
        resave: false,
        saveUninitialized: true
    }))

    //// For routers
    app.use("/api", api_router)
    //// For everything else (React frontend)
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"))
    })
    //// For static files
    app.use(express.static(path.join(__dirname, "client", "build")))
    //// Starting server
    app.listen(process.env.PORT || 8000, () => {
        console.log("Express backend started at 8000")
    })

    // For starting collection process
    // Interval: 24 hours
    setInterval(utils.collectAllProductPrices,24*60*60*1000)
})