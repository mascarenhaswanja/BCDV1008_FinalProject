const mongoose  = require('mongoose')

const historySchema = new mongoose.Schema({
    user: { 
        type: String,
        required: true,
     },
    room:{ 
        type: String, 
        required: true, 
    },
    message: {
        type: String
    },
    date_message: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Historie', historySchema);
 