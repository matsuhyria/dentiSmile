<template>
  <div>
    <h1>MQTT Connection</h1>
    <p>Connection Status: {{ connectionStatus }}</p>
    <div v-if="slots.length">
      <h2>Available Slots:</h2>
      <ul>
        <li v-for="slot in slots" :key="slot._id">
          Dentist: {{ slot.dentistId }} | 
          Status: {{ slot.status }} | 
          Time: {{ formatTime(slot.startTime) }}
        </li>
      </ul>
    </div>
    <pre v-if="debugMode">{{ debugInfo }}</pre>
  </div>
</template>

<script>
import mqtt from 'mqtt';

export default {
  data() {
    return {
      client: null,
      slots: [],
      connectionStatus: 'Connecting...',
      debugMode: true,
      debugInfo: '',
      topic: 'appointment/slots'
    };
  },
  mounted() {
    this.connectToBroker();
  },
  methods: {
    formatTime(time) {
      return new Date(time).toLocaleString();
    },
    connectToBroker() {
      const brokerUrl = 'ws://localhost:9001';
      
      const options = {
        clientId: `vue_client_${Math.random().toString(16).slice(3)}`,
        clean: true,
        connectTimeout: 4000,
      };

      this.debugInfo += `Connecting to: ${brokerUrl}\n`;

      this.client = mqtt.connect(brokerUrl, options);

      this.client.on('connect', () => {
        this.connectionStatus = 'Connected';
        this.debugInfo += 'Successfully connected to broker\n';

        this.client.subscribe(this.topic, (err) => {
          if (err) {
            this.debugInfo += `Subscription error: ${err.message}\n`;
            this.connectionStatus = 'Subscription Failed';
          } else {
            this.debugInfo += `Subscribed to topic: ${this.topic}\n`;
            this.connectionStatus = 'Subscribed';
          }
        });
      });

      this.client.on('message', (topic, payload) => {
        try {
          const slots = JSON.parse(payload.toString());
          this.slots = slots;
          this.debugInfo += `Received ${slots.length} slots\n`;
        } catch (error) {
          this.debugInfo += `Error parsing message: ${error.message}\n`;
        }
      });

      this.client.on('error', (error) => {
        this.connectionStatus = 'Connection Error';
        this.debugInfo += `Connection error: ${error.message}\n`;
        console.error('MQTT Connection Error:', error);
      });
    }
  },
  beforeUnmount() {
    if (this.client) {
      this.client.end();
    }
  }
};
</script>