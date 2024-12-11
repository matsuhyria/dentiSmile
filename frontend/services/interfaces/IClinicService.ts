import { IClinicDetails } from '@/services/interfaces/IClinicDetails';

export interface IClinicService {
    getClinics(): Promise<{ error?: string; data?: IClinicDetails[] }>;
    getClinicDetails(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): Promise<{ error?: string; data?: IClinicDetails }>;
    disconnect(): Promise<void>;
}
