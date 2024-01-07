require('dotenv').config()

MONGODB_URI='mongodb+srv://fullstack:fullstack@cluster0.413sbvx.mongodb.net/BlogApp?retryWrites=true&w=majority'
PORT=3003

module.exports = {
    MONGODB_URI, PORT
}