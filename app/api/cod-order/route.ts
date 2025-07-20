import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        const { cart, email } = await req.json();
        if (!cart || !email) {
            return NextResponse.json({ error: 'Missing cart or email' }, { status: 400 });
        }
        await connectToDatabase();
        const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
        await Order.create({
            email,
            items: cart,
            total,
            stripeSessionId: 'COD',
        });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Order error' }, { status: 500 });
    }
} 