'use client';

import { TileLayer } from 'react-leaflet';

export const MapTile = () => {
    return (
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    );
};
