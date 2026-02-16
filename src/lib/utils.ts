import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskIdNumber(id: string): string {
  if (!id || id.length < 8) return id;
  const first6 = id.slice(0, 6);
  const last2 = id.slice(-2);
  const masked = "*".repeat(id.length - 8);
  return `${first6}${masked}${last2}`;
}
