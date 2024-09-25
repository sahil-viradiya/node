import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userName: {type:String,default:""},
  isLogin: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);

const loginUserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  token: String,
  uniq_username: String,
  isLogin: Boolean,
});

export const logedUser = mongoose.model("loginUser", loginUserSchema);
