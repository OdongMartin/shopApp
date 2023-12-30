const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    chatId: {type: String, required: true},
});

const chats = mongoose.model('chats', chatSchema);

module.exports = chats;