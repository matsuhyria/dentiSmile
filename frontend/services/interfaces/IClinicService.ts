import { IClinicDetails } from '@/services/interfaces/IClinicDetails'
import { IClinic } from './IClinic'

export interface IClinicService {
    getClinics(): Promise<{ error?: string; data?: IClinic[] }>
    getClinicDetails(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): Promise<{ error?: string; data?: IClinicDetails }>
    disconnect(): Promise<void>
}
