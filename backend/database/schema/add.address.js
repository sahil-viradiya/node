import mongoose from "mongoose";

const AddAddressSchema = new mongoose.Schema({
  address_id: Number,
  address: String,
  landmark: String,
  sender_name: String,
  sender_mobile: String,
});

export default mongoose.model("address", AddAddressSchema);
