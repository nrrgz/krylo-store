export const TAX_RATE = 0.1;

export const calculateTax = (subtotal: number): number => subtotal * TAX_RATE;
