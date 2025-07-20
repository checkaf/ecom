"use client";
import { useEffect, useState } from 'react';

interface Order {
    _id: string;
    email: string;
    total: number;
    createdAt: string;
    items: { name: string; size?: string; quantity: number; price: number }[];
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            });
    }, []);

    return (
        <main className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-4">All Orders</h1>
            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {orders.map(order => (
                        <div key={order._id} className="border rounded p-4">
                            <div className="mb-2 text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                            <div className="mb-2 font-semibold">User: {order.email}</div>
                            <div className="mb-2 font-semibold">Total: ${order.total.toFixed(2)}</div>
                            <ul className="text-sm list-disc ml-5">
                                {order.items.map((item, idx) => (
                                    <li key={idx}>{item.name}{item.size ? ` (${item.size})` : ''} x{item.quantity} - ${item.price.toFixed(2)}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
} 