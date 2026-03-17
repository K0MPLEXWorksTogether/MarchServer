import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    todo: { type: String, required: true },
    status: {
      type: String,
      enum: ["todo", "doing", "done", "not doing"],
      required: true,
      default: "todo",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
