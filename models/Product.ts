import mongoose, { Schema, models, model } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    sizes: [{ type: String }],
    category: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default models.Product || model('Product', ProductSchema); 