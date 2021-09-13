const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Users",
  },
  title: {
    type: String,
    require: true,
    trim: true,
  },
  description: {
    type: String,
    require: true,
  },
  team: {
    type: String,
    require: true,
  },
  users: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  attachments: { type: Array, default: [] },
  deadline: {
    type: Date,
    require: true,
  },
  status: {
    type: String,
    default: "Incomplete",
    enum: ["Complete", "Pendding", "Incomplete"],
  },
  deadLine: {
    type: Date,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Task", taskSchema);
