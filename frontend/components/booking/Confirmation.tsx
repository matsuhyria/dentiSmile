import { Button } from '@/components/ui/button';

interface ConfirmationProps {
    isActive: boolean;
    reason: string;
    selectedDate: Date | null;
    selectedTime: Date | null;
    appointmentDuration: number;
    onConfirm: () => void;
}

function Confirmation({
    isActive,
    reason,
    selectedDate,
    selectedTime,
    appointmentDuration,
    onConfirm
}: ConfirmationProps) {
    if (!isActive) return null;

    return (
        <div className="border rounded-b-lg p-4">
            <h3 className="text-lg font-semibold mb-4">
                Confirm Your Appointment
            </h3>
            <div className="space-y-2 mb-4">
                <p>
                    <strong>Reason:</strong> {reason}
                </p>
                <p>
                    <strong>Date:</strong> {selectedDate?.toLocaleDateString()}
                </p>
                <p>
                    <strong>Time:</strong>{' '}
                    {selectedTime?.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: false
                    })}
                </p>
                <p>
                    <strong>Duration:</strong>{' '}
                    {appointmentDuration >= 60
                        ? `${Math.floor(appointmentDuration / 60)} hour${
                              Math.floor(appointmentDuration / 60) > 1
                                  ? 's'
                                  : ''
                          } ${
                              appointmentDuration % 60
                                  ? `and ${appointmentDuration % 60} minutes`
                                  : ''
                          }`
                        : `${appointmentDuration} minutes`}
                </p>
            </div>
            <Button className="" onClick={onConfirm}>
                Confirm Appointment
            </Button>
        </div>
    );
}

export default Confirmation;
