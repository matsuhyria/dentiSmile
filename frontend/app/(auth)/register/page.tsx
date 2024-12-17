'use client'

import RegisterForm from '@/components/auth/registerForm'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from '@/components/ui/card'

export default function Register() {
    return (
        <div className="w-full flex items-center justify-center bg-background justify-self-start">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Create your account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Or{' '}
                        <a
                            href="/login"
                            className="font-medium text-primary hover:underline"
                        >
                            sign in to your existing account
                        </a>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
            </Card>
        </div>
    )
}
