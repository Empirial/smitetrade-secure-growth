import { z } from 'zod';

export const ProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category is required"),
    stock: z.number().int().min(0, "Stock must be a positive integer"),
    image: z.string().optional(),
    status: z.enum(['In Stock', 'Low Stock', 'Critical', 'Out of Stock']).optional()
});

export const OrderItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().min(0)
});

export const OrderSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    customerAddress: z.string().min(1, "Address is required"),
    items: z.array(OrderItemSchema).min(1, "Order must have at least one item"),
    total: z.number().min(0),
    status: z.enum(['Pending', 'Paid', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled']),
    date: z.string().datetime(), // Valid ISO date string
    driverId: z.string().optional(),
    userId: z.string(),
    type: z.enum(['instore', 'online', 'delivery']).optional()
});

export const UserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(['owner', 'cashier', 'customer', 'driver', 'admin']),
    storeName: z.string().optional()
});
