import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
  {
    producitiveTime: { type: Number, required: true },
    pomodoro: { type: Boolean, required: true, default: false },
    breakTimeCounted: { type: Boolean, required: true, default: false },
    eventTime: { type: Boolean, required: true, default: false },
    feelings: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Configuration", configSchema);
