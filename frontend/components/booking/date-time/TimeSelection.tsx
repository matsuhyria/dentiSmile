import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSelectionProps {
    setSelectedTime: (date: Date) => void;
    selectedTime: Date | null;
    disabled?: boolean;
    clinicId: string;
    appointmentDuration: number;
    availableTimes: string[]; // New prop to receive available times
}

export default function TimeSelectionComponent({
    appointmentDuration,
    setSelectedTime,
    selectedTime,
    disabled,
    availableTimes
}: TimeSelectionProps) {
    return (
        <>
            <h3 className="font-semibold mt-8">Select a time</h3>
            <p className="text-sm text-gray-500">
                The examination takes about {appointmentDuration} minutes.
            </p>
            {availableTimes.length > 0 ? (
                <ul className="grid grid-cols-3 gap-3 mt-5 text-center">
                    {availableTimes.map((timeStr) => (
                        <li
                            key={timeStr}
                            className={cn(
                                'border rounded-md cursor-pointer py-2 px-10',
                                selectedTime &&
                                    selectedTime.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) === timeStr
                                    ? 'bg-sky-200'
                                    : ''
                            )}
                            onClick={() => {
                                if (disabled) return;
                                // Convert timeStr like "09:00" to a Date object for selectedTime
                                const [hours, minutes] = timeStr
                                    .split(':')
                                    .map(Number);
                                const date = selectedTime
                                    ? new Date(selectedTime)
                                    : new Date();
                                date.setHours(hours, minutes, 0, 0);
                                setSelectedTime(date);
                            }}
                        >
                            {timeStr}
                        </li>
                    ))}
                </ul>
            ) : (
                <Alert className="mt-8 bg-sky-100">
                    <Info size={22} />
                    <AlertTitle className="mt-1">
                        No available times on this date
                    </AlertTitle>
                    <AlertDescription>Choose another date.</AlertDescription>
                </Alert>
            )}
        </>
    );
}
