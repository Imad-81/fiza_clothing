export const DELIVERY_FEE = 50;

export interface CheckoutItem {
  price: number;
  quantity: number;
}

export interface OrderTotals {
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export function calculateTotals(items: CheckoutItem[]): OrderTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = items.length === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  return { subtotal, deliveryFee, total };
}

export interface AddressInput {
  fullName?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export function validateAddress(address: AddressInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!address.fullName || address.fullName.trim().length < 2) {
    errors.fullName = "Full name is required";
  }
  if (!address.phone || !/^[6-9]\d{9}$/.test(address.phone.trim())) {
    errors.phone = "Enter a valid 10-digit phone number";
  }
  if (!address.line1 || address.line1.trim().length < 5) {
    errors.line1 = "Address line is required";
  }
  if (!address.city || address.city.trim().length < 2) {
    errors.city = "City is required";
  }
  if (!address.state || address.state.trim().length < 2) {
    errors.state = "State is required";
  }
  if (!address.pincode || !/^\d{6}$/.test(address.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode";
  }

  return errors;
}

