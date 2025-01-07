export interface SubscriptionResponse {
    status: {
        code: number;
        message: string;
    };
    data: {
        clinicId: string;
        patientId: string;
        _id: string;
        date: string;
    };
}

export interface ISubscriptionService {
    createSubscription(clinicId: string, patientId: string, date: Date): Promise<SubscriptionResponse>;
}