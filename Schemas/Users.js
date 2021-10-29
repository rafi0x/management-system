const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    firstname: {
      type: String,
      maxlength: 16,
      minlength: 3,
      trim: true,
      require: true,
    },
    lastname: {
      type: String,
      maxlength: 16,
      minlength: 3,
      trim: true,
    },
  },
  username: {
    type: String,
    maxlength: 10,
    minlength: 3,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  role: {
    type: String,
    require: true,
  },
  avatar: String,
  status: {
    type: String,
    enum: ["active", "suspended"],
    default: "active",
    trim: true,
  },
  tempKeys: { type: Array, default: [] },
  createTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("User", userSchema);
