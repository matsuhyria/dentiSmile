import { useState } from 'react';

interface LoginFormProps {
    onSubmit: (formData: { email: string; password: string }) => void
    isSubmitting: boolean;
}

function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            email,
            password
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-2 rounded placeholder-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-2 rounded placeholder-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-8 mt-4 text-blue-900 bg-white rounded-full font-semibold hover:bg-gray-200 mx-auto block"
            >
                {isSubmitting ? 'Logging in' : 'Log in'}
            </button>
        </form>
    );
};

export default LoginForm;