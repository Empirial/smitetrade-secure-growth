import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DownloadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDownload: (filename: string) => void;
}

export default function DownloadDialog({ open, onOpenChange, onDownload }: DownloadDialogProps) {
    const [filename, setFilename] = useState("scanned-document");

    const handleDownload = () => {
        onDownload(filename || "scanned-document");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Save Document</DialogTitle>
                    <DialogDescription>
                        Enter a name for your scanned document before downloading.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 py-4">
                    <Input
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder="Document name"
                    />
                </div>
                <DialogFooter className="sm:justify-between">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-700">
                        Download PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
