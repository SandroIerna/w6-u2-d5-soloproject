import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserDocument, UsersModel } from "./types";

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
    if (currentUser.password) {
      const plainPassword = currentUser.password;
      const hash = await bcrypt.hash(plainPassword, 11);
      currentUser.password = hash;
    }
  }
  next();
});

usersSchema.methods.toJSON = function () {
  const UserDocument = this;
  const user = UserDocument.toObject();
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  return user;
};

usersSchema.static("checkCredentials", async function (email, password) {
  const user: UserDocument = await this.findOne({ email });
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) return user;
    else return null;
  } else return null;
});

export default model<UserDocument, UsersModel>("User", usersSchema);
