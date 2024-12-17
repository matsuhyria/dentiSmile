'use client'

import RegisterForm from '@/components/auth/registerForm'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

export default function Register() {
    return (
        <div className="w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white justify-self-start">
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
                            Create your account
                        </CardTitle>
                        <CardDescription className="text-center">
                            Join DentiSmile and start your dental journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RegisterForm />
                    </CardContent>
                </Card>

                <p className="text-center">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
