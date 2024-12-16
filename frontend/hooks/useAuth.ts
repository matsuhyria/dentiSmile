import { useState, useEffect, useCallback } from 'react'
import { AuthService } from '@/services/AuthService'
import { MQTTService } from '@/services/base/MQTTService'

export const useAuth = () => {
    const [authService, setAuthService] = useState<AuthService | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const initAuthService = async () => {
            try {
                const client = await MQTTService.getClient();
                const service = new AuthService(client);
                setAuthService(service);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error
                        : new Error('Failed to initialize auth service')
                );
            }
        }
        initAuthService();
    }, []) // run once when component mounts

    const register = useCallback(
        async (email: string, password: string) => {
            setLoading(true)
            setError(null)

            try {
                const response = await authService.register(email, password)
                if (response.token) {
                    setToken(response.token)
                }
                setError(null)
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error
                        : new Error('Failed to register')
                )
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
                const response = await authService.login(email, password)
                if (response.token) {
                    setToken(response.token)
                }
                setError(null)
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error
                        : new Error('Failed to login')
                )
            } finally {
                setLoading(false)
            }
        },
        [authService]
    )

    // TO-DO: logout functionality or token refresh if needed.

    return {
        token,
        loading,
        error,
        register,
        login,
    }
}
