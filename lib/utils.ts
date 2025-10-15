import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function calculateXPForLevel(level: number): number {
  // 指数增长公式: 100 * 1.5^(level-1)
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

export function getLevelFromXP(xp: number): number {
  let level = 1
  let totalXP = 0
  
  while (totalXP + calculateXPForLevel(level) <= xp) {
    totalXP += calculateXPForLevel(level)
    level++
  }
  
  return level
}

export function getXPProgressForLevel(xp: number, level: number): {
  current: number
  required: number
  percentage: number
} {
  let totalXP = 0
  for (let i = 1; i < level; i++) {
    totalXP += calculateXPForLevel(i)
  }
  
  const currentLevelXP = xp - totalXP
  const requiredXP = calculateXPForLevel(level)
  const percentage = Math.min((currentLevelXP / requiredXP) * 100, 100)
  
  return {
    current: currentLevelXP,
    required: requiredXP,
    percentage: Math.floor(percentage)
  }
}

