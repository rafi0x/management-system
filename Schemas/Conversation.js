const { Schema, model } = require("mongoose");

const conversationSchema = new Schema(
  {
    creator: {
      id: Schema.Types.ObjectId,
      name: String,
      avatar: String,
    },
    participant: {
      id: Schema.Types.ObjectId,
      name: String,
      avatar: String,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamp: true,
  }
);

module.exports = model("Conversation", conversationSchema);
