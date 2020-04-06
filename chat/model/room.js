const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date_created: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Room', roomSchema );
 