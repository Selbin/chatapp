const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    roomName: {type: String, required: true, unique: true},
    passPhrase: {type: String, required: true},
    users: [
        {
          type: String,
          trim: true
        },
      ],
}, {timestamps: true})

RoomSchema.pre('save', function(next) {
  if (this.users.length > 2) {
    // You can throw an error or handle it as needed
    const error = new Error('Only two members allowed');
    return next(error);
  }
  next();
});

  
const Room = mongoose.model('Room', RoomSchema)

module.exports = Room