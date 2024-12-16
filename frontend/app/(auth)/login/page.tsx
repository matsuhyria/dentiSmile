'use client'

import { useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import LoginForm from '@/components/login/loginForm';


export default function Login() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: { email: string; password: string }) => {
        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log('Form Submitted', formData);
            alert('Login successful');
        } catch (error) {
            console.error(error);
            alert('Login failed');
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