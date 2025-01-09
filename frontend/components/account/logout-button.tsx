'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type LogoutEvent = React.MouseEvent<HTMLButtonElement>

export function LogoutButton() {
    const router = useRouter()

    const logout = (event: LogoutEvent): void => {
        event.preventDefault()
        localStorage.removeItem('authToken')
        localStorage.removeItem('userId')
        router.replace('/')
    }

    return <Button onClick={logout}>Logout</Button>
}
