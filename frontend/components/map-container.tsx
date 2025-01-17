'use client'

import { LoaderCircle } from 'lucide-react'
import Map from '@/components/map'
import { useClinics } from '@/hooks/useClinics'
import { useState, useEffect } from 'react'

export default function MapContainer() {
    const { clinics, loading, error } = useClinics()
    const [componentLoaded, setComponentLoaded] = useState(false)

    useEffect(() => {
        setComponentLoaded(true)
    }, [])

    if (loading) {
        return (
            componentLoaded && (
                <div className="flex items-center justify-center w-full">
                    <LoaderCircle className="animate-spin" />
                </div>
            )
        )
    }

    if (error) return <div>Error: {error.message}</div>

    return componentLoaded && <Map clinics={clinics} />
}
