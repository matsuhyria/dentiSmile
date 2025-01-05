'use client'

import LoginForm from '@/components/auth/loginForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export default function Login() {
    return (
        <div className="w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white justify-self-start ">
            <div className="flex flex-col w-full gap-6 items-center">
                <Image
                    src="/logo.svg"
                    alt="DentiSmile Logo"
                    width={200}
                    height={200}
                />
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome back
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>
                <p>
                    New to DentiSmile?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-primary hover:underline"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    )
}
