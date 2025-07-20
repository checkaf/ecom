import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await connectToDatabase();
    const product = await Product.findById(params.id);
    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await connectToDatabase();
    const data = await req.json();
    const product = await Product.findByIdAndUpdate(params.id, data, { new: true });
    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await connectToDatabase();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
} 