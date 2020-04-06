const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
    user: { 
    	ref: 'User' },
    room:{ 
    	ref: 'Room' },
    message: {
        type: String
    },
    date_message: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('History', historySchema);
 