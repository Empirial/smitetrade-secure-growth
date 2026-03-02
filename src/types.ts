export type UserRole = 'owner' | 'cashier' | 'customer' | 'driver' | 'admin' | 'lender';

export interface User {
    id: string;
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    storeName?: string; // For Owners
    storeDetails?: {
        address: string;
        suburb: string;
        city: string;
        province: string;
        postalCode: string;
        currency: string;
    };
    profileDetails?: {
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

export interface Supplier {
    id: string;
    name: string;
    contact: string;
    products: string;
    status: 'Active' | 'Inactive';
}

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: 'cashier' | 'driver' | 'admin';
    status: 'Active' | 'Inactive' | 'On Leave';
    joined: string;
    username?: string;
    pin?: string;
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
    status: 'Open' | 'Closed';
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
