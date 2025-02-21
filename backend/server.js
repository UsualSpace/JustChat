require('dotenv').config()

const express = require('express')


const app = express();

app.get('/', (req, res) => {
    res.json({message: 'Welcome to the app poophead'});
})

app.get('/register/:email', (req, res) => {
    res.json({message: "You registered with an email"})
})

app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT);
})