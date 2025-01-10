import { LogoutButton } from '@/components/account/logout-button'

export default function Layout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className='container mx-auto py-10 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6">Your Account</h1>
                <LogoutButton />
            </div>
            {children}
        </div>
    )
}
