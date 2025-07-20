"use client";
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheckout = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, email }),
            });
            const data = await res.json();
            if (data.url) {
                clearCart();
                window.location.href = data.url;
            } else {
                setError(data.error || 'Checkout failed');
            }
        } catch (err) {
            setError('Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <div className="mb-4">
                <label className="block mb-2 font-semibold">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <button
                onClick={handleCheckout}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={loading || !email || cart.length === 0}
            >
                {loading ? 'Redirecting...' : 'Proceed to Payment'}
            </button>
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </main>
    );
} 