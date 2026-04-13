import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useAuth } from './hooks/useAuth';
import { useStores } from './hooks/useStores';
import { useProducts } from './hooks/useProducts';
import { useOrders } from './hooks/useOrders';
import { useStaff } from './hooks/useStaff';
import { useSuppliers } from './hooks/useSuppliers';
import { useCustomers } from './hooks/useCustomers';
import { useIssues } from './hooks/useIssues';
import { User, Product, Order, CartItem, UserRole, Supplier, StaffMember, Shift, Issue, Customer, Expense, Store } from '@/types';

interface StoreContextType {
    // Auth
    user: User | null;
    login: (email: string, password: string, roleFallback?: UserRole) => Promise<void>;
    loginWithGoogle: (role: UserRole) => Promise<void>;
    register: (email: string, password: string, name: string, role: UserRole, storeName?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;

    // Stores (multi-tenant)
    stores: Store[];
    currentStore: Store | null;
    switchStore: (store: Store) => void;

    // Inventory
    products: Product[];
    allProducts: Product[];
    addProduct: (product: Omit<Product, 'id' | 'status'>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;

    // Cart
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;

    // Orders
    orders: Order[];
    placeOrder: (customerDetails: {
        name: string;
        address: string;
        items?: CartItem[];
        paymentMethod?: string;
        storeId?: string;
    }) => Promise<void>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
    assignDriver: (orderId: string, driverId: string) => Promise<void>;
    isLoading: boolean;

    // Suppliers
    suppliers: Supplier[];
    addSupplier: (supplier: Omit<Supplier, 'id' | 'status'>) => Promise<void>;
    updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
    deleteSupplier: (id: string) => Promise<void>;

    // Staff
    staff: StaffMember[];
    addStaff: (staff: Omit<StaffMember, 'id'>) => Promise<void>;
    updateStaff: (id: string, updates: Partial<StaffMember>) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;

    // Shifts
    shifts: Shift[];
    currentShift: Shift | null;
    startShift: (float: number) => Promise<void>;
    endShift: (closingCash: number) => Promise<void>;
    recordCashDrop: (amount: number, reason: string) => Promise<void>;

    // Wishlist
    toggleWishlist: (productId: string) => void;

    // Issues
    issues: Issue[];
    reportIssue: (issue: Omit<Issue, 'id' | 'timestamp' | 'status'>) => Promise<void>;

    // Customers
    customers: Customer[];
    addCustomer: (customer: Omit<Customer, 'id' | 'totalSpend' | 'tabBalance' | 'lastVisit'>) => Promise<void>;
    updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
    settleCustomerTab: (id: string, amount: number) => Promise<void>;

    // Expenses
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id' | 'date' | 'loggedBy'>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const auth     = useAuth();
    const sel      = useStores(auth.user, auth.isLoading);
    const products = useProducts(auth.user, sel.currentStore, sel.storesResolved);
    const staffData = useStaff(auth.user, sel.currentStore, sel.storesResolved);
    const orders   = useOrders(auth.user, sel.currentStore, staffData.staff, sel.stores, sel.storesResolved);
    const suppliers = useSuppliers(auth.user, sel.currentStore, sel.storesResolved);
    const customers = useCustomers(auth.user, sel.currentStore, sel.storesResolved);
    const issues   = useIssues(auth.user, sel.storesResolved);

    const contextValue = useMemo(() => ({
        // auth
        user: auth.user,
        isLoading: auth.isLoading,
        login: auth.login,
        loginWithGoogle: auth.loginWithGoogle,
        register: auth.register,
        logout: auth.logout,
        updateUser: auth.updateUser,
        toggleWishlist: auth.toggleWishlist,
        // stores
        stores: sel.stores,
        currentStore: sel.currentStore,
        switchStore: sel.switchStore,
        // products
        products: products.products,
        allProducts: products.allProducts,
        addProduct: products.addProduct,
        updateProduct: products.updateProduct,
        deleteProduct: products.deleteProduct,
        // orders + cart
        orders: orders.orders,
        cart: orders.cart,
        cartTotal: orders.cartTotal,
        addToCart: orders.addToCart,
        removeFromCart: orders.removeFromCart,
        updateCartQuantity: orders.updateCartQuantity,
        clearCart: orders.clearCart,
        placeOrder: orders.placeOrder,
        updateOrderStatus: orders.updateOrderStatus,
        assignDriver: orders.assignDriver,
        // staff + shifts
        staff: staffData.staff,
        shifts: staffData.shifts,
        currentShift: staffData.currentShift,
        addStaff: staffData.addStaff,
        updateStaff: staffData.updateStaff,
        deleteStaff: staffData.deleteStaff,
        startShift: staffData.startShift,
        endShift: staffData.endShift,
        recordCashDrop: staffData.recordCashDrop,
        // suppliers
        suppliers: suppliers.suppliers,
        addSupplier: suppliers.addSupplier,
        updateSupplier: suppliers.updateSupplier,
        deleteSupplier: suppliers.deleteSupplier,
        // customers + expenses
        customers: customers.customers,
        expenses: customers.expenses,
        addCustomer: customers.addCustomer,
        updateCustomer: customers.updateCustomer,
        settleCustomerTab: customers.settleCustomerTab,
        addExpense: customers.addExpense,
        deleteExpense: customers.deleteExpense,
        // issues
        issues: issues.issues,
        reportIssue: issues.reportIssue,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [
        auth.user, auth.isLoading,
        sel.stores, sel.currentStore,
        products.products, products.allProducts,
        orders.orders, orders.cart, orders.cartTotal,
        staffData.staff, staffData.shifts, staffData.currentShift,
        suppliers.suppliers,
        customers.customers, customers.expenses,
        issues.issues,
    ]);

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
