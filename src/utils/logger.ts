import pino from "pino";
import type { Logger } from "pino";

export default class AppLogger {
  private static instance: Logger;
  private constructor() {}

  public static getLogger() {
    if (!this.instance) {
      this.instance = pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      });
    }

    return this.instance;
  }
}
