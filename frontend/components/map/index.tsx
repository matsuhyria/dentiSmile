'use client';

import { useState } from 'react';
import MapContainer from './MapContainer';
import MarkerWithPopup from './MarkerWithPopup';
import { IClinicDetails } from '@/services/interfaces/IClinicDetails';

interface MapProps {
    clinics: IClinicDetails[];
    center: [number, number];
    zoom: number;
}

const Map = ({ clinics, center, zoom }: MapProps) => {
    const [activeMarker, setActiveMarker] = useState<string | null>(null);

    return (
        <MapContainer center={center} zoom={zoom}>
            {clinics?.map((clinic) => (
                <MarkerWithPopup
                    key={clinic.id}
                    id={clinic.id}
                    position={clinic.position}
                    name={clinic.name}
                    address={clinic.address}
                    phone={clinic.phone}
                    email={clinic.email}
                    isActive={activeMarker === clinic.id}
                    onOpen={() => setActiveMarker(clinic.id)}
                    onClose={() => setActiveMarker(null)}
                />
            ))}
        </MapContainer>
    );
};

export default Map;
