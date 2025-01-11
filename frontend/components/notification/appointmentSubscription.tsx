import { Button } from '../ui/button'
import { useAppointmentSubscription } from '@/hooks/useAppointmentSubscription'
import { useEffect, useState } from 'react'

const AppointmentSubscription = ({
    clinicId,
    date
}: {
    clinicId: string
    date: Date
}) => {
    const { isLoading, error, subscribeToDate } = useAppointmentSubscription()
    const [responseMessage, setResponseMessage] = useState<string | null>(null)

    const handleSubscribe = async () => {
        const patientId = localStorage.getItem('userId')

        setResponseMessage(null)
        if (!patientId) {
            setResponseMessage('Please log in to subscribe.')
            return
        }
        const { success } = await subscribeToDate(clinicId, patientId, date)

        if (success) {
            setResponseMessage('Subscription successful!')
        } else {
            setResponseMessage('An error occured while subscribing!')
        }
    }

    useEffect(() => {
        setResponseMessage(null)
    }, [clinicId, date])

    return (
        <>
            <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                variant="link"
                className="px-1 font-bold"
            >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
            to future appointments on this day.
            <div>
                {responseMessage && (
                    <div
                        style={{
                            color: error ? 'red' : 'green'
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
