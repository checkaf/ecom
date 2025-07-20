import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    let orders;
    if (email) {
        orders = await Order.find({ email }).sort({ createdAt: -1 });
    } else {
        orders = await Order.find({}).sort({ createdAt: -1 });
    }
    return NextResponse.json(orders);
} 