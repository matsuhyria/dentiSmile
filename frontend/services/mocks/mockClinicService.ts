import { IClinicDetails } from '../interfaces/IClinicDetails';
import { BaseClinicService } from '../BaseClinicService';
import { IClinicService } from '../interfaces/IClinicService';

class mockClinicService extends BaseClinicService implements IClinicService {
    constructor() {
        super(null);
        console.log('[MOCK] Initializing clinic service');
    }

    protected setupSubscriptions(): void {
        // No-op for mock
    }

    async getClinics(): Promise<{ error?: string; data?: IClinicDetails[] }> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
            data: [
                {
                    id: '1',
                    name: 'Mock Clinic One',
                    address: {
                        line1: '123 Mock Street',
                        line2: 'Cityville'
                    },
                    phone: '123-456-7890',
                    email: 'kontakt@clinicone.se',
                    position: [57.70884, 11.934008]
                },
                {
                    id: '2',
                    name: 'Mock Clinic Two',
                    address: {
                        line1: '456 Example Road',
                        line2: 'Townsville'
                    },
                    phone: '987-654-3210',
                    email: 'kontakt@clinictwo.se',
                    position: [57.7078, 11.933002]
                }
            ]
        };
    }

    async getClinicDetails(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): Promise<{ error?: string; data?: IClinicDetails }> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return {
            data: {
                details: {
                    id: clinicId,
                    name: 'Mock Clinic One',
                    address: {
                        line1: '456 Example Road',
                        line2: 'Townsville'
                    },
                    phone: '987-654-3210',
                    email: '',
                    position: [57.22634, 12.007868]
                },
                availability: [
                    '9:00',
                    '9:30',
                    '10:00',
                ]
            }
        };
    }

    async disconnect(): Promise<void> {
        console.log('[MOCK] Disconnecting clinic service');
        return;
    }
}

export default mockClinicService;
