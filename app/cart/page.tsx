"use client";
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const [total, setTotal] = useState(0);
    const router = useRouter();

    useEffect(() => {
        setTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    }, [cart]);

    if (cart.length === 0) {
        return (
            <main className="max-w-2xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                <p>Your cart is empty.</p>
                <Link href="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
            </main>
        );
    }

    return (
        <main className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            <div className="flex flex-col gap-6">
                {cart.map((item, idx) => (
                    <div key={item._id + (item.size || '')} className="flex gap-4 items-center border-b pb-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                            <h2 className="font-semibold">{item.name}</h2>
                            {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <label htmlFor={`qty-${idx}`}>Qty:</label>
                                <input
                                    id={`qty-${idx}`}
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={e => updateQuantity(item._id, Number(e.target.value), item.size)}
                                    className="w-16 border rounded px-2 py-1"
                                />
                                <button
                                    onClick={() => removeFromCart(item._id, item.size)}
                                    className="ml-4 text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-between items-center">
                <span className="font-bold text-lg">Total: ${total.toFixed(2)}</span>
                <button
                    onClick={() => router.push('/checkout')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Checkout
                </button>
            </div>
        </main>
    );
} 