const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

const User = require('./models/user.model')

app.use(cors())

app.post('/api/users/register', async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        })

        if (!user) {
            return res.status(401).json({ message: 'Error email y/o contraseña' })
        }
        res.json({
            message: 'Login correcto',
            token: jwt.sign({
                user_id: user._id,
                user_name: user.username
            }, 'churruscla')
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = app