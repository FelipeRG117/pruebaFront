"use client"
import React, { useMemo, useState } from 'react'
import { z } from 'zod'
import { handleZodError } from '@/utils/handleZodError'
import { AppError } from '@/types/AppError'
import styles from "@/components/formStyle.module.css"
export const FormComponent = () => {
    const formSchema = z.object({
        name: z.string().min(3, "necestia minimo 3 letras"),
        email: z.string().email(),
        age: z.number().int().gte(18, "neceistas ser mayor de edad")
    })
    const [errors, setErrors] = useState<AppError[]>([])

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: 0
    })




    const errorByFiled = useMemo(() => {
        return errors.reduce((acc, error) => {
            if (!error.field) return acc;
            if (!acc[error.field]) acc[error.field] = []
            acc[error.field].push(error)
            return acc;
        }, {} as Record<string, AppError[]>)
    }, [errors])


    const SEVERITY_WEIGHT = {
        high: 3,
        medium: 2,
        low: 1
    } as const;

    const getErrorForField = (fieldName: string) => {
        return errorByFiled[fieldName]?.sort((a, b) =>
            SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
        ) || []
    }

    const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const { value, type, name } = event.target
            const numericValue = Number(value)
            const valueTranform = type === "number" ? (isNaN(numericValue) ? 0 : numericValue) : value
            setFormData({ ...formData, [name]: valueTranform })

        } catch (error) {
            console.log(error)
        }
    }

    //necesito un button y validor los datos con zod
    const handleSendDataForm = (event: React.FormEvent) => {
        try {
            event.preventDefault()
            setErrors([])
            const resultSendData = formSchema.safeParse(formData)
            if (!resultSendData.success) {
                const errorTransform = handleZodError(resultSendData.error)
                setErrors(errorTransform)
                return console.log(errors)
            }
            
            console.log(resultSendData.data)
            const dataInJson = JSON.stringify(resultSendData.data, null, 2)
            alert(dataInJson)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form action="" method="get" className="form-container">

                <div  className="form-group">{/* seccion de name  */}
                    <input type="text" value={formData.name} name="name" onChange={handleValue} placeholder='Nombre' id="" />
                    {getErrorForField("name").map((error, index) => ((
                        <div  className={`error-message ${error.severity}`} key={index}>
                            <p> {error.message} </p>
                        </div>
                    )))}
                </div>

                <div  className="form-group">{/* seccion de email */}
                    <input type="email" name="email" value={formData.email} onChange={handleValue} placeholder='Email' id="" />
                    {getErrorForField("email").map((error, index) => ((
                        <div  className={`error-message ${error.severity}`} key={index}>
                            <p>{error.message}</p>
                        </div>
                    )))}
                </div>

                <div  className="form-group">{/* seccion de age */}
                    <input type="number" name="age" value={formData.age} onChange={handleValue} placeholder='Edad' id="" />
                    {getErrorForField("age").map((error, index) => ((
                        <div  className={`error-message ${error.severity}`} key={index} >
                            <p>{error.message}</p>
                        </div>
                    )))}
                </div>

                <button onClick={handleSendDataForm} type="submit">Enviar</button>
            </form>
        </div>
    )
}
