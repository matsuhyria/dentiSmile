'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/hooks/useNotification'

export default function AccountButton() {
    const router = useRouter()
    useNotification(localStorage.getItem('userId'))

    const handleAccountClick = (e: React.MouseEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('authToken')
        router.push(token ? '/account' : '/register')
    }

    return (
        <Link
            href="/account"
            onClick={handleAccountClick}
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
        >
            <User size={24} />
        </Link>
    )
}
