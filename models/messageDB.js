const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: {type: String, required: true},
  productId: {type: String, required: true},
  senderId: { type: String, required: true },
  //receiver: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now},
  // Add other message-related fields
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;