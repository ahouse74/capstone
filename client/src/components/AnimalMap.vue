<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'

const props = defineProps({
  animals: { type: Array, default: () => [] },
})

const emit = defineEmits(['select'])

let map = null
let markers = []

// Color-coded circle markers by status
const statusColor = {
  missing: '#ef4444',
  caring: '#f59e0b',
  reunited: '#22c55e',
}

function buildMarker(animal) {
  if (!animal.location?.lat || !animal.location?.lng) return null

  const color = statusColor[animal.status] || '#6b6b6b'

  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width:16px;height:16px;
      border-radius:50%;
      background:${color};
      border:3px solid #fff;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })

  const marker = L.marker([animal.location.lat, animal.location.lng], { icon })
  marker.bindPopup(`
    <strong>${animal.name || 'Unknown'}</strong><br/>
    ${animal.species} · ${animal.status}
  `)
  marker.on('click', () => emit('select', animal._id))
  return marker
}

function renderMarkers() {
  markers.forEach((m) => m.remove())
  markers = []

  props.animals.forEach((animal) => {
    const m = buildMarker(animal)
    if (m) {
      m.addTo(map)
      markers.push(m)
    }
  })

  if (markers.length > 0) {
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.2))
  }
}

onMounted(() => {
  map = L.map('animal-map', {
    center: [40.73, -73.99], // default: NYC — will refit when animals load
    zoom: 12,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  if (props.animals.length > 0) renderMarkers()
})

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})

watch(() => props.animals, renderMarkers, { deep: true })
</script>

<template>
  <div id="animal-map" class="map"></div>
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
