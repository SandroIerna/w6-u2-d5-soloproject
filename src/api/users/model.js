import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    role: { type: String, enum: ["Guest", "Host"], default: "Guest" },
    accomodations: [
      { type: mongoose.Types.ObjectId, required: false, ref: "Accomodation" },
    ],
  },
  { timestamps: true }
);

usersSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainPassword = currentUser.password;
    currentUser.password = await bcrypt.hash(plainPassword, 10);
  }
  next();
});

usersSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  return user;
};

usersSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) return user;
    else return null;
  } else return null;
});

export default model("User", usersSchema);
