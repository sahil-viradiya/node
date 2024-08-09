import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: String,
  landmark: String,
  sender_name: String,
  sender_mobile: String,
});

export default mongoose.model("Address", addressSchema);
