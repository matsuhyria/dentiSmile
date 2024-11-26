import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import connectDB from './config/db.js'
import appointmentRouter from './routes/appointmentRouter.js'
import {
    connectMQTT,
    publish,
    subscribe,
    disconnectMQTT,
} from '../../../mqtt/mqtt.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const PORT = process.env.PORT || 5000
const MQTT_URI = process.env.MQTT_URI || 'mqtt://localhost:1883'
const MQTT_OPTIONS = {
    clientId: 'appointmentService',
    reconnectPeriod: 2000,
    connectTimeout: 30 * 1000,
    clean: true
}

connectDB(MONGODB_URI)

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.options('*', cors())
app.use(cors())

app.get('/api/v1', (req, res) => {
    res.status(200).json({ message: 'Welcome to DentiSmile+ API v1!' })
})

app.use(appointmentRouter)

app.get('/api/v1/publish', async (req, res) => {
    //const { topic, message } = req.body;

    //if (!topic || !message) return res.status(400).json({ message: 'Topic and msg are required' });
    const topic = 'test'
    const message = 'Hello World'

    try {
        await publish(topic, message)
        disconnectMQTT()
        res.status(200).json({ message: 'Message published sucessfully' })
    } catch (error) {
        console.error('Error publishing message', error)
        res.status(500).json({ message: 'Failed to publish message' })
    }
})

app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'Server error.' })
})

const setupMQTT = async () => {
    try {
        console.log('Starting MQTT connection...')
        await connectMQTT(MQTT_URI, MQTT_OPTIONS)

        await subscribe('test', (message) => {
            console.log('Message received on /test', message)
        })
    } catch (error) {
        console.error('Error initializing MQTT', error)
    }
}

setupMQTT()

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app
