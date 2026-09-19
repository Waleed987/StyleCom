import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useAsyncValue } from "react-router-dom";
import { Search, Heart, Handbag, User, AlignJustify, ArrowLeft, Star } from "lucide-react";
import { getInventory } from "../catalog";
import { useCart } from "../context/CartContext";


function Navbar() {
    const [showDiv, setShowDiv] = useState(true);
    const navigate = useNavigate();
    const { getCartItemCount } = useCart();
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 1200) {
          setShowDiv(false);
        } else {
          setShowDiv(true);
        }
      };
  
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    const cartClick = ()=>{
      navigate('/cart');
    }

    return (
      <>
      {showDiv &&
      <nav className='group w-screen border items-center border-b-2 transition-color duration-200 bg-white'>
        <div className='bg-transparent space-x-4 h-12 w-screen py-3 px-4 flex justify-end'>
          <svg role="img" className='transition-color duration-300  fill-black  h-5 w-5' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>
          <svg role="img" className='fill-black  h-5 w-5 '  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>TikTok</title><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          <a className='transition-transform duration-300  text-black  px-4 cursor-pointer hover:underline underline-offset-4 border-r'>Enclave Awards</a>
          <a className='transition-transform duration-300  text-black  px-4 cursor-pointer hover:underline underline-offset-4 mr-4'>Pakistan <img 
          src="https://flagcdn.com/w320/pk.png" 
          alt="Pakistan Flag" 
          className="ml-1 inline-block w-8 h-5" 
        ></img></a>
        </div>
        
        <div className="text-black transition-colors duration-300 h-13 flex justify-center items-center text-4xl font-bold  pb-5">
        RASTAH
        </div>
    
        <div className='px-8  h-13 w-screen flex flex-row pb-4 '>
          <div className='pt-2 w-[20%]'>
             <Search className='w-7 h-7 text-black '/>
          </div>
          <div className='text-black flex flex-row justify-center items-center space-x-7 text-[18px]  min-w-[60%]'>
          <button className='bg-black text-xl px-4 text-white border w-20 rounded-[20px] '>SALE</button>
          <select className='cursor-pointer'><option>SUMMER 2025</option></select>
          <select className='transition-transform duration-300  text-black  px-4 cursor-pointer hover:underline underline-offset-4 mr-4'><option>SPRING 2025</option></select>
          <select
            className="transition-transform duration-300 text-black  px-4 cursor-pointer hover:underline underline-offset-4 mr-4"
            onChange={(e) => {
              if (e.target.value) {
                window.location.href = e.target.value;
                e.target.selectedIndex = 0;
              }
            }}
          >
            <option value="">SHOP</option>
            <option value="/all">ALL</option>
            <option value="/mens">MEN</option>
            <option value="/womens">WOMEN</option>
          </select>
          <select className='transition-transform duration-300  text-black  px-4 cursor-pointer hover:underline underline-offset-4 mr-4'><option>CORE COLLECTION</option></select>
          <select className='transition-transform duration-300  text-black  px-4 cursor-pointer hover:underline underline-offset-4 mr-4 '><option >ABOUT RASTAH</option></select>
          </div>
  
          <div className='ml-40 flex flex-row pt-2 space-x-4'>
            <Heart className='text-black h-6 w-6 '/>
            <div className="relative">
              <Handbag onClick={cartClick} className='text-black  h-6 w-6 cursor-pointer'/>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </div>
            <User className='text-black  h-6 w-6'/>
          </div>
        </div>
      </nav>
      }
      {!showDiv &&
      <nav className='group h-20 w-screen flex flex-row justify-between items-center transform-color  px-4 border-b '>
          <div className='h-full w-20 flex justify-center items-center pb-3'>
            <AlignJustify/>
          </div>
          <div className="h-full w-50  text-black transition-colors duration-300 flex justify-center items-center text-4xl font-bold  pb-5">
          RASTAH
          </div>
          <div className='flex flex-row pt-2 space-x-4 pb-6 '>
            <Heart className='group-hover:text-black h-6 w-6 '/>
            <div className="relative">
              <Handbag onClick={cartClick} className='group-hover:text-black  h-6 w-6 cursor-pointer'/>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </div>
            <User className='group-hover:text-black  h-6 w-6'/>
          </div>
      </nav>
      }
      </>
    );
}

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const inventoryItems = await getInventory();
        const foundProduct = inventoryItems.find(item => item._id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // If product not found, redirect to all collection
          navigate('/all');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate('/all');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    // Add item to cart using context
    addToCart(product, selectedSize, quantity);
    
    // Show success message
    alert(`Added ${quantity} ${product.productName} (${selectedSize}) to cart`);
    
    // Reset form
    setSelectedSize('');
    setQuantity(1);
  };

  const handleBackToCollection = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="text-2xl">Product not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="h-auto w-screen flex flex-col items-center">
        <Navbar/>
        
        {/* Back Button */}
        <div className="w-full px-8 py-4">
          <button 
            onClick={handleBackToCollection}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Collection</span>
          </button>
        </div>

        {/* Product Details */}
        <div className="w-full max-w-7xl px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square w-full overflow-hidden rounded-lg">
                <img 
                  src={product.imageUrl || "/hero.webp"} 
                  alt={product.productName} 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.productName}
                </h1>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600">(24 reviews)</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  Rs. {product.price?.toLocaleString() || "120,3907"}
                </p>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Category:</span>
                      <span className="ml-2 text-gray-900">{product.subcategory}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Gender:</span>
                      <span className="ml-2 text-gray-900 capitalize">{product.gender}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Availability:</span>
                      <span className={`ml-2 ${product.availability && product.availability.toLowerCase() === 'in-stock' ? 'text-green-600' : 'text-red-600'}`}>
                        {product.availability || 'Out of Stock'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Size:</span>
                      <span className="ml-2 text-gray-900">{product.size}</span>
                    </div>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Select Size</h3>
                  <div className="flex space-x-3">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-16 text-center text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="border-t pt-6">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !product.availability || product.availability.toLowerCase() !== 'in-stock'}
                    className="w-full bg-black text-white py-4 px-6 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {product.availability && product.availability.toLowerCase() === 'in-stock' ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>


                {/* Additional Info */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Heart className="w-5 h-5" />
                    <span>Add to Wishlist</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Free shipping on orders over Rs. 5000</p>
                    <p>30-day return policy</p>
                    <p>Secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
