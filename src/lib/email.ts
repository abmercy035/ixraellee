export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  try {
    // Pluggable service handler: ready for custom SMTP, Nodemailer, or API integration
    console.log(`[Email Service Stub] Dispatching email to: ${payload.to} | Subject: ${payload.subject}`);
    
    // Custom service integration point:
    // e.g. await customTransporter.sendMail(...)
    
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send email";
    console.error("[Email Service Error]:", message);
    return { success: false, error: message };
  }
}
