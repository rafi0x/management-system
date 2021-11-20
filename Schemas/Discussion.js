const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    task_id: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      require: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      require: true,
    },
    message: {
      type: String,
    },
    attachment: [
      {
        type: String,
      },
    ],
    date_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Discussion", messageSchema);
