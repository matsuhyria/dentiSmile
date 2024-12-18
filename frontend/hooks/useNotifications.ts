import { useState, useEffect } from 'react'
import mqtt from 'shared-mqtt';
import { MQTT_BROKER_URL } from '@/lib/constants';
import { generateUniqueId } from '@/lib/utils';

const { connectMQTT, subscribe, unsubscribe } = mqtt;

const useNotifications = (topic) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const handleNotification = (message) => {
            const newNotification = {
                id: generateUniqueId(),
                message: message.notification,
            };

            setNotifications((prevNotifications) => {
                const isDuplicate = prevNotifications.some(
                    (notification) => notification.message === newNotification.message
                );
                if (isDuplicate) {
                    return prevNotifications;
                }
                return [newNotification, ...prevNotifications];
            });
        };

        const connectAndSubscribe = async () => {
            try {
                await connectMQTT(MQTT_BROKER_URL);

                await subscribe(topic, handleNotification);
                console.log(`useNotifications: Subscribed to topic: ${topic}`);
            } catch (error) {
                console.error("Error connecting to MQTT or subscribing to topic:", error);
            }
        };
        connectAndSubscribe();

        return () => {
            // (async () => {
            //     // clean up to avoid memory leak
            //     await unsubscribe(topic);
            // })();
        };
    }, [topic]);

    return notifications;
};

export default useNotifications;