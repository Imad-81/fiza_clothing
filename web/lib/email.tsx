import type { OrderForEmail } from "@/lib/queries/orders";

export function isEmailConfigured(): boolean {
  return false;
}

export interface SendResult {
  ok: boolean;
  error?: string;
}

export async function sendOrderConfirmationEmail(
  _order: OrderForEmail,
): Promise<SendResult> {
  return { ok: false, error: "Email service disabled (Resend removed)" };
}

export async function sendOrderStatusUpdateEmail(
  _order: OrderForEmail,
  _newStatus: string,
): Promise<SendResult> {
  return { ok: false, error: "Email service disabled (Resend removed)" };
}

export async function sendOrderCancellationEmail(
  _order: OrderForEmail,
): Promise<SendResult> {
  return { ok: false, error: "Email service disabled (Resend removed)" };
}

export async function sendCustomizationConfirmationEmail(
  _requestId: string,
  _userEmail: string,
  _garment: string,
): Promise<SendResult> {
  return { ok: false, error: "Email service disabled (Resend removed)" };
}

export async function sendCustomizationAdminNotifyEmail(
  _requestId: string,
  _garment: string,
  _occasion: string | null,
  _budgetTier: string | null,
  _userEmail: string,
): Promise<SendResult> {
  return { ok: false, error: "Email service disabled (Resend removed)" };
}

export async function sendCustomizationStatusUpdateEmail(
  _requestId: string,
  _userEmail: string,
  _garment: string,
  _newStatus: string,
): Promise<SendResult> {
  return { ok: false, error: "Email service disabled (Resend removed)" };
}