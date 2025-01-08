import { useState, useEffect, useCallback } from 'react'
import { AuthData, AuthService } from '@/services/AuthService'
import { useRouter } from 'next/navigation'
import { useMQTTService } from './useMQTTService'

export const useAuth = () => {
    const router = useRouter()
    const { service: authService, error: serviceError } = useMQTTService(
        AuthService,
        null // or a mock service if available
    )
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(serviceError)
    const [authData, setAuthData] = useState<AuthData | null>(null)

    useEffect(() => {
        if (authData?.token) {
            localStorage.setItem('authToken', authData.token)
            localStorage.setItem('userId', authData.userId)
            router.push('/')
        }
    }, [authData, router])

    const register = useCallback(
        async (email: string, password: string) => {
            setLoading(true)
            setError(null)

            if (!authService) {
                setError(new Error('Auth service not initialized'))
                setLoading(false)
                return
            }

            try {
                const authData = await new Promise<AuthData>((resolve, reject) => {
                    const emitter = authService.register(email, password)

                    const onData = (data: AuthData) => {
                        resolve(data)
                        cleanup()
                    }

                    const onError = (err: Error) => {
                        reject(err)
                        cleanup()
                    }

                    const cleanup = () => {
                        emitter.removeListener('data', onData)
                        emitter.removeListener('error', onError)
                    }

                    emitter.on('data', onData)
                    emitter.on('error', onError)
                })

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

            if (!authService) {
                setError(new Error('Auth service not initialized'))
                setLoading(false)
                return
            }

            try {
                const authData = await new Promise<AuthData>((resolve, reject) => {
                    const emitter = authService.login(email, password)

                    const onData = (data: AuthData) => {
                        resolve(data)
                        cleanup()
                    }

                    const onError = (err: Error) => {
                        reject(err)
                        cleanup()
                    }

                    const cleanup = () => {
                        emitter.removeListener('data', onData)
                        emitter.removeListener('error', onError)
                    }

                    emitter.on('data', onData)
                    emitter.on('error', onError)
                })

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
