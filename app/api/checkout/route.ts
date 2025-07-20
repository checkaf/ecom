import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import Order from '@/models/Order';
import { connectToDatabase } from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
    try {
        const { cart, email } = await req.json();
        if (!cart || !email) {
            return NextResponse.json({ error: 'Missing cart or email' }, { status: 400 });
        }
        const line_items = cart.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name + (item.size ? ` (${item.size})` : ''),
                    images: [item.image],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            customer_email: email,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart`,
        });
        // Save order to DB
        await connectToDatabase();
        const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
        await Order.create({
            email,
            items: cart,
            total,
            stripeSessionId: session.id,
        });
        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Stripe error' }, { status: 500 });
    }
} 