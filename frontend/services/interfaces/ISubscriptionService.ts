import EventEmitter from "events";

export interface ISubscriptionService {
    createSubscription(clinicId: string, patientId: string, date: Date): EventEmitter;
}