export const simulateDelay = async (minMs = 200, maxMs = 400): Promise<void> => {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export const maybeThrowError = (rate = 0): void => {
  if (rate > 0 && Math.random() < rate) {
    throw new Error('An unexpected error occurred. Please try again.');
  }
};
