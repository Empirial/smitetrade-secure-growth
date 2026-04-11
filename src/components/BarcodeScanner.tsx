import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Html5Qrcode } from "html5-qrcode";

export interface BarcodeScannerProps {
    isActive: boolean;
    onScan: (result: string, productName?: string) => void;
    children?: React.ReactNode;
}

async function lookupBarcode(barcode: string): Promise<string | undefined> {
    try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await res.json();
        if (data.status !== 1) return undefined;
        const p = data.product;
        const name = p.product_name || p.product_name_en || "";
        const brand = p.brands || "";
        return [brand, name].filter(Boolean).join(" ").trim() || undefined;
    } catch {
        return undefined;
    }
}

// ── Native BarcodeDetector scanner ────────────────────────────────────────────

function useNativeScanner(
    videoRef: React.MutableRefObject<HTMLVideoElement | null>,
    isActive: boolean,
    onScan: BarcodeScannerProps["onScan"],
    setLooking: (v: boolean) => void,
    setCameraError: (v: string | null) => void,
) {
    const streamRef = useRef<MediaStream | null>(null);
    const animFrameRef = useRef<number>(0);
    const lastCodeRef = useRef<string>("");

    const stop = useCallback(() => {
        cancelAnimationFrame(animFrameRef.current);
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
    }, [videoRef]);

    const start = useCallback(async () => {
        stop();
        setCameraError(null);
        lastCodeRef.current = "";
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
            });
            streamRef.current = stream;
            await new Promise<void>(r => setTimeout(r, 100));
            if (!videoRef.current) return;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();

            // @ts-ignore
            const detector = new BarcodeDetector({
                formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code"],
            });

            const scan = async () => {
                if (!videoRef.current || videoRef.current.readyState < 2) {
                    animFrameRef.current = requestAnimationFrame(scan);
                    return;
                }
                try {
                    const barcodes = await detector.detect(videoRef.current);
                    if (barcodes.length > 0) {
                        const code: string = barcodes[0].rawValue;
                        if (code !== lastCodeRef.current) {
                            lastCodeRef.current = code;
                            setLooking(true);
                            const productName = await lookupBarcode(code);
                            setLooking(false);
                            onScan(code, productName);
                            await new Promise(r => setTimeout(r, 2000));
                            lastCodeRef.current = "";
                        }
                    }
                } catch { /* frame error */ }
                animFrameRef.current = requestAnimationFrame(scan);
            };
            animFrameRef.current = requestAnimationFrame(scan);
        } catch {
            setCameraError("Unable to access camera. Please check permissions.");
        }
    }, [stop, onScan, setLooking, setCameraError, videoRef]);

    useEffect(() => {
        if (isActive) start();
        else stop();
        return () => stop();
    }, [isActive, start, stop]);
}

// ── html5-qrcode fallback scanner ─────────────────────────────────────────────

const FALLBACK_DIV_ID = "html5-qrcode-region";

function useFallbackScanner(
    isActive: boolean,
    onScan: BarcodeScannerProps["onScan"],
    setLooking: (v: boolean) => void,
    setCameraError: (v: string | null) => void,
) {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const lastCodeRef = useRef<string>("");
    const cooldownRef = useRef(false);

    const stop = useCallback(async () => {
        if (scannerRef.current) {
            try { await scannerRef.current.stop(); } catch { /* already stopped */ }
            scannerRef.current.clear();
            scannerRef.current = null;
        }
    }, []);

    const start = useCallback(async () => {
        await stop();
        setCameraError(null);
        lastCodeRef.current = "";
        cooldownRef.current = false;

        // Wait for the div to be in the DOM
        await new Promise(r => setTimeout(r, 150));

        try {
            scannerRef.current = new Html5Qrcode(FALLBACK_DIV_ID);
            await scannerRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 120 } },
                async (code) => {
                    if (cooldownRef.current || code === lastCodeRef.current) return;
                    lastCodeRef.current = code;
                    cooldownRef.current = true;
                    setLooking(true);
                    const productName = await lookupBarcode(code);
                    setLooking(false);
                    onScan(code, productName);
                    setTimeout(() => {
                        lastCodeRef.current = "";
                        cooldownRef.current = false;
                    }, 2000);
                },
                () => { /* scan error — suppress */ },
            );
        } catch {
            setCameraError("Unable to access camera. Please check permissions.");
        }
    }, [stop, onScan, setLooking, setCameraError]);

    useEffect(() => {
        if (isActive) start();
        else stop();
        return () => { stop(); };
    }, [isActive, start, stop]);
}

// ── Main component ─────────────────────────────────────────────────────────────

const supportsNative = typeof window !== "undefined" && "BarcodeDetector" in window;

const BarcodeScanner = forwardRef<HTMLVideoElement, BarcodeScannerProps>(({ isActive, onScan, children }, ref) => {
    const internalVideoRef = useRef<HTMLVideoElement>(null);
    const videoRef = (ref as React.MutableRefObject<HTMLVideoElement>) || internalVideoRef;
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [looking, setLooking] = useState(false);

    const noop = useCallback(() => {}, []);

    // Only one scanner runs — the other hooks receive isActive=false
    useNativeScanner(
        videoRef,
        supportsNative ? isActive : false,
        onScan,
        setLooking,
        supportsNative ? setCameraError : noop,
    );
    useFallbackScanner(
        supportsNative ? false : isActive,
        onScan,
        setLooking,
        supportsNative ? noop : setCameraError,
    );

    return (
        <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
            {cameraError ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-white text-sm">{cameraError}</p>
                    <Button variant="outline" size="sm" className="mt-2 text-slate-800"
                        onClick={() => setCameraError(null)}>
                        Retry
                    </Button>
                </div>
            ) : (
                <>
                    {supportsNative ? (
                        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                        <div id={FALLBACK_DIV_ID} className="w-full h-full" />
                    )}
                    {supportsNative && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-48 h-24 border-2 border-emerald-400/70 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                        </div>
                    )}
                    {looking && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Looking up product…
                        </div>
                    )}
                    {children}
                </>
            )}
        </div>
    );
});

export default BarcodeScanner;
