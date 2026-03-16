import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, AlertCircle, CheckCircle } from "lucide-react";
import FieldError from "@/components/ui/FieldError";
import { validateRequired, validateEmail, validatePassword, validatePasswordMatch, hasErrors } from "@/utils/validation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const AdminRegister = () => {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(true);
    const [alreadySeeded, setAlreadySeeded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        fullName: null as string | null,
        email: null as string | null,
        password: null as string | null,
        confirmPassword: null as string | null,
    });

    useEffect(() => {
        const checkSeedStatus = async () => {
            try {
                const statusRef = doc(db, "admin_seed", "status");
                const statusSnap = await getDoc(statusRef);
                if (statusSnap.exists() && statusSnap.data().seeded === true) {
                    setAlreadySeeded(true);
                }
            } catch {
                // If check fails, allow registration attempt
            } finally {
                setIsChecking(false);
            }
        };
        checkSeedStatus();
    }, []);

    const validate = () => {
        const newErrors = {
            fullName: validateRequired(formData.fullName, "Full Name"),
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: validatePasswordMatch(formData.password, formData.confirmPassword),
        };
        setErrors(newErrors);
        return !hasErrors(newErrors);
    };

    const setField = (field: keyof typeof formData, value: string) => {
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: null });
        setAuthError(null);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        if (!validate()) return;
        setIsLoading(true);
        try {
            // Re-check seed status right before creating to guard against race conditions
            const statusRef = doc(db, "admin_seed", "status");
            const statusSnap = await getDoc(statusRef);
            if (statusSnap.exists() && statusSnap.data().seeded === true) {
                setAlreadySeeded(true);
                return;
            }

            const credential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const uid = credential.user.uid;

            await setDoc(doc(db, "users", uid), {
                uid,
                id: uid,
                name: formData.fullName,
                email: formData.email,
                role: "admin",
                createdAt: new Date().toISOString(),
            });

            await setDoc(statusRef, {
                seeded: true,
                adminUid: uid,
                seededAt: new Date().toISOString(),
            });

            setSuccess(true);
            setTimeout(() => navigate("/admin/login"), 2000);
        } catch (error: any) {
            const code = error?.code;
            if (code === "auth/email-already-in-use") {
                setAuthError("That email is already registered. Please use the login page.");
            } else if (code === "auth/weak-password") {
                setAuthError("Password is too weak. Please use at least 6 characters.");
            } else if (code === "auth/invalid-email") {
                setAuthError("The email address is not valid.");
            } else {
                setAuthError("Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                        <ShieldAlert className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                        Admin Registration
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Create the system administrator account
                    </p>
                </div>

                <Card className="border-border shadow-xl">
                    <CardContent className="pt-8">
                        {isChecking ? (
                            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                                Checking registration status...
                            </div>
                        ) : alreadySeeded ? (
                            <div className="flex flex-col items-center gap-4 py-6 text-center">
                                <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive w-full">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    Admin account already exists. Please login.
                                </div>
                                <Link
                                    to="/admin/login"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Go to Admin Login &rarr;
                                </Link>
                            </div>
                        ) : success ? (
                            <div className="flex flex-col items-center gap-4 py-6 text-center">
                                <div className="flex items-center gap-2 rounded-md border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-600 w-full">
                                    <CheckCircle className="h-4 w-4 shrink-0" />
                                    Admin account created successfully! Redirecting to login...
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-6" noValidate>
                                {authError && (
                                    <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {authError}
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            placeholder="Smitetrade Admin"
                                            value={formData.fullName}
                                            onChange={(e) => setField("fullName", e.target.value)}
                                            className={`bg-background ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        />
                                        <FieldError message={errors.fullName} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@smitetrade.co.za"
                                            value={formData.email}
                                            onChange={(e) => setField("email", e.target.value)}
                                            className={`bg-background ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        />
                                        <FieldError message={errors.email} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Minimum 6 characters"
                                            value={formData.password}
                                            onChange={(e) => setField("password", e.target.value)}
                                            className={`bg-background ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        />
                                        <FieldError message={errors.password} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Re-enter your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setField("confirmPassword", e.target.value)}
                                            className={`bg-background ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        />
                                        <FieldError message={errors.confirmPassword} />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full shadow-md" disabled={isLoading}>
                                    {isLoading ? "Creating Account..." : "Create Admin Account"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pb-8">
                    </CardFooter>
                </Card>

                <div className="text-center text-sm text-muted-foreground mt-8">
                    <Link to="/admin/login" className="font-medium hover:text-primary transition-colors">
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;
