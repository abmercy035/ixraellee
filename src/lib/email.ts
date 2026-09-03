import nodemailer from "nodemailer";
import { MailtrapClient } from "mailtrap";

export interface EmailRecipient {
  name?: string;
  address: string;
}

export interface EmailPayload {
  to: string;
  name?: string;
  subject: string;
  html: string;
}

export interface BroadcastPayload {
  subject: string;
  html: string;
  recipients: EmailRecipient[];
}

function getSender() {
  return {
    name: process.env.MAILTRAP_SENDER_NAME || process.env.ENSEND_SENDER_NAME || "Ixraellee Journal",
    address: process.env.MAILTRAP_SENDER_ADDRESS || process.env.ENSEND_SENDER_ADDRESS || "no-reply@ixraellee.com",
  };
}

function getMailtrapClient(isBulk: boolean = false): MailtrapClient | null {
  const token = process.env.MAILTRAP_TOKEN || process.env.MAILTRAP_API_TOKEN;
  if (!token || token === "your_mailtrap_token") return null;
  try {
    return new MailtrapClient({ token, bulk: isBulk });
  } catch (err) {
    console.error("[Mailtrap Client Init Error]:", err);
    return null;
  }
}

function getSmtpTransporter() {
  const host = process.env.MAILTRAP_HOST || process.env.SMTP_HOST;
  const user = process.env.MAILTRAP_USER || process.env.SMTP_USER;
  const pass = process.env.MAILTRAP_PASS || process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  const port = parseInt(process.env.MAILTRAP_PORT || process.env.SMTP_PORT || "2525", 10);
  return nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });
}

export interface TemplateEmailPayload {
  to: string;
  name?: string;
  templateUuid?: string;
  templateVariables?: Record<string, string>;
  isBulk?: boolean;
}

/**
 * Send email using Mailtrap Template (Single transactional email or bulk)
 */
export async function sendMailtrapTemplateEmail(payload: TemplateEmailPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const sender = getSender();
    // Pass isBulk = false for single mail (send.api.mailtrap.io), or true for bulk sending (bulk.api.mailtrap.io)
    const mailtrapClient = getMailtrapClient(payload.isBulk ?? false);
    const templateUuid = payload.templateUuid || process.env.MAILTRAP_WELCOME_TEMPLATE_UUID || "16d0c4d5-a266-427b-b3e1-7999862ec84b";

    if (mailtrapClient) {
      const response = await mailtrapClient.send({
        from: { name: sender.name, email: sender.address },
        to: [{ email: payload.to, name: payload.name || "Subscriber" }],
        template_uuid: templateUuid,
        template_variables: payload.templateVariables || {
          company_info_name: sender.name,
          name: payload.name || "Subscriber",
        },
      });
      console.log(`[Mailtrap Template Send Success]: Dispatched single/template to ${payload.to}`, response);
      return { success: true };
    }

    console.log(`[Mailtrap Template Notice - Token missing] To: ${payload.to} | Template: ${templateUuid}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send template email";
    console.error("[Mailtrap Template Exception]:", message);
    return { success: false, error: message };
  }
}

/**
 * Single Mail Message (e.g. Welcome email upon reader subscription)
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const sender = getSender();
    const mailtrapClient = getMailtrapClient(false);

    // 1. Try Mailtrap Official API Client
    if (mailtrapClient) {
      const response = await mailtrapClient.send({
        from: { name: sender.name, email: sender.address },
        to: [{ email: payload.to, name: payload.name || "Reader" }],
        subject: payload.subject,
        html: payload.html,
      });
      console.log(`[Mailtrap API Send Success]: Dispatched to ${payload.to}`, response);
      return { success: true };
    }

    // 2. Try Mailtrap / Standard SMTP Transporter
    const smtp = getSmtpTransporter();
    if (smtp) {
      const info = await smtp.sendMail({
        from: `"${sender.name}" <${sender.address}>`,
        to: payload.name ? `"${payload.name}" <${payload.to}>` : payload.to,
        subject: payload.subject,
        html: payload.html,
      });
      console.log(`[Mailtrap SMTP Send Success]: Dispatched to ${payload.to} | MessageId: ${info.messageId}`);
      return { success: true };
    }

    // 3. Fallback stub when keys are missing
    console.log(`[Email Service Notice - Set MAILTRAP_TOKEN or MAILTRAP_USER/PASS in .env] To: ${payload.to} | Subject: ${payload.subject}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send email message";
    console.error("[Email Dispatch Exception]:", message);
    return { success: false, error: message };
  }
}

/**
 * Broadcast Mail (Batch bulk mailing for new posts and subscriber updates using Mailtrap Bulk API)
 */
export async function sendBroadcast(payload: BroadcastPayload): Promise<{
  success: boolean;
  sentCount: number;
  error?: string;
}> {
  try {
    if (!payload.recipients || payload.recipients.length === 0) {
      return { success: true, sentCount: 0 };
    }

    const sender = getSender();
    const bulkMailtrapClient = getMailtrapClient(true);
    const smtp = getSmtpTransporter();
    const BATCH_SIZE = 50;
    let sentCount = 0;

    for (let i = 0; i < payload.recipients.length; i += BATCH_SIZE) {
      const batch = payload.recipients.slice(i, i + BATCH_SIZE);

      if (bulkMailtrapClient) {
        await bulkMailtrapClient.send({
          from: { name: sender.name, email: sender.address },
          to: batch.map((r) => ({ email: r.address, name: r.name || "Subscriber" })),
          subject: payload.subject,
          html: payload.html,
        });
        sentCount += batch.length;
      } else if (smtp) {
        const bccList = batch.map((r) => (r.name ? `"${r.name}" <${r.address}>` : r.address)).join(", ");
        await smtp.sendMail({
          from: `"${sender.name}" <${sender.address}>`,
          bcc: bccList,
          subject: payload.subject,
          html: payload.html,
        });
        sentCount += batch.length;
      } else {
        console.log(
          `[Broadcast Notice - Set MAILTRAP_TOKEN or MAILTRAP_USER/PASS in .env] Subject: ${payload.subject} | Recipients: ${payload.recipients.length}`
        );
        return { success: true, sentCount: payload.recipients.length };
      }
    }

    return { success: true, sentCount };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Broadcast failed";
    console.error("[Broadcast Dispatch Exception]:", message);
    return { success: false, sentCount: 0, error: message };
  }
}
