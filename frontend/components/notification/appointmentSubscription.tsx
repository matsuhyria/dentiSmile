import { useSubscription } from '@/hooks/useSubscription';
import { useEffect } from 'react';

const AppointmentSubscription = ({ clinicId, patientId, date }: { clinicId: string; patientId: string; date: Date; }) => {
    const { isLoading, error, subscriptionResponse, subscribeToDate, resetResponse } = useSubscription();

    const handleSubscribe = async () => {
        await subscribeToDate(clinicId, patientId, date);
    };

    useEffect(() => {
        resetResponse();
    }, [clinicId, patientId, date, resetResponse]);

    return (
        <div>
            <h2>Subscribe to future appointments on this day</h2>
            <button onClick={handleSubscribe} disabled={isLoading}>
                {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>

            {error && <div style={{ color: 'red' }}>{error}</div>}
            {subscriptionResponse && (
                <div>
                    <h3>Subscription Successful!</h3>
                </div>
            )}
        </div>
    );
};

export default AppointmentSubscription;
