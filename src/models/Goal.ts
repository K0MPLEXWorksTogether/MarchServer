import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    goalName: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    allocatedTime: { type: Number, required: true },
    description: { type: String, default: "" },
    remainingTime: {
      type: Number,
      required: true,
      default: function () {
        return this.allocatedTime;
      },
    },
    label: { type: String, default: "" },
    timeRemainingForTasks: {
      type: Number,
      required: true,
      default: function () {
        return this.allocatedTime;
      },
    },
    status: {
      type: String,
      enum: ["todo", "doing", "done", "not doing"],
      default: "todo",
    },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1, goalName: 1 }, { unique: true });
export default mongoose.model("Goal", goalSchema);
