const mongoose = require('mongoose')

const mongodbUri = 'mongodb+srv://selbin:selbin@cluster0.htivliz.mongodb.net/chatapp'

const dbConnect = () => {
    return mongoose.connect(mongodbUri, {
        minPoolSize: 5
    });
};

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error);
});

db.once('open', () => {
    console.log('Connected to MongoDB database');
});

module.exports = dbConnect