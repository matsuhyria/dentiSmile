import amqp from 'amqplib';

let channel, connection;

export const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect('amqp://localhost'); // Replace with your RabbitMQ URL
        channel = await connection.createChannel();
        console.log('RabbitMQ connected');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
    }
};

export const getChannel = () => channel;