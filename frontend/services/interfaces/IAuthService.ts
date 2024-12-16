export interface IAuthService {
    register(
        email: string,
        password: string,
    ): Promise<{ status: { code: number; message: string }; token?: string }>;

    login(
        email: string,
        password: string
    ): Promise<{ status: { code: number, message: string }; token?: string }>;

    disconnect(): Promise<void>;
}