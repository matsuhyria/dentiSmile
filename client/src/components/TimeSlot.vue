<template>
    <button class="time-slot" :disabled="slot.status !== 'available'" @click="bookSlot">
      {{ slot.startTime }} - {{ slot.endTime }}
      <span v-if="slot.status !== 'available'">({{ slot.status }})</span>
    </button>
  </template>
  
  <script>
  export default {
    props: ['slot'],
    methods: {
      bookSlot() {
        this.$emit('book', this.slot._id);
      },
    },
  };
  </script>
  
  <style>
  .time-slot {
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    cursor: pointer;
    background-color: black;
  }
  .time-slot:disabled {
    background-color: black;
    cursor: not-allowed;
  }
  </style>
  