const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const characterSchema = new Schema(
  {
    race: {
      type: String,      
      required: true, 
      enum: ["none", "Dino", "Undead", "Human"],
      default: "none"     
    },
    inventory: {
      type: [Schema.Types.ObjectId],
      ref: "Item"
    },
    weapon: {
      type: [Schema.Types.ObjectId],
      ref: "Item",
      required: true,
    },
    armor: {
      type: [Schema.Types.ObjectId], 
      ref: "Item",
      required: true,
    },
    artefact: {
      type: [Schema.Types.ObjectId], 
      ref: "Item",
      required: true,
    },
    level: {
      type: Number,
      required: true,
      default: 1
    }, 
    experience: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Character = model("Character", characterSchema);

module.exports = Character;
