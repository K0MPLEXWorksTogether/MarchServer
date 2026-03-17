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
    description: { type: String, required: true, default: "" },
    status: {
      type: String,
      enum: ["todo", "doing", "done", "not doing"],
      default: "todo",
      required: true,
    },
    priority: {
      type: Number,
      default: -1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
