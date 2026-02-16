export type UserRole = 'owner' | 'cashier' | 'customer' | 'driver' | 'admin' | 'lender';

export interface User {
    id: string;
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    storeName?: string; // For Owners
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    image: string; // Emoji
    status: 'In Stock' | 'Low Stock' | 'Critical' | 'Out of Stock';
}

export interface CartItem extends Product {
    quantity: number;
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    customerName: string;
    customerAddress: string;
    items: OrderItem[];
    total: number;
    status: 'Pending' | 'Paid' | 'Ready' | 'Out for Delivery' | 'Delivered';
    date: string;
    driverId?: string;
    type?: 'instore' | 'online' | 'delivery';
}

// Credit / Lending Types
export type MRIScoreTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Default';

export interface CreditProfile {
    uid: string;
    briScore: number; // The calculated percentage (0-100+)
    tier: MRIScoreTier;
    creditLimit: number;
    balance: number;
    paymentHistory: { date: string; amount: number; scoreSnapshot: number }[];
    dueDate: string; // usually 1st of next month
}

export interface Borrower {
    id: string;
    ssid: string;
    name: string;
    phone: string;
    email?: string;
    nationalId?: string; // SA ID Number
    rating: string;
    score: number;
    photoUrl: string;
    limit?: number;
    balance?: number;
}

export interface Loan {
    id: string;
    borrowerId: string;
    borrowerName: string;
    amount: number;
    dueDate: string;
    status: string;
    paidDate?: string;
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    date: string;
    read: boolean;
}
