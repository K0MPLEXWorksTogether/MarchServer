import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    task: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Task" },
    description: { type: String },
    eventStart: { type: Date, required: true },
    eventEnd: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
