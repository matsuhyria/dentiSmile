import { IClinic } from './IClinic'
import { IAppointment } from './IAppointment'

export interface IClinicService {
    getClinics(): Promise<{ error?: string; data?: IClinic[] }>
    getClinicAppointments(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): Promise<{ error?: string; data?: IAppointment[] }>
    disconnect(): Promise<void>
}
