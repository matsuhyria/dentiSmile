export interface IClinicDetails {
    details: {
        id: string;
        position: [number, number];
        name: string;
        address: {
            line1: string;
            line2: string;
        };
        phone: string;
        email: string;
    };
    availability: string[];
}
