'use client'

import { useState } from 'react'
import MapContainer from './MapContainer'
import MarkerWithPopup from './MarkerWithPopup'
import { IClinic } from '../../services/interfaces/IClinic'

interface MapProps {
    clinics: IClinic[]
    center: [number, number]
    zoom: number
}

const Map = ({ clinics, center, zoom }: MapProps) => {
    const [activeMarker, setActiveMarker] = useState<string | null>(null)

    return (
        <MapContainer center={center} zoom={zoom}>
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
        </MapContainer>
    )
}

export default Map
