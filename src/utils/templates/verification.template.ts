export type MailTemplate = {
  title: string;
  subject: string;
  html: string;
};

type VerificationTemplateInput = {
  username: string;
  verificationUrl: string;
};

export function verificationTemplate({
  username,
  verificationUrl,
}: VerificationTemplateInput): MailTemplate {
  return {
    title: "Verify your account",
    subject: "Verify your March account",
    html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #f6f8fb; color: #1f2937; }
            .container { max-width: 560px; margin: 24px auto; background: #ffffff; border-radius: 8px; padding: 24px; }
            .button {
              display: inline-block;
              background: #2563eb;
              color: #ffffff !important;
              text-decoration: none;
              padding: 12px 18px;
              border-radius: 6px;
              font-weight: 600;
            }
            .muted { color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Welcome, ${username}</h2>
            <p>Please verify your email address to finish setting up your account.</p>
            <p><a class="button" href="${verificationUrl}">Verify account</a></p>
            <p class="muted">If the button does not work, use this URL:</p>
            <p class="muted">${verificationUrl}</p>
          </div>
        </body>
      </html>
    `,
  };
}
