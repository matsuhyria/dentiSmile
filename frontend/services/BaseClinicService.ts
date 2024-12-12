import { IClinicDetails } from "./interfaces/IClinicDetails";
import { IClinicService } from "./interfaces/IClinicService";

export abstract class BaseClinicService implements IClinicService {
    protected client: any;
    protected detailsCallbacks: Map<string, (result: any) => void>;

    constructor(client?: any) {
        this.client = client;
        this.detailsCallbacks = new Map();
        this.setupSubscriptions();
    }

    protected abstract setupSubscriptions(): void;
    public abstract getClinics(): Promise<{
        error?: string;
        data?: IClinicDetails[];
    }>;
    public abstract getClinicDetails(
        clinicId: string,
        reasonId?: string,
        date?: string
    ): Promise<{ error?: string; data?: IClinicDetails }>;
    public abstract disconnect(): Promise<void>;
}
