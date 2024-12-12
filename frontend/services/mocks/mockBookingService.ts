import { BookingService } from '../BookingService';
import { IAppointment } from '../interfaces/IAppointment';

export class mockBookingService extends BookingService {
    async requestAppointment(
        clinicId: string,
        reasonId: string,
        date: string,
        slot: string
    ): Promise<{ error?: string; data?: IAppointment }> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
            data: {
                appointmentId: 'mock_appointment_123',
                status: 'confirmed',
                clinicId,
                reasonId,
                date,
                slot
            }
        };
    }

    async disconnect(): Promise<void> {
        console.log('[MOCK] Disconnecting booking service');
        return;
    }

    protected setupSubscriptions(): void {
        // No-op for mock service
    }
}
