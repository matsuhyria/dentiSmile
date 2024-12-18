import { Suspense } from 'react'
import { AppointmentsList } from '@/components/account/appointments-list'
import { AppointmentsLoading } from '@/components/account/appointments-loading'

export default function AccountPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Your Account</h1>
            <Suspense fallback={<AppointmentsLoading />}>
                <AppointmentsList />
            </Suspense>
        </div>
    )
}
