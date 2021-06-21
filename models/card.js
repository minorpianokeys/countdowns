const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: String,
    
    date: {
        type: String,
        required: true
    },
    imgUrl: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Card = mongoose.model('Card', cardSchema)

module.exports = Card;