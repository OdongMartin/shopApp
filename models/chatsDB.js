const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatId: {type: String, required: true},
    storeName:{type: String, required: true},
    productName:{type: String, required: true},
    storeImagePath: {type: String, required: true},
    latestMessage: {type: String, required: true},
    time: { type: Date , required: true},
});

const chats = mongoose.model('chats', chatSchema);

module.exports = chats;