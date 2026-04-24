import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { Camera, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";

export interface BarcodeScannerProps {
    isActive: boolean;
    onScan: (result: string, productName?: string) => void;
    confirmLabel?: string;
    children?: React.ReactNode;
}

const BarcodeScanner = forwardRef<HTMLVideoElement, BarcodeScannerProps>(({ isActive, onScan, confirmLabel = "Confirm", children }, ref) => {
    const internalVideoRef = useRef<HTMLVideoElement>(null);
    const videoRef = (ref as React.MutableRefObject<HTMLVideoElement>) ?? internalVideoRef;
    const controlsRef = useRef<{ stop: () => void } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pendingScan, setPendingScan] = useState<string | null>(null);
    const detectedRef = useRef(false);

    const stop = useCallback(() => {
        controlsRef.current?.stop();
        controlsRef.current = null;
    }, []);

    const onScanRef = useRef(onScan);
    useEffect(() => { onScanRef.current = onScan; }, [onScan]);

    const start = useCallback(async () => {
        stop();
        setError(null);
        setPendingScan(null);
        detectedRef.current = false;
        try {
            const reader = new BrowserMultiFormatReader();
            const controls = await reader.decodeFromVideoDevice(
                undefined,
                videoRef.current!,
                (result, err) => {
                    if (result && !detectedRef.current) {
                        detectedRef.current = true;
                        setPendingScan(result.getText());
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
    }, [stop, videoRef]);

    useEffect(() => {
        if (isActive) start();
        else { stop(); setPendingScan(null); detectedRef.current = false; }
        return () => stop();
    }, [isActive, start, stop]);

    const handleConfirm = () => {
        if (pendingScan) {
            onScanRef.current(pendingScan);
            setPendingScan(null);
            detectedRef.current = false;
        }
    };

    const handleRescan = () => {
        detectedRef.current = false;
        setPendingScan(null);
    };

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
                        onClick={() => { setError(null); start(); }}                    >
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
                    {pendingScan ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-3 p-4">
                            <CheckCircle className="h-8 w-8 text-emerald-400" />
                            <p className="text-white text-sm font-medium">Barcode detected</p>
                            <p className="text-emerald-400 text-xs font-mono">{pendingScan}</p>
                            <div className="flex gap-2 mt-1">
                                <Button size="sm" onClick={handleConfirm}>{confirmLabel}</Button>
                                <Button size="sm" variant="outline" className="text-slate-800" onClick={handleRescan}>
                                    <RotateCcw className="h-3 w-3 mr-1" />Rescan
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-56 h-28 border-2 border-emerald-400/70 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                        </div>
                    )}
                    {children}
                </>
            )}
        </div>
    );
});

BarcodeScanner.displayName = "BarcodeScanner";
export default BarcodeScanner;
