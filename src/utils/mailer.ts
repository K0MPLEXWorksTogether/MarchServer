import nodemailer from "nodemailer";
import AppLogger from "./logger";
import { EnvironmentError } from "../types/errors";
import type { MailTemplate } from "./templates/verification.template";

type SendMailInput = {
  to: string;
  template: MailTemplate;
};

export default class Mailer {
  private readonly logger = AppLogger.getLogger();
  private readonly transporter: nodemailer.Transporter;
  private readonly username: string;

  constructor() {
    const service = process.env.MAIL_SERVICE || "";
    const username = process.env.MAIL_USERNAME || "";
    const passkey = process.env.MAIL_PASSKEY || "";

    if (!service || !username || !passkey) {
      throw new EnvironmentError(
        "MAIL_SERVICE, MAIL_USERNAME and MAIL_PASSKEY must be set"
      );
    }

    this.username = username;
    this.transporter = nodemailer.createTransport({
      service,
      auth: {
        user: username,
        pass: passkey,
      },
    });
  }

  public async sendMail({ to, template }: SendMailInput): Promise<void> {
    await this.transporter.sendMail({
      from: this.username,
      to,
      subject: template.subject,
      html: template.html,
    });
    this.logger.info(`[mail] Sent "${template.title}" email to: ${to}`);
  }
}
