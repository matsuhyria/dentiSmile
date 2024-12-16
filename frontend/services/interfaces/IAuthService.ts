export interface IAuthService {
    register(
        email: string,
        password: string,
    ): Promise<{ token }>;

    login(
        email: string,
        password: string
    ): Promise<{ token }>;

    disconnect(): Promise<void>;
}