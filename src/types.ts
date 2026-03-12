export type UserRole = 'owner' | 'cashier' | 'customer' | 'driver' | 'admin' | 'lender';

export interface User {
    id: string;
    uid: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    storeName?: string; // For Owners
    storeId?: string; // Links user to their store
    storeDetails?: {
        address: string;
        suburb: string;
        city: string;
        province: string;
        postalCode: string;
        currency: string;
    };
    profileDetails?: {
        IDNumber: string;
        firstName: string;
        lastName: string;
        phone: string;
        defaultAddress: string;
    };
    stores?: {
        id: string;
        name: string;
        address: string;
        suburb: string;
        city: string;
        province: string;
        postalCode: string;
    }[];
    wishlist?: string[]; // Array of Product IDs
    subscription?: {
        plan: 'basic' | 'pro';
        status: 'active' | 'cancelled' | 'trial';
        trialEndsAt?: string;
        activatedAt?: string;
    };
}

// Multi-tenant Store
export interface Store {
    id: string;
    ownerId: string;
    name: string;
    address: string;
    suburb: string;
    city: string;
    province: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    logo?: string;
    status: 'Active' | 'Inactive' | 'Pending';
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Critical' | 'Out of Stock';
    image?: string;
    barcode?: string;
    storeId?: string;
    storeName?: string;
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
    userId?: string; // Link to customer
    type?: 'instore' | 'online' | 'delivery';
    storeId?: string;
    storeName?: string;
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
    lenderId?: string;
}

export interface Loan {
    id: string;
    borrowerId: string;
    borrowerName: string;
    amount: number;
    dueDate: string;
    status: string;
    paidDate?: string;
    lenderId?: string;
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    date: string;
    read: boolean;
}

export interface Supplier {
    id: string;
    name: string;
    contact: string;
    products: string;
    status: 'Active' | 'Inactive';
    storeId?: string;
}

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: 'cashier' | 'driver' | 'admin';
    status: 'Active' | 'Inactive' | 'On Leave';
    joined: string;
    username?: string;
    password?: string;
    pin?: string;
    storeId?: string;
}

export interface Shift {
    id: string;
    cashierId: string;
    cashierName: string;
    startTime: string;
    endTime?: string;
    openingFloat: number;
    closingCash?: number;
    totalSales: number;
    discrepancy?: number;
    status: 'Open' | 'Closed' | 'Pending' | 'Flagged';
    storeId?: string;
}

export interface Issue {
    id: string;
    driverId: string;
    orderId?: string;
    reason: string;
    notes: string;
    timestamp: string;
    status: 'Open' | 'Resolved';
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    totalSpend: number;
    tabBalance: number;
    lastVisit: string;
    storeId?: string;
}

export interface Expense {
    id: string;
    date: string;
    category: string;
    amount: number;
    description: string;
    loggedBy: string;
    storeId?: string;
}
