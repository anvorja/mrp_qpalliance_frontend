// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera un ID aleatorio
 * @returns {number} ID aleatorio generado
 */
export function generateRandomId(): number {
  return Math.floor(Math.random() * 1000000) + 1;
}