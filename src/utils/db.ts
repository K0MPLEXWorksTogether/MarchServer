import mongoose from "mongoose";
import AppLogger from "./logger";
import { EnvironmentError } from "../types/errors";

export default async function connectDB() {
  const logger = AppLogger.getLogger();
  try {
    const connectionUrl = process.env.MONGODB_URL;
    if (!connectionUrl) {
      throw new EnvironmentError(
        "Empty connection string for MongoDB connection"
      );
    }
    const connection = await mongoose.connect(connectionUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(
      `[connection] MongoDB connected successfully: ${connection.connection.host}`
    );
  } catch (err: unknown) {
    if (err instanceof EnvironmentError) {
      logger.error(
        "[connection] MongoDB connection failed: empty connection string in enviroment"
      );
    } else if (err instanceof Error) {
      logger.error(`[connection] MongoDB connection failed: ${err.message}`);
    }

    throw err;
  }
}
