// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Readable } from 'node:stream';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { createPaymentApiMiddleware } from './paymentApiPlugin';

type MockResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  setHeader: (name: string, value: string) => void;
  end: (payload?: string) => void;
};

const createRequest = (method: string, url: string, body: unknown): IncomingMessage => {
  const raw = JSON.stringify(body);
  const stream = Readable.from([raw]) as IncomingMessage & Readable;
  stream.method = method;
  stream.url = url;
  return stream as IncomingMessage;
};

const createResponse = (): ServerResponse & MockResponse => {
  const res = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: '',
    setHeader(name: string, value: string) {
      this.headers[name] = value;
    },
    end(payload?: string) {
      this.body = payload || '';
    },
  };

  return res as ServerResponse & MockResponse;
};

describe('paymentApi middleware', () => {
  beforeEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
  });

  it('returns 400 for create-checkout-session with empty items', async () => {
    const req = createRequest('POST', '/api/payment/create-checkout-session', {
      items: [],
      customer: { name: 'A', email: 'a@example.com', address: 'x' },
      origin: 'http://localhost:5173',
    });
    const res = createResponse();
    const next = vi.fn();

    await createPaymentApiMiddleware(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body)).toEqual({
      message: 'Cannot create checkout session for an empty cart.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('creates demo checkout session when stripe key is absent', async () => {
    const req = createRequest('POST', '/api/payment/create-checkout-session', {
      items: [{ productId: 'p_kb_1', quantity: 1, selectedColor: { name: 'Obsidian Black' } }],
      customer: { name: 'A', email: 'a@example.com', address: 'x' },
      origin: 'http://localhost:5173',
    });
    const res = createResponse();

    await createPaymentApiMiddleware(req, res, vi.fn());

    const payload = JSON.parse(res.body) as { checkoutUrl: string; sessionId: string; mode: string };
    expect(res.statusCode).toBe(200);
    expect(payload.mode).toBe('demo');
    expect(payload.sessionId).toContain('demo_');
    expect(payload.checkoutUrl).toContain('/checkout?payment=success&session_id=');
  });

  it('returns 404 when verifying unknown demo session', async () => {
    const req = createRequest('POST', '/api/payment/verify-session', {
      sessionId: 'demo_missing_123',
    });
    const res = createResponse();

    await createPaymentApiMiddleware(req, res, vi.fn());

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res.body)).toEqual({
      message: 'Demo payment session not found.',
    });
  });
});
