import mongoose from "mongoose";

const { Schema, model } = mongoose;

const accomodationsSchema = new Schema(
  {
    name: { type: String, required: true },
    host: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Accomodation", accomodationsSchema);
