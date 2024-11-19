<template>
    <div class="appointment-booking">
      <h1>Book an Appointment</h1>
      <vue-cal
        class="calendar"
        :time="true"
        :events="events" 
        @cell-click="fetchSlots"
        events-color="blue"
      ></vue-cal>
  
      <div v-if="slots.length" class="slots-container">
        <h2>Available Slots for {{ selectedDate }}</h2>
        <div class="time-slots">
          <TimeSlot
            v-for="slot in slots"
            :key="slot._id"
            :slot="slot"
            @book="bookSlot" 
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import axios from 'axios';
  import TimeSlot from './TimeSlot.vue';
  
  export default {
    components: { VueCal, TimeSlot },
    data() {
      return {
        selectedDate: null,
        slots: [],
        events: []
      };
    },
    mounted() {
      this.fetchAllSlots(); 
    },
    methods: {
      async fetchAllSlots() {
        try {
          const response = await axios.get('http://localhost:5000/api/v1/appointments');
          this.slots = response.data.slots;
  
          this.events = this.slots.map(slot => ({
            start: slot.startTime, 
            end: slot.endTime,
            title: slot.status === 'available' ? 'Available Slot' : 'Booked',
            id: slot._id
          }));
        } catch (error) {
          console.error('Error fetching slots:', error);
        }
      },
  
      async fetchSlots(date) {
        this.selectedDate = date.date;
        try {
          const response = await axios.get('/api/v1/slots/available', {
            params: { date: this.selectedDate },
          });
          this.slots = response.data;
        } catch (error) {
          console.error('Error fetching slots:', error);
        }
      },
  
      async bookSlot(slotId) {
        try {
          const response = await axios.post(`http://localhost:5000/api/v1/appointments/${slotId}/bookings`, {
            patientId: 'patient-id-123', 
          });
          alert(response.data.message);
  
          // Refresh slots and events after booking
          this.fetchAllSlots();
        } catch (error) {
          alert('Error booking slot: ' + (error.response?.data?.message || error.message));
        }
      },
    },
  };
  </script>
  