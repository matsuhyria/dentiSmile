import { Button } from '../ui/button';
import { useAppointmentSubscription } from '@/hooks/useAppointmentSubscription';
import { useEffect, useState } from 'react';

const AppointmentSubscription = ({ clinicId, patientId, date }: { clinicId: string; patientId: string; date: Date; }) => {
    const { isLoading, error, subscribeToDate } = useAppointmentSubscription();
    const [responseMessage, setResponseMessage] = useState<string | null>(null);

    const handleSubscribe = async () => {
        setResponseMessage(null);
        const { success } = await subscribeToDate(clinicId, patientId, date)

        if (success) {
            setResponseMessage('Subscription successful!')
        } else {
            setResponseMessage('An error occured while subscribing!')
        }
    };

    useEffect(() => {
        setResponseMessage(null);
    }, [clinicId, patientId, date])

    return (
        <>
            <p className="text-gray-600">
                <Button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    variant="link"
                >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
                to future appointments on this day.
            </p>
            <div>
                {responseMessage && (
                    <div
                        style={{
                            color: error ? 'red' : 'green',
                        }}
                    >
                        {responseMessage}
                    </div>
                )}
            </div>
        </>
    )
}

export default AppointmentSubscription
