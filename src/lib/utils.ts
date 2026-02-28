import { type ClassNameValue, twMerge } from "tailwind-merge";

export function durationToMs(
  value: number,
  unit: "seconds" | "minutes" | "hours" | "days" | "weeks"
): number {
  const multipliers = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000
  };
  return value * multipliers[unit];
}

export function cn(...inputs: ClassNameValue[]) {
  return twMerge(inputs);
}
