import { useState } from 'react';

interface RegisterFormProps {
    onSubmit: (formData: { email: string; password: string }) => void
    isSubmitting: boolean;
}

function RegisterForm({ onSubmit, isSubmitting }: RegisterFormProps) {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== repeatPassword) {
            setPasswordError('Passwords do not match');
            return;
        } else {
            setPasswordError('');
        }

        const formData = {
            email,
            password
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Fullname"
                required
                className="w-full px-4 py-2 rounded placeholder-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
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
            <input
                type="password"
                name="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Repeat Password"
                required
                className="w-full px-4 py-2 rounded placeholder-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-8 mt-4 text-blue-900 bg-white rounded-full font-semibold hover:bg-gray-200 mx-auto block"
            >
                {isSubmitting ? 'Signing in' : 'Sign in'}
            </button>
        </form>
    );
};

export default RegisterForm;