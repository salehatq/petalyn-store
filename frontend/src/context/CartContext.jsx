import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'petalyn_cart';

function loadCart() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* storage may be unavailable */ }
  }, [cart]);

  const value = useMemo(() => ({
    cart,
    count: cart.reduce((sum, item) => sum + item.quantity, 0),
    total: cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    add(item) {
      setCart(current => current.some(x => x._id === item._id)
        ? current.map(x => x._id === item._id ? { ...x, quantity: Math.min(x.quantity + 1, 99) } : x)
        : [...current, { ...item, quantity: 1 }]);
    },
    update(id, quantity) {
      const next = Math.floor(Number(quantity));
      setCart(current => next < 1
        ? current.filter(item => item._id !== id)
        : current.map(item => item._id === id ? { ...item, quantity: Math.min(next, 99) } : item));
    },
    remove(id) {
      setCart(current => current.filter(item => item._id !== id));
    },
    clear() {
      setCart([]);
    }
  }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
