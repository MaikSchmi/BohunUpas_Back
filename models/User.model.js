const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    usernameLC: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    souls: {
      type: Number,
      required: true,
      default: 0
    },
    achievements: {
      type: Schema.Types.ObjectId, 
      ref: "Achievement",
    },
    friends: {
      type: [Schema.Types.ObjectId], 
      ref: "User"
    },
    messages: {
      type: [Schema.Types.ObjectId], 
      ref: "Message"
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;