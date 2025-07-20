"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CartItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    size?: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (_id: string, size?: string) => void;
    updateQuantity: (_id: string, quantity: number, size?: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('cart');
        if (stored) setCart(JSON.parse(stored));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const existing = prev.find(
                (i) => i._id === item._id && i.size === item.size
            );
            if (existing) {
                return prev.map((i) =>
                    i._id === item._id && i.size === item.size
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (_id: string, size?: string) => {
        setCart((prev) => prev.filter((i) => i._id !== _id || i.size !== size));
    };

    const updateQuantity = (_id: string, quantity: number, size?: string) => {
        setCart((prev) =>
            prev.map((i) =>
                i._id === _id && i.size === size ? { ...i, quantity } : i
            )
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
} 