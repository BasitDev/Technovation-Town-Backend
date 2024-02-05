import mongoose from "mongoose";
import User from "../user.model.js";
const { Schema } = mongoose;

const otSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    // ...User.schema.obj,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ot", otSchema);
