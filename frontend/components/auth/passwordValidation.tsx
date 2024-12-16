import { useState } from 'react';

const PasswordValidationForm = () => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    // Validate the password strength
    const validatePassword = (password: string) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long.';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter.';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter.';
        }
        if (!hasNumbers) {
            return 'Password must contain at least one number.';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character.';
        }
        return '';
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password
        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        } else {
            setPasswordError('');
        }

        // Check if passwords match
        if (password !== repeatPassword) {
            setPasswordMatchError('Passwords do not match.');
            return;
        } else {
            setPasswordMatchError('');
        }

        // If validation passes, handle form submission logic here
        alert('Form Submitted Successfully');
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Password field */}
            <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-2 rounded placeholder-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>} {/* Password error message */}

            {/* Repeat Password field */}
            <input
                type="password"
                name="repeatPassword"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Repeat Password"
                required
                className="w-full px-4 py-2 rounded placeholder-blue-300 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {passwordMatchError && <p className="text-red-500 text-xs">{passwordMatchError}</p>} {/* Password match error message */}

            {/* Submit button */}
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-4">
                Submit
            </button>
        </form>
    );
};

export default PasswordValidationForm;