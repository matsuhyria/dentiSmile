/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseClinicService } from '../BaseClinicService'
import { IClinicService } from '../interfaces/IClinicService'
import { IClinic } from '../interfaces/IClinic'
import { IAppointment } from '@/services/interfaces/IAppointment'

class MockClinicService extends BaseClinicService implements IClinicService {
    constructor() {
        super(null)
        console.log('[MOCK] Initializing clinic service')
    }

    async getClinics(): Promise<{ data: IClinic[] }> {
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

    async getClinicAppointments(
        clinicId: string
    ): Promise<{ data: IAppointment[] }> {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return {
            data: [
                {
                    _id: '675f0c5688ae1c7ec8cc58fd',
                    clinicName: 'Mock clinic one',
                    clinicId: '675dced728e6de00811c0b42',
                    dentistId: '64f1c9a9c7f35b2e4e4d5d1e',
                    patientId: null,
                    startTime: '2024-12-19T10:00:00.000Z',
                    endTime: '2024-12-19T11:00:00.000Z',
                    status: 'available'
                },
                {
                    _id: '675f0c7888ae1c7ec8cc5900',
                    clinicName: 'Mock Clinic One',
                    clinicId: '675dced728e6de00811c0b42',
                    dentistId: '64f1c9a9c7f35b2e4e4d5d1e',
                    patientId: null,
                    startTime: '2024-12-29T13:00:00.000Z',
                    endTime: '2024-12-29T15:00:00.000Z',
                    status: 'available'
                }
            ]
        }
    }

    async disconnect(): Promise<void> {
        console.log('[MOCK] Disconnecting clinic service')
        return Promise.resolve()
    }
}

export default MockClinicService
