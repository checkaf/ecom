import mongoose, { Schema, models, model } from 'mongoose';

const OrderSchema = new Schema({
    email: { type: String, required: true },
    items: [
        {
            _id: String,
            name: String,
            price: Number,
            image: String,
            size: String,
            quantity: Number,
        },
    ],
    total: { type: Number, required: true },
    stripeSessionId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default models.Order || model('Order', OrderSchema); 