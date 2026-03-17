type VerifyCheckoutPayload = {
  sessionId: string;
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

const parseBody = (rawBody: unknown): Partial<VerifyCheckoutPayload> => {
  if (!rawBody) return {};
  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody) as Partial<VerifyCheckoutPayload>;
    } catch {
      return {};
    }
  }
  if (typeof rawBody === 'object') {
    return rawBody as Partial<VerifyCheckoutPayload>;
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

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const rawBody = req.body ?? (await readBodyFromStream(req));
  const payload = parseBody(rawBody);
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!payload.sessionId) {
    res.status(400).json({ message: 'sessionId is required.' });
    return;
  }

  if (!stripeSecretKey) {
    if (!payload.sessionId.startsWith('demo_')) {
      res.status(404).json({ message: 'Demo payment session not found.' });
      return;
    }

    res.status(200).json({
      paid: true,
      mode: 'demo',
    });
    return;
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(payload.sessionId);
    const paid = session.payment_status === 'paid' || session.status === 'complete';

    res.status(200).json({
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify checkout session.';
    res.status(500).json({ message });
  }
}
