const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    conversation_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
    },
    attachment: [
      {
        type: String,
      },
    ],
    sender: {
      id: Schema.Types.ObjectId,
      name: String,
      avatar: String,
    },
    receiver: {
      id: Schema.Types.ObjectId,
      name: String,
      avatar: String,
    },
    date_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Message", messageSchema);
