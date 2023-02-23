import { Model, Document } from "mongoose";

interface User {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: "User" | "Admin";
  accomodations: [{}];
}

export interface UserDocument extends User, Document {}

export interface UsersModel extends Model<UserDocument> {
  checkCredentials(
    email: string,
    password: string
  ): Promise<UserDocument | null>;
}
