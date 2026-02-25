import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCartItems, selectCartSubtotal, updateQty, removeItem, clearCart } from '../features/cart/cartSlice';

export function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);

  const handleUpdateQuantity = (productId: string, colorName: string, currentQty: number, delta: number) => {
    dispatch(updateQty({ productId, selectedColor: colorName, quantity: currentQty + delta }));
  };

  const handleRemoveItem = (productId: string, colorName: string) => {
    dispatch(removeItem({ productId, selectedColor: colorName }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const tax = subtotal * 0.08; // Mock 8% tax
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="container-base py-24 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Let's find some premium gear for your setup.
        </p>
        <Link to="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-base py-12">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.selectedColor.name}`}
              className="flex flex-col sm:flex-row gap-6 p-4 border border-[var(--border)] rounded-xl bg-[var(--surface)] shadow-sm"
            >
              {/* Product Image Placeholder */}
              <div className="w-full sm:w-32 h-32 bg-[var(--surface-2)] rounded-lg flex-shrink-0 flex items-center justify-center text-xs text-gray-400 font-medium overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  'Image'
                )}
              </div>

              {/* Product Details & Controls */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link to={`/products/${item.productId}`} className="font-bold text-gray-900 hover:underline text-lg leading-tight block mb-1">
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span
                        className="w-3 h-3 rounded-full border border-[var(--border)]"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      {item.selectedColor.name}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 sm:mt-0">
                  <div className="flex items-center border border-[var(--border)] rounded-md bg-[var(--surface)]">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.selectedColor.name, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[var(--primary)] transition-colors disabled:opacity-50"
                    >
                      &minus;
                    </button>
                    <div className="w-10 h-8 flex items-center justify-center font-semibold text-gray-900 text-sm">
                      {item.quantity}
                    </div>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.selectedColor.name, item.quantity, 1)}
                      disabled={item.quantity >= 99}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[var(--primary)] transition-colors disabled:opacity-50"
                    >
                      &#43;
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.productId, item.selectedColor.name)}
                    className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24 bg-[var(--surface)] border-[var(--border)] shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 pb-4 border-b border-gray-200">
                <span>Estimated Tax</span>
                <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-gray-900 py-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="w-full mt-2">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-xs text-center text-gray-500 mt-2">
                Shipping & taxes calculated at checkout.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
