const { Schema, model } = require('mongoose')
const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true, versionKey: false
})

const User = model('user', userSchema)
module.exports = User

