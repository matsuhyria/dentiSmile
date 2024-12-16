'use client'

import { redirect, RedirectType } from 'next/navigation';
import { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import LoginForm from '@/components/login/loginForm';
import { useAuth } from '@/hooks/useAuth';


export default function Login() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, loading, error, token } = useAuth();

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
            redirect('/', RedirectType.push);
        }
    }, [token]);

    const handleSubmit = async (formData: { email: string; password: string }) => {
        setIsSubmitting(true);

        try {
            const { email, password } = formData;
            await login(email, password);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-main-blue">
            <div className="w-full max-w-lg p-8 bg-transparent-blue rounded-lg shadow-lg">
                <div className="flex flex-col items-center mb-8">
                    <Image
                        src="/logo.svg"
                        alt="DentiSmile Logo"
                        width={150}
                        height={75}
                        priority
                    />
                </div>
                <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                {error && <p className="mt-4 text-red-500 text-center">{error.message}</p>}
                <p className="mt-4 text-center text-blue-900">
                    Dont have an account?{" "}
                    <Link href="/register" className="font-semibold text-blue-900">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}