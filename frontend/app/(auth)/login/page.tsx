'use client'

import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
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
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();

                        if (e.target instanceof HTMLFormElement) {
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());
                            console.log(data);
                        }
                    }}
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="email"
                        required
                        className="w-full px-4 py-2 rounded placeholder-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        required
                        className="w-full px-4 py-2 rounded placeholder-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button
                        type="submit"
                        className="py-2 px-8 mt-4 text-blue-900 bg-white rounded-full font-semibold hover:bg-gray-200 mx-auto block"
                    >
                        Log in
                    </button>
                </form>
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