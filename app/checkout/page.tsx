"use client";
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleCOD = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/cod-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, email }),
            });
            const data = await res.json();
            if (data.success) {
                clearCart();
                setSuccess(true);
            } else {
                setError(data.error || 'Order failed');
            }
        } catch (err) {
            setError('Order failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="max-w-xl mx-auto py-8 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Order Placed!</h1>
                <p className="mb-4">Thank you for your order. We will contact you soon for delivery and payment.</p>
                <a href="/" className="text-blue-600 hover:underline">Back to Home</a>
            </main>
        );
    }

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
                onClick={handleCOD}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={loading || !email || cart.length === 0}
            >
                {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
            </button>
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </main>
    );
} 