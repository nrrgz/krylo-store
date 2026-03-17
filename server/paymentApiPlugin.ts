import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import { products } from '../src/data/products';

type CheckoutItemPayload = {
  productId: string;
  quantity: number;
  selectedColor?: {
    name: string;
  };
};

type CreateCheckoutPayload = {
  items: CheckoutItemPayload[];
  customer: {
    name: string;
    email: string;
    address: string;
  };
  origin?: string;
};

type VerifyCheckoutPayload = {
  sessionId: string;
};

type StoredDemoSession = {
  paid: boolean;
  customer: {
    name: string;
    email: string;
    address: string;
  };
};

const demoSessions = new Map<string, StoredDemoSession>();

const json = (res: ServerResponse, statusCode: number, payload: unknown): void => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const readJsonBody = async <T>(req: IncomingMessage): Promise<T> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(raw) as T;
};

const buildLineItems = (items: CheckoutItemPayload[]) => {
  return items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }

    return {
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          description: item.selectedColor?.name
            ? `Selected color: ${item.selectedColor.name}`
            : undefined,
        },
      },
      quantity: Math.max(1, item.quantity),
    };
  });
};

const createDemoSession = (payload: CreateCheckoutPayload, origin: string) => {
  const sessionId = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  demoSessions.set(sessionId, {
    paid: true,
    customer: payload.customer,
  });

  return {
    sessionId,
    checkoutUrl: `${origin}/checkout?payment=success&session_id=${sessionId}`,
  };
};

const handleCreateCheckoutSession = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  const payload = await readJsonBody<CreateCheckoutPayload>(req);
  const origin = payload.origin || 'http://localhost:5173';
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!payload.items?.length) {
    json(res, 400, { message: 'Cannot create checkout session for an empty cart.' });
    return;
  }

  if (!payload.customer?.name || !payload.customer?.email || !payload.customer?.address) {
    json(res, 400, { message: 'Customer information is required.' });
    return;
  }

  if (!stripeSecretKey) {
    const demo = createDemoSession(payload, origin);
    json(res, 200, {
      ...demo,
      mode: 'demo',
    });
    return;
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(stripeSecretKey);
  const lineItems = buildLineItems(payload.items);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: `${origin}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?payment=canceled`,
    metadata: {
      customerName: payload.customer.name,
      customerEmail: payload.customer.email,
      customerAddress: payload.customer.address,
    },
  });

  if (!session.url) {
    json(res, 500, { message: 'Stripe did not return a checkout URL.' });
    return;
  }

  json(res, 200, {
    sessionId: session.id,
    checkoutUrl: session.url,
    mode: 'stripe',
  });
};

const handleVerifySession = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const payload = await readJsonBody<VerifyCheckoutPayload>(req);
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!payload.sessionId) {
    json(res, 400, { message: 'sessionId is required.' });
    return;
  }

  if (!stripeSecretKey) {
    const demoSession = demoSessions.get(payload.sessionId);
    if (!demoSession) {
      json(res, 404, { message: 'Demo payment session not found.' });
      return;
    }

    json(res, 200, {
      paid: demoSession.paid,
      mode: 'demo',
      customer: demoSession.customer,
    });
    return;
  }

  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(stripeSecretKey);
  const session = await stripe.checkout.sessions.retrieve(payload.sessionId);

  const paid = session.payment_status === 'paid' || session.status === 'complete';

  json(res, 200, {
    paid,
    mode: 'stripe',
    customer: {
      name: session.metadata?.customerName || '',
      email: session.metadata?.customerEmail || '',
      address: session.metadata?.customerAddress || '',
    },
    amountTotal: session.amount_total,
    currency: session.currency,
  });
};

const paymentApiMiddleware = async (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): Promise<void> => {
  const url = req.url || '';

  if (req.method === 'POST' && url.startsWith('/api/payment/create-checkout-session')) {
    try {
      await handleCreateCheckoutSession(req, res);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create checkout session.';
      json(res, 500, { message });
    }
    return;
  }

  if (req.method === 'POST' && url.startsWith('/api/payment/verify-session')) {
    try {
      await handleVerifySession(req, res);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify checkout session.';
      json(res, 500, { message });
    }
    return;
  }

  next();
};

export const paymentApiPlugin = (): Plugin => ({
  name: 'payment-api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      void paymentApiMiddleware(req, res, next);
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      void paymentApiMiddleware(req, res, next);
    });
  },
});
