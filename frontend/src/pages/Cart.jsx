import { useNavigate } from "react-router-dom";
import CartItem from "../components/Cartitem";
import { ArrowLeft, ShoppingBag, CreditCard, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { demoMode } from "../catalog";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items: cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemCount } = useCart();
  const handleUpdateQuantity = (productId, size, newQuantity) => {
    updateQuantity(productId, size, newQuantity);
  };

  const handleRemoveItem = (productId, size) => {
    removeFromCart(productId, size);
  };

  const calculateSubtotal = () => {
    return getCartTotal();
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 5000 ? 0 : 500;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = () => {
    if (demoMode) {
      navigate('/checkout');
      return;
    }
    // Check if user is logged in
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/all');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-8 h-8 text-black" />
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              {getCartItemCount() > 0 && (
                <span className="bg-black text-white text-sm px-3 py-1 rounded-full">
                  {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <button
              onClick={handleContinueShopping}
              className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={`${item.productId}-${item.size}`}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                    <span>Rs. {calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{calculateShipping() === 0 ? 'Free' : `Rs. ${calculateShipping().toLocaleString()}`}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>Rs. {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 mb-4"
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={handleContinueShopping}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Continue Shopping
                </button>

                {/* Shipping Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                    <Truck className="w-4 h-4" />
                    <span>Free shipping on orders over Rs. 5,000</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>Secure checkout with multiple payment options</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
