import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isMobileDevice = (userAgent: string | null): boolean => {
  if (!userAgent) return false;
  // 一般的なモバイルデバイスのUser Agent文字列を判定
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};
