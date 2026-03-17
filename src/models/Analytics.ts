import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  totalFocusTime: {
    type: Number,
    default: 0,
  },
  totalPausedTime: {
    type: Number,
    default: 0,
  },
  sessions: {
    type: Number,
    default: 0,
  },
  taskDistribution: [
    {
      task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
      timeSpent: { type: Number, required: true },
      efficiency: { type: Number, required: true },
    },
  ],
  goalDistribution: [
    {
      task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal",
      },
      timeSpent: Number,
    },
  ],
  longestSession: { type: Number, required: true, default: 0 },
  averageSessionLength: { type: Number, required: true, default: 0 },
  averagePauseTime: { type: Number, required: true, default: 0 },
});

export default mongoose.model("Analytics", analyticsSchema);
