import { AlertCircle } from "lucide-react";

interface FieldErrorProps {
    message: string | null | undefined;
}

/**
 * Displays an inline validation error message under a form field.
 * Renders nothing when message is null/undefined/empty.
 */
const FieldError = ({ message }: FieldErrorProps) => {
    if (!message) return null;
    return (
        <div className="flex items-center gap-1.5 mt-1 text-destructive text-xs font-medium animate-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{message}</span>
        </div>
    );
};

export default FieldError;
