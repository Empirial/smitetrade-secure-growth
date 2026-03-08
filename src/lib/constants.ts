import { Product, User, Order } from "@/types";

export const USE_MOCK_DATA = true;

export const MOCK_STORE_ID = "mock-store-001";
export const MOCK_STORE_NAME = "Soweto Central Spaza";

export const MOCK_USER: User = {
    id: "mock-owner-123",
    uid: "mock-owner-123",
    name: "Mock Owner",
    email: "owner@example.com",
    role: "owner",
    storeName: MOCK_STORE_NAME,
    storeId: MOCK_STORE_ID
};

export const MOCK_LENDER: User = {
    id: "mock-lender-001",
    uid: "mock-lender-001",
    name: "Mashonisa Mike",
    email: "mike@lender.com",
    role: "lender"
};

export const MOCK_PRODUCTS: Product[] = [
    { id: "p1", name: "Bread", price: 15.00, category: "Bakery", stock: 50, status: "In Stock", storeId: MOCK_STORE_ID, storeName: MOCK_STORE_NAME },
    { id: "p2", name: "Milk", price: 22.50, category: "Dairy", stock: 10, status: "Low Stock", storeId: MOCK_STORE_ID, storeName: MOCK_STORE_NAME },
    { id: "p3", name: "Eggs", price: 35.00, category: "Pantry", stock: 0, status: "Out of Stock", storeId: MOCK_STORE_ID, storeName: MOCK_STORE_NAME },
    { id: "p4", name: "Coke", price: 18.00, category: "Beverages", stock: 100, status: "In Stock", storeId: MOCK_STORE_ID, storeName: MOCK_STORE_NAME },
    { id: "p5", name: "Rice 2kg", price: 32.00, category: "Staples", stock: 30, status: "In Stock", storeId: "mock-store-002", storeName: "Diepkloof Mini Mart" },
    { id: "p6", name: "Sugar 1kg", price: 25.00, category: "Staples", stock: 20, status: "In Stock", storeId: "mock-store-002", storeName: "Diepkloof Mini Mart" },
    { id: "p7", name: "Cooking Oil 750ml", price: 42.00, category: "Pantry", stock: 15, status: "In Stock", storeId: "mock-store-002", storeName: "Diepkloof Mini Mart" },
    { id: "p8", name: "Maize Meal 5kg", price: 55.00, category: "Staples", stock: 40, status: "In Stock", storeId: MOCK_STORE_ID, storeName: MOCK_STORE_NAME },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: "ord-001",
        customerName: "Thabo Bester",
        customerAddress: "123 Vilakazi St, Soweto",
        items: [{ id: "p1", name: "Bread", quantity: 2, price: 15.00 }],
        total: 30.00,
        status: "Delivered",
        date: new Date(Date.now() - 86400000).toISOString(),
        type: "delivery",
        storeId: MOCK_STORE_ID,
        storeName: MOCK_STORE_NAME
    },
    {
        id: "ord-002",
        customerName: "Sarah Connor",
        customerAddress: "45 Hector Pieterson Rd",
        items: [{ id: "p2", name: "Milk", quantity: 1, price: 22.50 }],
        total: 22.50,
        status: "Pending",
        date: new Date().toISOString(),
        type: "instore",
        storeId: MOCK_STORE_ID,
        storeName: MOCK_STORE_NAME
    },
    {
        id: "ord-003",
        customerName: "Nomsa Dlamini",
        customerAddress: "78 Diepkloof Ext 3",
        items: [
            { id: "p5", name: "Rice 2kg", quantity: 1, price: 32.00 },
            { id: "p6", name: "Sugar 1kg", quantity: 2, price: 25.00 }
        ],
        total: 82.00,
        status: "Ready",
        date: new Date().toISOString(),
        type: "delivery",
        storeId: "mock-store-002",
        storeName: "Diepkloof Mini Mart"
    }
];

export const MOCK_STORES = [
    {
        id: MOCK_STORE_ID,
        ownerId: "mock-owner-123",
        name: MOCK_STORE_NAME,
        address: "12 Vilakazi Street",
        suburb: "Orlando West",
        city: "Soweto",
        province: "Gauteng",
        postalCode: "1804",
        status: "Active" as const,
        createdAt: new Date().toISOString()
    },
    {
        id: "mock-store-002",
        ownerId: "mock-owner-456",
        name: "Diepkloof Mini Mart",
        address: "45 Main Road",
        suburb: "Diepkloof",
        city: "Soweto",
        province: "Gauteng",
        postalCode: "1818",
        status: "Active" as const,
        createdAt: new Date().toISOString()
    }
];
