import { LatLngTuple } from 'leaflet';

export interface Clinic {
    id: number;
    position: LatLngTuple;
    name: string;
    address: {
        line1: string;
        line2: string;
    };
    phone: string;
    email: string;
}

// Mock initial clinics data
let clinics: Clinic[] = [
    {
        id: 123,
        position: [57.7265, 12.008],
        name: 'Downtown Dental Clinic',
        address: { line1: 'Main St 12', line2: 'Gothenburg' },
        phone: '+46-31-123456',
        email: 'contact@downtowndental.se'
    },
    {
        id: 456,
        position: [57.727, 12.009],
        name: 'Central Smiles',
        address: { line1: 'Central St 45', line2: 'Gothenburg' },
        phone: '+46-31-654321',
        email: 'info@centralsmiles.se'
    }
];

// Subscription mechanism
type ClinicsListener = () => void;
const listeners: ClinicsListener[] = [];

export function getClinics(): Clinic[] {
    return clinics;
}

export function updateClinics(newClinics: Clinic[]) {
    clinics = newClinics;
    listeners.forEach((cb) => cb());
}

export function getClinicById(id: string) {
    return clinics.find((clinic) => clinic.id === parseInt(id));
}

export function subscribeClinics(listener: ClinicsListener) {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1) listeners.splice(index, 1);
    };
}
