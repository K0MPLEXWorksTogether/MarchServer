import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: { type: String, required: true },
    allocatedTime: { type: Number, required: true },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
      index: true,
    },
    spentTime: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["active", "done", "pending"],
      default: "pending",
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
