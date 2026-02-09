import { describe, it, expect, vi } from 'vitest';
import { UserSchema } from '../lib/schemas';

// Mock Firebase Auth (Basic Mocking for Unit logic, not E2E)
// In a real scenario, we'd use firebase-mock or improved dependency injection
// Here we test the Zod Schema validation which is the core "logic" we just added.

describe('User Authentication Schema', () => {
    it('should validate a correct user object', () => {
        const validUser = {
            name: "John Doe",
            email: "john@example.com",
            role: "customer"
        };
        const result = UserSchema.safeParse(validUser);
        expect(result.success).toBe(true);
    });

    it('should reject an invalid email', () => {
        const invalidUser = {
            name: "John Doe",
            email: "not-an-email",
            role: "customer"
        };
        const result = UserSchema.safeParse(invalidUser);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].path).toContain('email');
        }
    });

    it('should reject an invalid role', () => {
        const invalidUser = {
            name: "John Doe",
            email: "john@example.com",
            role: "hacker"
        };
        const result = UserSchema.safeParse(invalidUser);
        expect(result.success).toBe(false);
    });
});
