/**
 * useExpenses — Business expense tracking slice of StoreContext
 *
 * Provides: expenses, addExpense, deleteExpense
 *
 * Expenses are store-scoped and ordered by date descending.
 * Each expense entry auto-stamps date and loggedBy (current user name).
 *
 * This is a re-export shim. All state lives in StoreContext.
 */
import { useStore } from '@/context/StoreContext';

export const useExpenses = () => {
    const { expenses, addExpense, deleteExpense } = useStore();
    return { expenses, addExpense, deleteExpense };
};
