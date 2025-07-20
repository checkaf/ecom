"use client";
import { useState, useEffect } from 'react';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    sizes: string[];
    category?: string;
}

const ADMIN_PASSWORD = "admin123"; // Change this to a secure value in production

export default function AdminPage() {
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Partial<Product>>({ sizes: [] });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        if (authed) fetchProducts();
    }, [authed]);

    const fetchProducts = async () => {
        setLoading(true);
        const res = await fetch("/api/products");
        setProducts(await res.json());
        setLoading(false);
    };

    const handleLogin = (e: any) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) setAuthed(true);
        else alert("Wrong password");
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSizes = (e: any) => {
        setForm((f) => ({ ...f, sizes: e.target.value.split(",") }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (editingId) {
            await fetch(`/api/products/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
        } else {
            await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
        }
        setForm({ sizes: [] });
        setEditingId(null);
        fetchProducts();
    };

    const handleEdit = (product: Product) => {
        setForm(product);
        setEditingId(product._id);
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        fetchProducts();
    };

    if (!authed) {
        return (
            <main className="max-w-md mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="password"
                        placeholder="Admin password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
                </form>
            </main>
        );
    }

    return (
        <main className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-2">
                <input name="name" placeholder="Name" value={form.name || ''} onChange={handleChange} className="border rounded px-2 py-1" required />
                <input name="description" placeholder="Description" value={form.description || ''} onChange={handleChange} className="border rounded px-2 py-1" required />
                <input name="price" type="number" placeholder="Price" value={form.price || ''} onChange={handleChange} className="border rounded px-2 py-1" required />
                <input name="image" placeholder="Image URL" value={form.image || ''} onChange={handleChange} className="border rounded px-2 py-1" required />
                <input name="sizes" placeholder="Sizes (comma separated)" value={form.sizes?.join(',') || ''} onChange={handleSizes} className="border rounded px-2 py-1" />
                <input name="category" placeholder="Category" value={form.category || ''} onChange={handleChange} className="border rounded px-2 py-1" />
                <button className="bg-green-600 text-white px-4 py-2 rounded mt-2">{editingId ? 'Update' : 'Add'} Product</button>
                {editingId && <button type="button" onClick={() => { setForm({ sizes: [] }); setEditingId(null); }} className="text-sm text-gray-600 mt-1">Cancel Edit</button>}
            </form>
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            {loading ? <p>Loading...</p> : (
                <div className="flex flex-col gap-4">
                    {products.map(product => (
                        <div key={product._id} className="border rounded p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                            <div className="flex-1">
                                <div className="font-semibold">{product.name}</div>
                                <div className="text-sm text-gray-500">${product.price}</div>
                                <div className="text-sm text-gray-500">Sizes: {product.sizes.join(', ')}</div>
                                <div className="text-sm text-gray-500">{product.category}</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                                <button onClick={() => handleDelete(product._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
} 