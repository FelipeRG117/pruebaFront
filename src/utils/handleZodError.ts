"use client"
import { date, ZodError } from "zod"
import { AppError } from "@/types/AppError"


export const handleZodError = (zodError: ZodError ): AppError[] => {
 
const severityError: Record<string, AppError["severity"] > = {
    invalid_type: "low", 
    too_small: "medium", 
    too_big: "medium", 
    custom: "high"
  } as const

    return zodError.issues.map((issue)=>({
    code: issue.code,
    field: issue.path.join("."), 
    message: issue.message, 
    severity: severityError[issue.code] || "medium", 
    timestamp: Date.now(), 
   
  }))


}


