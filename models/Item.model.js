const { Schema, model } = require("mongoose");

const itemSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true
      },
      type: {
        type: String,      
        required: true, 
        enum: ["Weapon", "Armor", "Artefact"],    
      },
      modifier: {
        type: Number,
        default: 1,
      },
      value: {
        type: Number,
        default: 1
      },
      equipped: {
        type: Boolean,
        default: false
      }
    },
    {
      timestamps: true
    }
  );

  const Item = model("Item", itemSchema);

  module.exports = Item;