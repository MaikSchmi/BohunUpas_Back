const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
    {
      recipient: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      subject: {
        type: String,
      },
      textBody: {
        type: String,
      },
      attachment: {
        type: [Schema.Types.ObjectId],
        ref: "Item",
      },
      messageType: {
        type: String,
        enum: ["friendrequest", "message"]
      }
    },
    {
      timestamps: true
    }
  );

  const Message = model("Message", messageSchema);

  module.exports = Message;