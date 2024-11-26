<template>
    <div class="calendar-container">
      <vue-cal
        :events="events"
        default-view="week"
        time="24"
        class="my-calendar"
        @event-click="onEventClick"
      />
    </div>
  </template>
  
  <script>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import mqtt from 'mqtt';
  
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Calendar',
    components: {
      VueCal,
    },
    data() {
      return {
        events: [],
        mqttClient: null,
      };
    },
    methods: {
      connectMqtt() {
        try {
          // Use a more robust connection configuration
          this.mqttClient = mqtt.connect('mqtt://localhost:1883', {
            clientId: `calendar_client_${Math.random().toString(16).slice(2)}`,
            clean: true,
            reconnectPeriod: 1000,
          });
  
          this.mqttClient.on('connect', () => {
            console.log('Connected to MQTT broker');
            this.mqttClient.subscribe('appointment/slots', (err) => {
              if (err) {
                console.error('Subscription error:', err);
              } else {
                console.log('Subscribed to appointment/slots');
              }
            });
          });
  
          this.mqttClient.on('message', (topic, message) => {
            if (topic === 'appointment/slots') {
              try {
                const slots = JSON.parse(message.toString());
                this.processSlots(slots);
              } catch (error) {
                console.error('Error parsing slots:', error);
              }
            }
          });
  
          this.mqttClient.on('error', (err) => {
            console.error('MQTT Connection Error:', err);
          });
  
        } catch (error) {
          console.error('MQTT Connection Setup Error:', error);
        }
      },
  
      processSlots(slots) {
        // More robust event mapping
        this.events = slots.map((slot) => ({
          id: slot.id, // Add unique identifier
          title: slot.status === 'available' 
            ? 'Available Slot' 
            : `Booked by ${slot.patientName || 'Unknown'}`,
          start: new Date(slot.startTime),
          end: new Date(slot.endTime),
          status: slot.status,
          color: slot.status === 'available' 
            ? '#4CAF50'  // Green for available
            : '#F44336', // Red for booked
          // Optional: Add more metadata
          rawSlot: slot
        }));
      },
  
      onEventClick(event) {
        if (event.status === 'available') {
          // Logic for booking an available slot
          this.bookSlot(event);
        } else {
          // Show details of a booked slot
          alert(`Slot Details:\n${JSON.stringify(event.rawSlot, null, 2)}`);
        }
      },
  
      bookSlot(slot) {
        // Implement booking logic
        // You might want to publish to another MQTT topic
        if (this.mqttClient) {
          this.mqttClient.publish('appointment/book', JSON.stringify({
            slotId: slot.id,
            // Add any additional booking information
          }));
        }
      }
    },
    mounted() {
      this.connectMqtt();
    },
    beforeUnmount() {
      // Properly disconnect and clean up
      if (this.mqttClient) {
        this.mqttClient.end(true, () => {
          console.log('MQTT client disconnected');
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .calendar-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .my-calendar {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 16px;
  }
  </style>