<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
/* import { Api } from '../Api';
 */
const lat = ref(0)
const lng = ref(0)
const map = ref()
const mapContainer = ref()

onMounted(() => {
    map.value = L.map(mapContainer.value).setView([57.7, 12], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map.value);
});

function findLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lat.value = position.coords.latitude;
            lng.value = position.coords.longitude;
            map.value.setView([lat.value, lng.value], 14);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
</script>

<template>
    <div>
        <div ref="mapContainer" id="map"></div>
        <button @click="findLocation">Get my Location</button>
        <p>Latitude: {{ lat }}</p>
        <p>Longitude: {{ lng }}</p>
    </div>
</template>

<script>
export default {
    name: 'MapContainer',
    data() {
        return {
            dentists: [],
            clinicMarkers: new Map(),
        };
    },
    methods: {
        /* async fetchClinics() {
            await Api.get(`/dentists`)
                .then((response) => {
                    this.dentists = response.data.dentists;
                })
                .catch((error) => {
                    console.log("Error fetching dentists: " + error);
                });
            // Fetch clinics from the backend
            // Save result to this.dentists
        }, */
        createMarkers() {
            for (const dentist of this.dentists) {
                const clinic = dentist.clinic_location;
                var clinicMarker = L.marker([clinic.latitude, clinic.longitude]).addTo(this.map);
                this.createMarkerPopup(dentist, clinicMarker);
                this.clinicMarkers.set(dentist, clinicMarker);
            }
        },
        createMarkerPopup(dentist, clinicMarker) {
            clinicMarker.bindPopup(`<b>${dentist.full_name}</b><br>${dentist.clinic_location.street} ${dentist.clinic_location.zip}`).openPopup();
        },
    }
}
</script>

<style>
#map {
    height: 100vh;
    width: 100vw;
}
</style>