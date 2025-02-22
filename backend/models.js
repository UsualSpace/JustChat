const mongoose = require('mongoose')

const schema = mongoose.Schema 

const user_schema = new schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    uid: {type: Number, required: true}
}, {timestamps: true})

module.exports = mongoose.model('User', user_schema)