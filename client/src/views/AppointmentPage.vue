<script setup>
/* import { Api } from '@/Api';
 */</script>

<template>
    <div>
        <b-row>
            <b-col cols="12" md="8" class="clinicHeader">
                {{ dentist.clinic_location?.street }} {{ dentist.clinic_location?.zip }} {{ dentist.clinic_location?.city }} / {{ dentist.first_name }} {{ dentist.surname }}
            </b-col>
            <b-col cols="12" md="4" class="weekSelector">
                <button @click="decrementWeek">-</button>
                <em> Week {{ selectedWeekNumber }}, {{ selectedYear }} </em>
                <button @click="incrementWeek">+</button>
            </b-col>
            <b-col cols="12">
                <WeeklyTimeTable :appointments="appointments" :selectedWeek="selectedWeek" dentistId="1"></WeeklyTimeTable>
            </b-col>
        </b-row>
    </div>
</template>

<script>

export default {
    name: 'BookingPage',
    data() {
        return {
            appointments: [],
            dentist: Object,
            selectedWeek: new Date(),
        };
    },
    methods: {
        /* 
        async fetchDentist() {
            const dentist = this.$route.params.dentist;
            await Api.get(`/dentists/${dentist}`)
                .then((response) => {
                    this.dentist = response.data.dentist;
                })
                .catch((error) => {
                    console.log("Error fetching dentist: " + error);
                });
        }, */
        async fetchAppointments() {
          /*   const dentist = this.$route.params.dentist;
            await Api.get(`/dentists/${dentist}/appointments`)
                .then((response) => {
                    this.appointments = response.data.appointments;
                })
                .catch((error) => {
                    console.log("Error fetching appointments: " + error);
                });
 */
            // Fetch appointments for the selected week
            // Save result ot this.appointments
            console.log('fetching appointments');
        },
        incrementWeek() {
            console.log('incrementing week');
            this.selectedWeek = new Date(this.selectedWeek.setDate(this.selectedWeek.getDate() + 7));
            console.log(this.selectedWeek);
        },
        decrementWeek() {
            console.log('decrementing week');
            this.selectedWeek = new Date(this.selectedWeek.setDate(this.selectedWeek.getDate() - 7));
            console.log(this.selectedWeek);
        }
    },
    computed: {
        selectedWeekNumber() {
            const date = new Date(this.selectedWeek);
            const startOfYear = new Date(date.getFullYear(), 0, 1);
            const daysSinceStart = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
            return Math.floor(daysSinceStart / 7) + 1;
        },

        selectedYear() {
            return this.selectedWeek.getFullYear();
        }
    },
    watch: {
        selectedDate() {
            this.fetchAppointments();
        }
    },
    mounted() {
        this.fetchAppointments();
    },
  /*   const firstDayOfYear = new Date(this.selectedWeek.getFullYear(), 0, 1);
    const pastDaysOfYear = (this.selectedWeek - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);

 */
}
</script>

<style scoped></style>