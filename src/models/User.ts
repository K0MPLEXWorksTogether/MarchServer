import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    isVerified: { type: Boolean, required: true, default: false },
    passwordHash: { type: String, required: true },
    timezone: { type: String, required: true },
    locale: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
