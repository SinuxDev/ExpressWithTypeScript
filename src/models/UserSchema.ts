import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  useremail: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, required: false },
  },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getAllUsers = () => UserModel.find();

export const getUserByEmail = (useremail: string) =>
  UserModel.findOne({ useremail });

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const getUserByID = (id: string) => UserModel.findById(id);

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((userDoc) => userDoc.toObject());

export const deleteUserByID = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });

export const updateUserByID = (id: string, values: Record<string, any>) =>
  UserModel.findOneAndUpdate({ _id: id }, values, { new: true });
