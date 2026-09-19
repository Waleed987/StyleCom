import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { demoMode } from '../catalog';

const cartStorageKey = demoMode ? 'demo-cart' : 'cart';

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(cartStorageKey));
    if (Array.isArray(saved?.items)) {
      return { items: saved.items.filter(item =>
        item && typeof item.productId === 'string' && typeof item.size === 'string' &&
        Number.isFinite(item.price) && item.price >= 0 &&
        Number.isInteger(item.quantity) && item.quantity > 0
      ) };
    }
  } catch {
    // Invalid or unavailable browser storage should not prevent shopping.
  }
  return { items: [] };
}

const CartContext = createContext();

// Cart reducer to manage cart state
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId && item.size === action.payload.size
      );
      
      if (existingItemIndex >= 0) {
        // If item with same product and size exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems };
      } else {
        // Add new item to cart
        return { ...state, items: [...state.items, action.payload] };
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item =>
          !(item.productId === action.payload.productId && item.size === action.payload.size)
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    default:
      return state;
  }
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, undefined, loadCart);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(cartStorageKey, JSON.stringify(cartState));
    } catch {
      // Shopping still works when storage is unavailable.
    }
  }, [cartState]);

  // Add item to cart
  const addToCart = (product, size, quantity) => {
    const cartItem = {
      productId: product._id,
      productName: product.productName,
      price: product.price,
      imageUrl: product.imageUrl,
      gender: product.gender,
      subcategory: product.subcategory,
      size: size,
      quantity: quantity
    };
    
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  // Update item quantity
  const updateQuantity = (productId, size, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, quantity } });
  };

  // Remove item from cart
  const removeFromCart = (productId, size) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId, size } });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Get cart total
  const getCartTotal = () => {
    return cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cartState.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items: cartState.items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
