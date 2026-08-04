'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { getToken } from '@/lib/auth';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [promotion, setPromotion] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const saved = localStorage.getItem('ntd_cart');
      if (saved) {
        try {
          setCartItems(JSON.parse(saved));
        } catch (e) {}
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('ntd_cart');
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      localStorage.setItem('ntd_cart', JSON.stringify(cartItems));
    } else if (cartItems.length > 0) {
      setCartItems([]);
      localStorage.removeItem('ntd_cart');
    }
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    const token = getToken();
    if (!token) {
      alert('VUI LÒNG ĐĂNG NHẬP!\nBạn cần đăng nhập tài khoản khách hàng trước khi thêm sản phẩm vào giỏ hàng hoặc mua sắm.');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return false;
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, variant, quantity }];
      }
    });

    return true;
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, delta) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) return prev;
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setPromotion(null);
    setDiscountAmount(0);
    localStorage.removeItem('ntd_cart');
  };

  const token = typeof window !== 'undefined' ? getToken() : null;
  const activeCartItems = token ? cartItems : [];

  const cartSubtotal = activeCartItems.reduce((acc, item) => {
    const price = item.variant?.price || item.product.price || 1500000;
    return acc + price * item.quantity;
  }, 0);

  const applyCouponCode = async (code) => {
    const subtotal = cartSubtotal;
    const productIds = activeCartItems.map((item) => item.product.id);

    try {
      const res = await fetchApi('/public/promotions/apply', {
        method: 'POST',
        body: JSON.stringify({
          code,
          productIds,
          orderSubtotal: subtotal,
        }),
      });

      if (res.data && res.data.valid) {
        setPromotion(res.data);
        setDiscountAmount(res.data.calculatedDiscountAmount || 0);
        return { success: true, message: res.data.message };
      } else {
        throw new Error(res.message || 'Mã ưu đãi không hợp lệ.');
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const cartCount = activeCartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cartItems: activeCartItems,
        cartCount,
        cartSubtotal,
        discountAmount,
        cartTotal,
        promotion,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCouponCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
