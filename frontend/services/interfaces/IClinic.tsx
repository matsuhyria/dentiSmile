'use client'

export interface IClinic {
    _id: string
    position: [number, number]
    name: string
    address: {
        line1: string
        line2: string
    }
    phone: string
    email: string
}
