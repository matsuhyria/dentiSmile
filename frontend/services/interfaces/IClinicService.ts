import { EventEmitter } from 'events'

export interface IClinicService {
    getClinics(): EventEmitter
    getClinicAppointments(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): EventEmitter
    disconnect(): Promise<void>
}
