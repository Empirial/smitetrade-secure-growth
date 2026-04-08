import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { Camera, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";

export interface BarcodeScannerProps {
    isActive: boolean;
    onScan: (result: string) => void;
    children?: React.ReactNode;
}

const BarcodeScanner = forwardRef<HTMLVideoElement, BarcodeScannerProps>(({ isActive, onScan, children }, ref) => {
    const internalVideoRef = useRef<HTMLVideoElement>(null);
    const videoRef = (ref as React.MutableRefObject<HTMLVideoElement>) || internalVideoRef;
    const controlsRef = useRef<IScannerControls | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [deviceIndex, setDeviceIndex] = useState(0);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const startScanning = useCallback(async () => {
        // Stop any previous session first
        controlsRef.current?.stop();
        controlsRef.current = null;

        // Clear error BEFORE the wait so the <video> element is rendered during the delay
        setCameraError(null);

        // Wait for the dialog's video element to be in the DOM
        await new Promise(r => setTimeout(r, 150));
        if (!videoRef.current) return;
        try {
            // Always create a fresh reader
            const hints = new Map();
            hints.set(DecodeHintType.TRY_HARDER, true);
            const reader = new BrowserMultiFormatReader(hints);

            const deviceList = await BrowserMultiFormatReader.listVideoInputDevices();
            setDevices(deviceList);
            const deviceId = deviceList[deviceIndex]?.deviceId;
            controlsRef.current = await reader.decodeFromVideoDevice(
                deviceId,
                videoRef.current,
                (result) => { if (result) onScan(result.getText()); }
            );
        } catch {
            setCameraError("Unable to access camera. Please check permissions.");
        }
    }, [deviceIndex, onScan]);

    useEffect(() => {
        if (isActive) startScanning();
        else controlsRef.current?.stop();
        return () => { controlsRef.current?.stop(); };
    }, [isActive, deviceIndex, startScanning]);

    const toggleCamera = () => {
        controlsRef.current?.stop();
        setDeviceIndex(prev => (prev + 1) % Math.max(devices.length, 1));
    };

    return (
        <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
            {cameraError ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-white text-sm">{cameraError}</p>
                    <Button variant="outline" size="sm" className="mt-2 text-slate-800" onClick={startScanning}>
                        Retry
                    </Button>
                </div>
            ) : (
                <>
                    <video ref={videoRef} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-24 border-2 border-emerald-400/70 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                    </div>
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={toggleCamera}
                        className="absolute bottom-2 right-2 h-8 w-8 bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm pointer-events-auto"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    {children}
                </>
            )}
        </div>
    );
});

export default BarcodeScanner;
