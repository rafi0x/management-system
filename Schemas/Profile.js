const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
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
  avatar: { type: String, trim: true, require: true },
  address: {
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    street: { type: String, trim: true },
    zipcode: { type: String, trim: true },
  },
  phone: {
    type: String,
    require: true,
    trim: true,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Profile", profileSchema);
