'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

function RegisterForm() {
    const router = useRouter()

    const [passwordError, setPasswordError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { register, loading, error, token } = useAuth()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setPasswordError('')
        setIsSubmitting(true)

        const formData = new FormData(event.currentTarget)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match')
            setIsSubmitting(false)
            return
        }

        try {
            await register(
                formData.get('email')?.toString() || '',
                formData.get('password').toString()
            )
            if (token) {
                localStorage.setItem('authToken', token)
                router.push('/')
            }
        } catch (error) {
            setPasswordError('An unexpected error occurred')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Create a password"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Confirm your password"
                />
            </div>

            {(error || passwordError) && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error ? error.message : passwordError}
                    </AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loading}
            >
                Register
            </Button>
        </form>
    )
}

export default RegisterForm
