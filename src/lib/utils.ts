import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export const PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  IMPORTANT: 'Importante',
  URGENT: 'Urgente',
}

export const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-blue-100 text-blue-700',
  IMPORTANT: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
}