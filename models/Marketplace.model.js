const { Schema, model } = require("mongoose");

const marketplaceSchema = new Schema(
    {
      item: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          unique: true,
      },
      price: {
          type: Number,
          required: true
      },
      owner: {
          type: Schema.Types.ObjectId,
          ref: "Character",
      },
    },
    {
      timestamps: true
    }
  );

  const Marketplace = model("Marketplace", marketplaceSchema);

  module.exports = Marketplace;