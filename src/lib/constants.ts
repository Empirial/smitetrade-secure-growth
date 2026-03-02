import { Product, User, Order } from "@/types";

export const USE_MOCK_DATA = true;

export const MOCK_USER: User = {
    id: "mock-owner-123",
    uid: "mock-owner-123",
    name: "Mock Owner",
    email: "owner@example.com",
    role: "owner",
    storeName: "Mock Store"
};

export const MOCK_LENDER: User = {
    id: "mock-lender-001",
    uid: "mock-lender-001",
    name: "Mashonisa Mike",
    email: "mike@lender.com",
    role: "lender"
};

export const MOCK_PRODUCTS: Product[] = [
    { id: "p1", name: "Bread", price: 15.00, category: "Bakery", stock: 50, status: "In Stock" },
    { id: "p2", name: "Milk", price: 22.50, category: "Dairy", stock: 10, status: "Low Stock" },
    { id: "p3", name: "Eggs", price: 35.00, category: "Pantry", stock: 0, status: "Out of Stock" },
    { id: "p4", name: "Coke", price: 18.00, category: "Beverages", stock: 100, status: "In Stock" },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: "ord-001",
        customerName: "Thabo Bester",
        customerAddress: "123 Prison Break Ln",
        items: [{ id: "p1", name: "Bread", quantity: 2, price: 15.00 }],
        total: 30.00,
        status: "Delivered",
        date: new Date(Date.now() - 86400000).toISOString(),
        type: "delivery"
    },
    {
        id: "ord-002",
        customerName: "Sarah Connor",
        customerAddress: "Unknown",
        items: [{ id: "p2", name: "Milk", quantity: 1, price: 22.50 }],
        total: 22.50,
        status: "Pending",
        date: new Date().toISOString(),
        type: "instore"
    }
];
