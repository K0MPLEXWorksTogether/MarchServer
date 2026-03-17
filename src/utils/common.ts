import { Logger } from "pino";
import { InvalidError } from "../types/errors";

export function handleError(err: any, task: string, logger: Logger): never {
  if (err instanceof InvalidError) {
    logger.error(`[repo] (documented) ${task} failed: ${err.message}`);
    throw err;
  } else {
    logger.error(`[repo] ${task} failed: ${err.message}`);
    throw err;
  }
}
