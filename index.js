const http = require('node:http')
const socketIO = require('socket.io')
const ChatMessage = require('./models/chatmessage.model')
const app = require('./app')


//configuracion .env
require('dotenv').config()

//configuracion bd
require('./config/db')

const server = http.createServer(app)

const PORT = process.env.PORT || 3000
server.listen(PORT)

//Config Socket.io
const io = socketIO(server, {
    cors: { origin: '*' }
})

io.on('connection', async (socket) => {
    console.log('Nueva conexión')
    socket.broadcast.emit('chat_message_server', {
        name: '¡WELCOME!',
        message: '✨Se ha conectado un nuevo marujon✨'
    })
    //Emitimos el número de clientes conectados
    io.emit('clients_count', io.engine.clientsCount)

    const messages = await ChatMessage.find().sort("-createdAt").limit(5)

    socket.emit('chat_init', {
        socket_id: socket.id,
        arr5Messages: messages
    })

    socket.on('chat_message', (data) => {
        ChatMessage.create(data)
        io.emit('chat_message_server', data)
    })

    //Me suscribo para detectar las desconexiones
    socket.on('disconnect', () => {
        socket.broadcast.emit('chat_message_server', {
            name: '¡CAMBIO Y CORTO!',
            message: '✨Adios marujones✨'
        })
        io.emit('clients_count', io.engine.clientsCount)
    })


})
