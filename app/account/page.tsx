"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Order {
    _id: string;
    total: number;
    createdAt: string;
    items: { name: string; size?: string; quantity: number; price: number }[];
}

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (status === 'authenticated' && session?.user?.email) {
            fetch(`/api/orders?email=${encodeURIComponent(session.user.email)}`)
                .then(res => res.json())
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                });
        }
    }, [status, session, router]);

    if (status === 'loading') return <p className="text-center mt-16">Loading...</p>;

    return (
        <main className="max-w-xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-4">Account</h1>
            <div className="mb-6">
                <p><span className="font-semibold">Name:</span> {session?.user?.name}</p>
                <p><span className="font-semibold">Email:</span> {session?.user?.email}</p>
            </div>
            <h2 className="text-xl font-semibold mb-2">Order History</h2>
            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="flex flex-col gap-6">
                    {orders.map(order => (
                        <div key={order._id} className="border rounded p-4">
                            <div className="mb-2 text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
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