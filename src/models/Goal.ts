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
    description: { type: String, required: true, default: "" },
    remainingTime: {
      type: Number,
      required: true,
      default: function () {
        return this.allocatedTime;
      },
    },
    timeRemainingForTasks: { type: Number, required: true, default: 0 },
    status: {type: String, enum: ["completed", "active", "pending"]}
  },
  { timestamps: true }
);

export default mongoose.model("Goal", goalSchema);
