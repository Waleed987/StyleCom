import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ArrowLeft, CreditCard, Truck, CheckCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { demoMode } from "../catalog";
import { useAuth } from "../context/AuthContext";

function Checkout() {
  const navigate = useNavigate();
  const { items: cartItems, getCartTotal, clearCart } = useCart();
  const { token, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    paymentMethod: "cod"
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (demoMode) {
      setError('This is a demo checkout. Sample products cannot be ordered.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        setError("Please login to continue");
        setLoading(false);
        return;
      }

      const userId = user?.userId;

      if (!userId) {
        setError("User information not found");
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        userId: userId,
        shippingAddress: {
          street: formData.street
        },
        paymentMethod: formData.paymentMethod
      };

      // Create order
      const response = await api.post(
        "/api/order/checkout",
        orderData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setOrderSuccess(true);
        setOrderId(response.data.order._id);
        clearCart(); // Clear cart after successful order
      }

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.response?.data?.message || "Something went wrong during checkout");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4">Your order has been confirmed and is being processed.</p>
          <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-black text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              View Order Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/cart')}
              className="p-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-black" />
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              {demoMode && (
                <p className="mb-6 rounded-md bg-amber-50 p-4 text-sm text-amber-900">
                  Demo checkout: explore your order summary. No order or payment will be submitted.
                </p>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>





                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="cod">Cash on Delivery</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                  </select>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || demoMode}
                  className="w-full bg-black text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {demoMode ? "Demo only — ordering unavailable" : loading ? "Processing..." : "Place Order"}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex items-center space-x-3">
                    <img 
                      src={item.imageUrl} 
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

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

              {/* Shipping Info */}
              <div className="pt-6 border-t border-gray-200">
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
      </div>
    </div>
  );
}

export default Checkout;
