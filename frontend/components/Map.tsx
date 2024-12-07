'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { type LatLngTuple } from 'leaflet';
import { Mail, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { SetStateAction, useState } from 'react';
import Link from 'next/link';

interface MapProps {
    onLocationSelect: (location: { lat: number; lng: number }) => void;
}

const Map = () => {
    const position: LatLngTuple = [57.72634, 12.007868];

    const [activeMarker, setActiveMarker] = useState<number | null>(null);

    interface MarkerData {
        id: number;
        position: LatLngTuple;
        name: string;
        address: {
            line1: string;
            line2: string;
        };
        phone: string;
        emailAdresss: string;
    }

    const markers: MarkerData[] = [
        {
            id: 1,
            position: [57.72634, 12.007868],
            name: 'Cool Dentist',
            address: {
                line1: 'Byfogdegatan 3',
                line2: '415 05 Göteborg'
            },
            phone: '031-123456',
            emailAdresss: 'kontakt@cooldentist.se'
        },
        {
            id: 2,
            position: [57.22634, 12.007868],
            name: 'Another Cool Dentist',
            address: {
                line1: 'Byfogdegatan 3',
                line2: '415 05 Göteborg'
            },
            phone: '031-123456',
            emailAdresss: 'kontakt@cooldentist.se'
        },
        {
            id: 3,
            position: [57.72604, 12.010968],
            name: 'Yet, Another Cool Dentist',
            address: {
                line1: 'Byfogdegatan 3',
                line2: '415 05 Göteborg'
            },
            phone: '031-123456',
            emailAdresss: 'kontakt@cooldentist.se'
        }
    ];

    // const [selectedPosition, setSelectedPosition] = useState<{
    //     lat: number
    //     lng: number
    // } | null>(null)

    // const handleMapClick = (e: LeafletMouseEvent) => {
    //     const { lat, lng } = e.latlng
    //     setSelectedPosition({ lat, lng })
    //     onLocationSelect({ lat, lng })
    // }

    const defaultIcon = L.icon({
        iconUrl: 'marker-icon-2x.png',
        shadowUrl: 'marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    const clickedIcon = L.icon({
        ...defaultIcon.options,
        iconUrl: 'marker-icon-2x-red.png'
    });

    return (
        <MapContainer
            center={position}
            zoom={16}
            scrollWheelZoom={false}
            style={{ height: '86vh' }}
            minZoom={13}
            maxBounds={[
                [57.0, 11.4],
                [58.5, 12.5]
            ]}
            attributionControl={false}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={
                        activeMarker === marker.id ? clickedIcon : defaultIcon
                    }
                    eventHandlers={{
                        popupopen: () => setActiveMarker(marker.id),
                        popupclose: () => setActiveMarker(null)
                    }}
                >
                    <Popup offset={[0, -30]}>
                        <h2 className="text-xl">Cool Dentist</h2>
                        <address className="text-gray-600 my-2">
                            <span>{marker.address.line1}</span>
                            <br />
                            <span>{marker.address.line2}</span>
                        </address>
                        <ul className="my-4">
                            <li>
                                <span className="flex gap-2 whitespace-nowrap font-semibold mb-1">
                                    <Phone size="16" />
                                    {marker.phone}
                                </span>
                            </li>
                            <li>
                                <span className="flex gap-2 whitespace-nowrap font-semibold">
                                    <Mail size="16" />
                                    {marker.emailAdresss}
                                </span>
                            </li>
                        </ul>
                        <Button asChild className="w-full mt-2 px-16 uppercase !text-white">
                            <Link
                                href={`/book-appointment/${marker.id}`}
                            >
                                Book an appointment
                            </Link>
                        </Button>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
