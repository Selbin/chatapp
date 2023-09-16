const mongoose = require('mongoose')
const dotEnv = require('dotenv')

dotEnv.config()

const dbConnect = () => {
    return mongoose.connect(process.env.MONGODB_URI, {
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