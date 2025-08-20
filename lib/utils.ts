import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumberInput(value: string): string {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)
  
  if (!match) return value
  
  const [, area, prefix, line] = match
  
  if (line) {
    return `(${area}) ${prefix}-${line}`
  } else if (prefix) {
    return `(${area}) ${prefix}`
  } else if (area) {
    return area.length > 3 ? `(${area.slice(0, 3)}) ${area.slice(3)}` : `(${area}`
  }
  
  return ''
}