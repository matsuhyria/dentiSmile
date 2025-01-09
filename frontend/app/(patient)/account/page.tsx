import { Suspense } from 'react'
import { AppointmentsList } from '@/components/account/appointments-list'
import { AppointmentsLoading } from '@/components/account/appointments-loading'
import { LogoutButton } from '@/components/account/logout-button'

export default function AccountPage() {
    return (
        <div className="container mx-auto py-10">
            <div className='flex justify-between items-center mb-6'>
                <h1 className="text-3xl font-bold mb-6">Your Account</h1>
                <LogoutButton />
            </div>

            <Suspense fallback={<AppointmentsLoading />}>
                <AppointmentsList />
            </Suspense>
        </div>
    )
}
