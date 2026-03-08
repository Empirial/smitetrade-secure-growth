

# Add Barcode Scanner to Owner Inventory

## Current State

- **Owner Inventory** (`OwnerInventory.tsx`): Has a `handleScan` function but it's a **mock** — it just sets a hardcoded barcode after 1 second. The scan button (`ScanLine` icon) is imported but **never rendered** in the UI. There's no camera, no `@zxing` integration.
- **Owner POS** (`OwnerPOS.tsx`): Already has a **real** barcode scanner using `react-webcam` + `@zxing/library` inside a dialog. This is the pattern to replicate.

## Plan

### 1. Add real barcode scanner dialog to Owner Inventory

Add a scanner dialog to the Add/Edit Product form that:
- Opens a camera feed using `react-webcam` + `BrowserMultiFormatReader` (same pattern as OwnerPOS)
- Auto-detects barcodes and fills the barcode field in the product form
- Includes manual barcode text input as fallback
- Has camera flip button for front/back camera
- Shows a "Scanning..." overlay with animated border

### 2. Add barcode field to the Add Product dialog

The form currently has name, category, price, stock fields but **no barcode input**. Add:
- A barcode text field with a scan button next to it
- Clicking the scan button opens the camera scanner dialog
- When a barcode is detected, it auto-fills the barcode field

### 3. Will it detect barcodes?

Yes — the `@zxing/library` `BrowserMultiFormatReader` supports these formats:
- **1D**: EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39, ITF
- **2D**: QR Code, Data Matrix, Aztec, PDF417

Detection depends on: camera quality, lighting, barcode print quality, and distance. The scanner polls every 500ms with a 3-second debounce to prevent duplicate scans. This is the same proven setup already working in the Cashier Scanner and Owner POS pages.

## Files to Change

| File | Change |
|---|---|
| `src/pages/owner/OwnerInventory.tsx` | Add webcam + @zxing scanner dialog, add barcode field to product form, replace mock `handleScan` with real scanner |

