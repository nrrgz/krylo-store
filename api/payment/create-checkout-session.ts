import { products } from '../../src/data/products';

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

type RequestLike = {
  method?: string;
  body?: unknown;
  [Symbol.asyncIterator]?: () => AsyncIterator<unknown>;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (payload: unknown) => void;
};

const parseBody = (rawBody: unknown): Partial<CreateCheckoutPayload> => {
  if (!rawBody) return {};
  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody) as Partial<CreateCheckoutPayload>;
    } catch {
      return {};
    }
  }
  if (typeof rawBody === 'object') {
    return rawBody as Partial<CreateCheckoutPayload>;
  }
  return {};
};

const readBodyFromStream = async (req: RequestLike): Promise<unknown> => {
  if (!req[Symbol.asyncIterator]) return undefined;

  const chunks: string[] = [];
  for await (const chunk of req as AsyncIterable<unknown>) {
    if (typeof chunk === 'string') {
      chunks.push(chunk);
    } else if (chunk instanceof Uint8Array) {
      chunks.push(Buffer.from(chunk).toString('utf8'));
    }
  }

  if (chunks.length === 0) return undefined;
  return chunks.join('');
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

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const rawBody = req.body ?? (await readBodyFromStream(req));
  const payload = parseBody(rawBody);
  const origin = payload.origin || 'http://localhost:5173';
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!payload.items?.length) {
    res.status(400).json({ message: 'Cannot create checkout session for an empty cart.' });
    return;
  }

  if (!payload.customer?.name || !payload.customer?.email || !payload.customer?.address) {
    res.status(400).json({ message: 'Customer information is required.' });
    return;
  }

  if (!stripeSecretKey) {
    const sessionId = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    res.status(200).json({
      sessionId,
      checkoutUrl: `${origin}/checkout?payment=success&session_id=${sessionId}`,
      mode: 'demo',
    });
    return;
  }

  try {
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
      res.status(500).json({ message: 'Stripe did not return a checkout URL.' });
      return;
    }

    res.status(200).json({
      sessionId: session.id,
      checkoutUrl: session.url,
      mode: 'stripe',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create checkout session.';
    res.status(500).json({ message });
  }
}
