import { ZodError } from "zod"


export type AppError = {
code: string; 
field?: string; 
message: string; 
severity: "low" | "medium" | "high"; 
timestamp?: number;
metadata?: Record<string, []>; 
}
