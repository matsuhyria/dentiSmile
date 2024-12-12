import { Marker, Popup } from 'react-leaflet';
import { Phone, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import L, { LatLngTuple } from 'leaflet';

interface MarkerWithPopupProps {
    id: string;
    position: LatLngTuple;
    name: string;
    address: {
        line1: string;
        line2: string;
    };
    phone: string;
    email: string;
    isActive: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const MarkerWithPopup = ({
    id,
    position,
    name,
    address,
    phone,
    email,
    isActive,
    onOpen,
    onClose
}: MarkerWithPopupProps) => {
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
        <Marker
            position={position}
            icon={isActive ? clickedIcon : defaultIcon}
            eventHandlers={{
                popupopen: onOpen,
                popupclose: onClose
            }}
        >
            <Popup offset={[0, -30]}>
                <h2 className="text-xl">{name}</h2>
                <address className="text-gray-600 my-2">
                    <span>{address.line1}</span>
                    <br />
                    <span>{address.line2}</span>
                </address>
                <ul className="my-4">
                    <li>
                        <span className="flex gap-2 whitespace-nowrap font-semibold mb-1">
                            <Phone size="16" />
                            {phone}
                        </span>
                    </li>
                    <li>
                        <span className="flex gap-2 whitespace-nowrap font-semibold">
                            <Mail size="16" />
                            {email}
                        </span>
                    </li>
                </ul>
                <Button
                    asChild
                    className="w-full mt-2 px-16 uppercase !text-white"
                >
                    <Link href={`/book-appointment/${id}`}>
                        Book an appointment
                    </Link>
                </Button>
            </Popup>
        </Marker>
    );
};

export default MarkerWithPopup;
