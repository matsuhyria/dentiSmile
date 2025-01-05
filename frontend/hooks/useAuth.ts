import { useState, useEffect, useCallback } from 'react'
import { AuthData, AuthService } from '@/services/AuthService'
import { MQTTService } from '@/services/base/MQTTService'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
    const router = useRouter()
    const [authService, setAuthService] = useState<AuthService | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)
    const [authData, setAuthData] = useState<AuthData | null>(null)

    useEffect(() => {
        if (authData?.token) {
            localStorage.setItem('authToken', authData.token)
            localStorage.setItem('userId', authData.userId)
            router.push('/')
        }
    }, [authData, router])

    useEffect(() => {
        const initAuthService = async () => {
            try {
                const client = await MQTTService.getClient()
                const service = new AuthService(client)
                setAuthService(service)
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error
                        : new Error('Failed to initialize auth service')
                )
            }
        }
        initAuthService()
    }, []) // run once when component mounts

    const register = useCallback(
        async (email: string, password: string) => {
            setLoading(true)
            setError(null)

            try {
                const authData = await authService.register(email, password)
                if (authData?.token) {
                    setAuthData(authData)
                }
                setError(null)
            } catch (error) {
                let errorMessage = 'Failed to register. Please try again.';

                if (error instanceof Error) {
                    if (error.message.includes('Invalid credentials')) {
                        errorMessage = 'Incorrect email or password. Please try again.';
                    }
                }

                setError(new Error(errorMessage));
            } finally {
                setLoading(false)
            }
        },
        [authService]
    )

    const login = useCallback(
        async (email: string, password: string) => {
            setLoading(true)
            setError(null)

            try {
                const authData = await authService.login(email, password)
                if (authData?.token) {
                    setAuthData(authData)
                }
                setError(null)
            } catch (error) {
                let errorMessage = 'Failed to login. Please try again.';

                if (error instanceof Error) {
                    if (error.message.includes('Invalid credentials')) {
                        errorMessage = 'Incorrect email or password. Please try again.';
                    }
                }

                setError(new Error(errorMessage));
            } finally {
                setLoading(false)
            }
        },
        [authService]
    )

    // TO-DO: logout functionality or token refresh if needed.

    return {
        loading,
        error,
        register,
        login
    }
}
