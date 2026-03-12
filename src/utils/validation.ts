/**
 * Shared form validation utility for SmiteTrade.
 * Each function returns null if valid, or an error message string if invalid.
 */

/** Validates that a field is not empty */
export const validateRequired = (value: string, label: string): string | null => {
    if (!value || value.trim() === "") {
        return `${label} is required.`;
    }
    return null;
};

/** Validates email format */
export const validateEmail = (value: string): string | null => {
    if (!value || value.trim() === "") return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return "Please enter a valid email address.";
    return null;
};

/** Validates password length */
export const validatePassword = (value: string, minLen = 6): string | null => {
    if (!value) return "Password is required.";
    if (value.length < minLen) return `Password must be at least ${minLen} characters.`;
    return null;
};

/** Validates that two passwords match */
export const validatePasswordMatch = (password: string, confirm: string): string | null => {
    if (!confirm) return "Please confirm your password.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
};

/** Validates a South African phone number */
export const validatePhone = (value: string): string | null => {
    if (!value || value.trim() === "") return "Phone number is required.";
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$|^(\+27|0)[6-8][0-9]\s?[0-9]{3}\s?[0-9]{4}$/;
    const cleaned = value.replace(/\s/g, "");
    if (!phoneRegex.test(cleaned)) return "Enter a valid SA phone number (e.g. 082 123 4567).";
    return null;
};

/** Validates a South African 13-digit ID number */
export const validateIdNumber = (value: string): string | null => {
    if (!value || value.trim() === "") return "ID number is required.";
    if (!/^\d{13}$/.test(value.trim())) return "ID number must be exactly 13 digits.";
    return null;
};

/** Validates a bank account number (digits only) */
export const validateAccountNumber = (value: string): string | null => {
    if (!value || value.trim() === "") return "Account number is required.";
    if (!/^\d{6,20}$/.test(value.trim())) return "Account number must be 6–20 digits.";
    return null;
};

/** Validates a 6-digit branch code */
export const validateBranchCode = (value: string): string | null => {
    if (!value || value.trim() === "") return "Branch code is required.";
    if (!/^\d{6}$/.test(value.trim())) return "Branch code must be exactly 6 digits.";
    return null;
};

/** Validates a numeric loan amount */
export const validateAmount = (value: string, min = 1, max?: number): string | null => {
    if (!value || value.trim() === "") return "Amount is required.";
    const num = parseFloat(value);
    if (isNaN(num) || num < min) return `Amount must be at least R${min}.`;
    if (max !== undefined && num > max) return `Amount cannot exceed R${max.toLocaleString()}.`;
    return null;
};

/** Validates a license plate (South African format: ABC 123 GP) */
export const validateLicensePlate = (value: string): string | null => {
    if (!value || value.trim() === "") return "License plate is required.";
    const plateRegex = /^[A-Z]{1,3}\s?\d{1,3}\s?[A-Z]{1,3}$/i;
    if (!plateRegex.test(value.trim())) return "Enter a valid license plate (e.g. ABC 123 GP).";
    return null;
};

/** Validates a text area with minimum length */
export const validateTextArea = (value: string, label: string, minLen = 20): string | null => {
    if (!value || value.trim() === "") return `${label} is required.`;
    if (value.trim().length < minLen) return `${label} must be at least ${minLen} characters.`;
    return null;
};

/** Checks if an errors object has any non-null values */
export const hasErrors = (errors: Record<string, string | null>): boolean => {
    return Object.values(errors).some((e) => e !== null);
};
