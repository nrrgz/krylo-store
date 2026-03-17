import type { CartItem } from '../../types';

type CreateCheckoutSessionInput = {
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    address: string;
  };
};

type VerifyCheckoutSessionInput = {
  sessionId: string;
};

type ApiErrorPayload = {
  message?: string;
};

const parseApiError = async (response: Response): Promise<string> => {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    return payload.message || 'Payment request failed.';
  } catch {
    return 'Payment request failed.';
  }
};

export const createCheckoutSession = async (input: CreateCheckoutSessionInput): Promise<{ checkoutUrl: string }> => {
  const response = await fetch('/api/payment/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: input.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        selectedColor: { name: item.selectedColor.name },
      })),
      customer: input.customer,
      origin: window.location.origin,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as { checkoutUrl: string };
};

export const verifyCheckoutSession = async (
  input: VerifyCheckoutSessionInput,
): Promise<{ paid: boolean; customer?: { name: string; email: string; address: string } }> => {
  const response = await fetch('/api/payment/verify-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as {
    paid: boolean;
    customer?: { name: string; email: string; address: string };
  };
};
