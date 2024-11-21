<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import { Api } from '../Api';


const lat = ref(0)
const lng = ref(0)
const map = ref()
const mapContainer = ref()
const dentists = ref([])
const clinicMarkers = ref(new Map())

onMounted(() => {
    map.value = L.map(mapContainer.value, {
        zoomAnimation: false,
        wheelPxPerZoomLevel: 15000,
        inertiaDeceleration: 28000,
        minZoom: 13,
        maxBounds: [[57.0, 11.4], [58.5, 12.5]], 
        maxBoundsViscosity: 0.6,
    }).setView([57.7, 12], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
    }).addTo(map.value);

    // Custom control for the "Get my Location" button
    const locationControl = L.Control.extend({
        onAdd: function () {
            const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
            button.innerHTML = '<IBi0Circle />';
            button.style.backgroundColor = 'white';
            button.style.width = '40px';
            button.style.height = '40px';
            button.onclick = findLocation;
            return button;
        }
    });

    map.value.addControl(new locationControl({ position: 'topleft' }));

    fetchClinics();

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

async function fetchClinics() {
    // Fetch clinics from the backend
    // Save result to dentists
    await Api.get(`/dentists`)
        .then((response) => {
            dentists.value = response.data;
            console.log(dentists.value);
            createMarkers();
        })
        .catch((error) => {
            console.log("Error fetching dentists: " + error);
        });
}

function createMarkers() {
    for (const dentist of dentists.value) {
        var clinicMarker = L.marker([dentist.latitude, dentist.longitude]).addTo(map.value);
        createMarkerPopup(dentist, clinicMarker);
        clinicMarkers.value.set(dentist, clinicMarker);
    }
}

function createMarkerPopup(dentist, clinicMarker) {
    const popupContent = `
        <div class="popup-content">
            <h3>${dentist.first_name} ${dentist.surname}</h3>
            <p>${dentist.street}, ${dentist.zip}</p>
            <a href="/dentists/${dentist._id}/appointments" class="popup-link">Book an appointment!</a>
        </div>
    `;
    clinicMarker.bindPopup(popupContent).openPopup();
}
</script>

<template>
    <div>
        <div ref="mapContainer" id="map"></div>
    </div>
</template>

<script>
export default {
    name: 'MapContainer',
}
</script>

<style>
#map {
    height: 100vh;
    width: 100vw;
}

.popup-content {
    padding: 10px;
    font-family: Arial, sans-serif;
    color: #333;
}

.popup-content h3 {
    margin: 0;
    font-size: 18px;
    color: #007BFF;
}

.popup-content p {
    margin: 5px 0;
    font-size: 14px;
}

.popup-content .popup-link {
    display: inline-block;
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #007BFF;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}

.popup-content .popup-link:hover {
    background-color: #0056b3;
}
</style>