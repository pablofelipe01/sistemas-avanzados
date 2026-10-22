"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clear: () => void;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
     const [items, setItems] = useState<CartItem[]>([]);
   const [loaded, setLoaded] = useState(false);

   useEffect(() => {
     const saved = localStorage.getItem("cart");
     if (saved) setItems(JSON.parse(saved));
     setLoaded(true);
   }, []);

   useEffect(() => {
     if (loaded) localStorage.setItem("cart", JSON.stringify(items));
   }, [items, loaded]);

  function addItem(product: Product, quantity: number) {
    setItems([...items, { product, quantity }]);
  }

  function removeItem(id: number) {
    setItems(items.filter((item) => item.product.id === id));
  }

  function updateQuantity(id: number, quantity: number) {
    setItems(
      items.map((item) =>
        item.product.id === id ? { ...item, quantity } : item
      )
    );
  }

  function clear() {
    setItems([]);
  }

  const count = items.length;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
