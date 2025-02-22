require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes')

const app = express()

app.use(express.json())

app.use('/api', routes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //Listen only upon database connection.
        app.listen(process.env.PORT, () => {
            console.log('Connected to database and listening on port', process.env.PORT);
        })
    })
    .catch((error) => {
        console.log(error)
    })
