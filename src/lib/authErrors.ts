/**
 * Maps Firebase Auth error codes to friendly, user-facing messages.
 * Use this everywhere an auth error might be shown to the user.
 */
export function getAuthErrorMessage(error: any): string {
    const code: string = error?.code ?? "";

    switch (code) {
        case "auth/user-not-found":
            return "No account found with this email.";
        case "auth/wrong-password":
            return "Incorrect password. Please try again.";
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/weak-password":
            return "Password must be at least 6 characters.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";
        case "auth/network-request-failed":
            return "Network error. Please check your connection.";
        case "auth/invalid-credential":
            return "Invalid email or password. Please try again.";
        case "auth/popup-closed-by-user":
            return "Sign-in was cancelled.";
        case "auth/requires-recent-login":
            return "Please sign in again to continue.";
        case "auth/user-disabled":
            return "This account has been disabled. Please contact support.";
        default:
            return "Something went wrong. Please try again.";
    }
}
