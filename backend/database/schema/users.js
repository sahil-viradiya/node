import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  isLogin: { type: Boolean, default: false },
});

export default mongoose.model("users", UserSchema);
