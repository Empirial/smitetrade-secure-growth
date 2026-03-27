/** Haversine distance between two coordinates in km */
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Geocode a South African address to lat/lng using OpenStreetMap Nominatim (free, no API key) */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const query = encodeURIComponent(`${address}, South Africa`);
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=za`,
            { headers: { 'Accept-Language': 'en', 'User-Agent': 'SmiteTrade/1.0' } }
        );
        const data = await res.json();
        if (data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
    } catch {
        // Silently fail — location is non-critical
    }
    return null;
}

/** Get device GPS position via browser Geolocation API */
export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => reject(err),
            { timeout: 10000, maximumAge: 60000 }
        );
    });
}

// ─── Customer location stored in localStorage ────────────────────────────────

const LOCATION_KEY = 'smitetrade_customer_location';

export interface SavedLocation {
    lat: number;
    lng: number;
    address: string;
}

export function getSavedLocation(): SavedLocation | null {
    try {
        const raw = localStorage.getItem(LOCATION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveLocation(lat: number, lng: number, address: string): void {
    localStorage.setItem(LOCATION_KEY, JSON.stringify({ lat, lng, address }));
}

export function clearLocation(): void {
    localStorage.removeItem(LOCATION_KEY);
}

// ─── Store coordinate cache (by storeId) ─────────────────────────────────────

export function getCachedStoreCoords(storeId: string): { lat: number; lng: number } | null {
    try {
        const raw = localStorage.getItem(`smitetrade_store_${storeId}`);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function cacheStoreCoords(storeId: string, lat: number, lng: number): void {
    localStorage.setItem(`smitetrade_store_${storeId}`, JSON.stringify({ lat, lng }));
}
