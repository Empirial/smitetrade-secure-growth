import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";

export interface BarcodeScannerProps {
    isActive: boolean;
    onScan: (result: string, productName?: string) => void;
    children?: React.ReactNode;
}

const BarcodeScanner = forwardRef<HTMLVideoElement, BarcodeScannerProps>(({ isActive, onScan, children }, ref) => {
    const internalVideoRef = useRef<HTMLVideoElement>(null);
    const videoRef = (ref as React.MutableRefObject<HTMLVideoElement>) ?? internalVideoRef;
    const controlsRef = useRef<{ stop: () => void } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const stop = useCallback(() => {
        controlsRef.current?.stop();
        controlsRef.current = null;
    }, []);

    const start = useCallback(async () => {
        stop();
        setError(null);
        try {
            const reader = new BrowserMultiFormatReader();
            const controls = await reader.decodeFromVideoDevice(
                undefined,
                videoRef.current!,
                (result, err) => {
                    if (result) {
                        onScan(result.getText());
                    }
                    if (err && !(err instanceof NotFoundException)) {
                        console.warn("Scan error:", err);
                    }
                }
            );
            controlsRef.current = controls;
        } catch {
            setError("Unable to access camera. Please check permissions.");
        }
    }, [stop, onScan, videoRef]);

    useEffect(() => {
        if (isActive) start();
        else stop();
        return () => stop();
    }, [isActive, start, stop]);

    return (
        <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
            {error ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-white text-sm">{error}</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-slate-800"
                        onClick={() => { setError(null); start(); }}
                    >
                        Retry
                    </Button>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-56 h-28 border-2 border-emerald-400/70 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                    </div>
                    {children}
                </>
            )}
        </div>
    );
});

BarcodeScanner.displayName = "BarcodeScanner";
export default BarcodeScanner;
