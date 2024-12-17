'use client';

import { MapContainer as LeafletMapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapTile } from './MapTile';

interface MapContainerProps {
    children: React.ReactNode;
    center: [number, number];
    zoom: number;
}

const MapContainer = ({ children, center, zoom }: MapContainerProps) => (
    <LeafletMapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '90vh', zIndex: 1 }}
        maxBounds={[
            [55.02652, 10.54138],
            [69.06643, 24.22472]
        ]}
        minZoom={8}
        attributionControl={false}
    >
        <MapTile />
        {children}
    </LeafletMapContainer>
);

export default MapContainer;
