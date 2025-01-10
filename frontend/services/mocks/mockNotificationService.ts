import { INotificationService } from '../interfaces/INotificationService'
import { EventEmitter } from 'events'

const mockNotificationService: INotificationService = {
    subscribeToNotifications: () => {
        const emitter = new EventEmitter()
        setTimeout(() => {
            emitter.emit('message', {
                message: 'Mock notification',
                type: 'availability',
                timestamp: new Date()
            })
        }, 1000)
        return emitter
    },
    disconnect: async () => Promise.resolve()
}

export default mockNotificationService
