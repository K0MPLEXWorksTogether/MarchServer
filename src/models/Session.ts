import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal",
    required: true,
    index: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
    index: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  pauses: {
    start: Date,
    end: Date,
    required: true,
  },
  pausedTime: {
    type: Number,
    required: true,
  },
  focusTime: {
    type: Number,
    required: true,
  },
  eventTimeline: {
    type: [
      {
        event: {
          type: String,
          enum: ["pause", "focus"],
          required: true,
        },
        time: {
          type: Date,
          required: true,
        },
      },
    ],
    default: null,
  },
  score: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
  feeling: {
    type: String,
    default: ""
  },
});

export default mongoose.model("Session", sessionSchema);
