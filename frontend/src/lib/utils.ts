import { TITLE_MAP, type AiResponse } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAllResponses = (data: AiResponse) => {
  return (Object.keys(TITLE_MAP) as Array<keyof AiResponse>).map((key) => ({
    title: TITLE_MAP[key],
    description: data[key],
  }));
};
