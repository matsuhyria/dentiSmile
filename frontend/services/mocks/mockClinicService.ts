import { IClinicDetails } from '../interfaces/IClinicDetails'
import { BaseClinicService } from '../BaseClinicService'
import { IClinicService } from '../interfaces/IClinicService'
import { IClinic } from '../interfaces/IClinic'

class mockClinicService extends BaseClinicService implements IClinicService {
    constructor() {
        super(null)
        console.log('[MOCK] Initializing clinic service')
    }

    protected setupSubscriptions(): void {
        // No-op for mock
    }

    async getClinics(): Promise<{ data: IClinic[]; error?: string }> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return {
            data: [
                {
                    _id: '1',
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
                    _id: '2',
                    name: 'Mock Clinic Two',
                    address: {
                        line1: '456 Example Road',
                        line2: 'Townsville'
                    },
                    phone: '987-654-3210',
                    email: 'kontakt@clinictwo.se',
                    position: [57.7078, 11.933002]
                },
                {
                    _id: '3',
                    name: 'Mock Clinic Stockholm',
                    address: {
                        line1: '456 Example Road',
                        line2: 'Townsville'
                    },
                    phone: '987-654-3210',
                    email: 'kontakt@clinicsto.se',
                    position: [59.3358583, 18.0599686]
                }
            ]
        }
    }

    async getClinicDetails(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): Promise<{ data: IClinicDetails; error?: string }> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return {
            data: {
                id: clinicId,
                name: 'Mock Clinic One',
                availability: ['9:00', '9:30', '10:00']
            }
        }
    }

    async disconnect(): Promise<void> {
        console.log('[MOCK] Disconnecting clinic service')
        return
    }
}

export default mockClinicService
