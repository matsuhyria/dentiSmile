import { EventEmitter } from 'events'

export interface IAuthService {
    register(email: string, password: string): EventEmitter
    login(email: string, password: string): EventEmitter
    disconnect(): Promise<void>
}
