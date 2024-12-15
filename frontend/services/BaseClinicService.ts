/* eslint-disable @typescript-eslint/no-explicit-any */
import { IClinicService } from './interfaces/IClinicService'
import { IClinic } from './interfaces/IClinic'
import { IAppointment } from './interfaces/IAppointment'
import { RequestResponseManager } from '@/lib/RequestResponseManager'

export abstract class BaseClinicService implements IClinicService {
    protected client: any
    protected requestManager: RequestResponseManager<any>

    constructor(client: any) {
        this.client = client
        this.requestManager = new RequestResponseManager<any>()
    }

    public abstract getClinics(): Promise<{ data: IClinic[] }>

    public abstract getClinicAppointments(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): Promise<{ error?: string; data?: IAppointment[] }>

    public abstract disconnect(): Promise<void>
}
