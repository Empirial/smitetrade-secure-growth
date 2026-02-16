
import { db } from "./firebase";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { Product } from "@/types";

const INITIAL_PRODUCTS: Omit<Product, 'id'>[] = [
    { name: "Maize Meal 10kg", price: 120.00, category: "Staples", stock: 50, image: "🌽", status: "In Stock" },
    { name: "Cooking Oil 2L", price: 85.00, category: "Pantry", stock: 20, image: "🌻", status: "In Stock" },
    { name: "White Sugar 2kg", price: 45.00, category: "Pantry", stock: 5, image: "🍬", status: "Critical" },
    { name: "Tea Bags 100s", price: 35.00, category: "Beverages", stock: 100, image: "☕", status: "In Stock" },
    { name: "Full Cream Milk 1L", price: 18.00, category: "Dairy", stock: 12, image: "🥛", status: "Low Stock" },
    { name: "Brown Bread", price: 16.00, category: "Bakery", stock: 0, image: "🍞", status: "Out of Stock" },
];

export const seedDatabase = async () => {
    try {
        const batch = writeBatch(db);

        INITIAL_PRODUCTS.forEach((product) => {
            const productRef = doc(collection(db, "products"));
            // We use the auto-generated ID but spread the product data
            // We assign a numeric ID for compatibility with existing code if needed, 
            // but Firestore IDs are strings. 
            // For now, let's stick to Firestore string IDs or generated numeric ones.
            // To be safe for the app's current types (number ids), we might need to adjust the app types 
            // OR use a specific ID strategy. 
            // Refactoring app to use string IDs is best for Firebase.
            // For this seed, we'll let Firestore generate string IDs.
            // NOTE: This implies we MUST refactor Product.id to be string in the App.
            batch.set(productRef, {
                ...product,
                createdAt: new Date().toISOString()
            });
        });

        await batch.commit();
        console.log("Database seeded successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding database:", error);
        return false;
    }
};
