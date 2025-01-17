'use client'

import { useState } from 'react'
import MapWrapper from './MapWrapper'
import MarkerWithPopup from './MarkerWithPopup'
import { IClinic } from '../../services/interfaces/IClinic'
import { useGeolocation } from '@/hooks/useGeolocation'

interface MapProps {
    clinics: IClinic[]
}

const Map = ({ clinics }: MapProps) => {
    const [activeMarker, setActiveMarker] = useState<string | null>(null)
    const { position: center, zoom } = useGeolocation()

    return (
        <MapWrapper center={center} zoom={zoom}>
            {clinics?.map((clinic) => (
                <MarkerWithPopup
                    key={clinic._id}
                    id={clinic._id}
                    position={clinic.position}
                    name={clinic.name}
                    address={clinic.address}
                    phone={clinic.phone}
                    email={clinic.email}
                    isActive={activeMarker === clinic._id}
                    onOpen={() => setActiveMarker(clinic._id)}
                    onClose={() => setActiveMarker(null)}
                />
            ))}
        </MapWrapper>
    )
}

export default Map
