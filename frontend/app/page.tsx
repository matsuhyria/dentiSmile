'use client'

import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import Map from '@/components/map'
import { useClinics } from '@/hooks/useClinics'

export default function Home() {
    const { clinics, loading, error } = useClinics()
    const [position, setPosition] = useState<[number, number] | null>(null) // Default to Sweden
    const [zoom, setZoom] = useState<number>(8)

    useEffect(() => {
        const savedPosition = sessionStorage.getItem('userPosition')

        if (savedPosition) {
            const [lat, lng] = JSON.parse(savedPosition)
            setPosition([lat, lng])
            setZoom(15)
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const newPosition: [number, number] = [
                        pos.coords.latitude,
                        pos.coords.longitude
                    ]
                    setPosition(newPosition)
                    setZoom(15)
                    sessionStorage.setItem(
                        'userPosition',
                        JSON.stringify(newPosition)
                    )
                },
                () => {
                    setPosition([60, 12])
                }
            )
        }
    }, [])

    if (loading) return <main className="flex items-center justify-center w-full"><LoaderCircle className="animate-spin" /></main>

    if (error) return <div>Error: {error.message}</div>

    return (
        <main className="w-full">
            <div className="flex flex-col items-center">
                <h1 className="font-semibold my-4">
                    Select a Dentist Location
                </h1>
            </div>
            {position && (
                <Map clinics={clinics} center={position} zoom={zoom} />
            )}
        </main>
    )
}
