import { notFound } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    sizes: string[];
    category?: string;
}

async function getProduct(id: string): Promise<Product | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products/${id}`, {
        cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);
    if (!product) return notFound();

    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity,
        });
        alert('Added to cart!');
    };

    return (
        <main className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row gap-8">
                <img src={product.image} alt={product.name} className="w-64 h-64 object-cover rounded" />
                <div>
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
                    {product.sizes.length > 0 && (
                        <div className="mb-4">
                            <span className="font-semibold">Sizes: </span>
                            <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="ml-2 border rounded px-2 py-1">
                                {product.sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="mb-4">
                        <span className="font-semibold">Quantity: </span>
                        <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-16 border rounded px-2 py-1 ml-2" />
                    </div>
                    <button onClick={handleAddToCart} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add to Cart</button>
                </div>
            </div>
        </main>
    );
} 