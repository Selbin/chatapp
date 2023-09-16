const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    passPhrase: {type: String, required: true}
}, {timestamps: true})

const User = mongoose.model('User', UserSchema)

module.exports = User