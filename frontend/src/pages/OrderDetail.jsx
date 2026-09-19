import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!token || !user) {
          setError("Please login to view order details");
          setLoading(false);
          return;
        }

        const response = await api.get(
          `/api/order/${orderId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error.response?.data?.message || "Error fetching order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, token, user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <Package className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'shipped':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/home')} 
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <button 
            onClick={() => navigate('/home')} 
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Go Home
          </button>
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
              onClick={() => navigate('/home')}
              className="p-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-black" />
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <span className="text-sm text-gray-500">#{order._id.slice(-8)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize font-medium">{order.status}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order Date:</span>
                  <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Payment Method:</span>
                  <p className="font-medium capitalize">{order.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-gray-600">Payment Status:</span>
                  <p className="font-medium capitalize">{order.paymentStatus}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                    <img 
                      src={item.productId.imageUrl} 
                      alt={item.productId.productName}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productId.productName}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

                           {/* Shipping Address */}
               {order.shippingAddress && (
                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                   <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                   <div className="text-gray-700">
                     <p>{order.shippingAddress.street}</p>
                   </div>
                 </div>
               )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({order.items.reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span>Rs. {order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>Rs. {order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/home')}
                  className="w-full bg-black text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-800 transition-colors duration-200"
                >
                  Continue Shopping
                </button>
                
                {order.status === 'pending' && (
                  <button
                    onClick={() => {
                      // Implement cancel order functionality
                      if (confirm('Are you sure you want to cancel this order?')) {
                        // Call cancel order API
                        console.log('Cancel order:', order._id);
                      }
                    }}
                    className="w-full border border-red-300 text-red-700 py-3 px-6 rounded-md font-medium hover:bg-red-50 transition-colors duration-200"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
