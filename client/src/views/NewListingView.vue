<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import AppHeader from '../components/AppHeader.vue'
import { createAnimal } from '../api/index.js'
import { useUserStore } from '../stores/user.js'
import { useAnimalsStore } from '../stores/animals.js'

const router = useRouter()
const userStore = useUserStore()
const animalsStore = useAnimalsStore()

// Form state
const name = ref('')
const species = ref('dog')
const description = ref('')
const photoUrl = ref('')      // base64 data URL or empty
const photoPreview = ref('')  // same, for <img>
const locationPin = ref(null) // { lat, lng }
const locationLabel = ref('')
const submitting = ref(false)
const errors = ref({})

const speciesOptions = ['dog', 'cat', 'bird', 'other']

// Photo upload — convert to base64
function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    photoUrl.value = ev.target.result
    photoPreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

function clearPhoto() {
  photoUrl.value = ''
  photoPreview.value = ''
}

// Map
let map = null
let pinMarker = null

onMounted(() => {
  map = L.map('pin-map', { center: [40.73, -73.99], zoom: 12 })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  map.on('click', (e) => {
    const { lat, lng } = e.latlng
    locationPin.value = { lat, lng }

    if (pinMarker) pinMarker.remove()
    pinMarker = L.marker([lat, lng]).addTo(map)
      .bindPopup('Pin dropped here').openPopup()
  })
})

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})

// Validate + submit
function validate() {
  const e = {}
  if (!description.value.trim()) e.description = 'Description is required.'
  if (!locationPin.value) e.location = 'Please click the map to drop a pin.'
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  try {
    const payload = {
      name: name.value.trim() || 'Unknown',
      species: species.value,
      description: description.value.trim(),
      status: 'missing',
      photoUrl: photoUrl.value || '',
      location: {
        lat: locationPin.value.lat,
        lng: locationPin.value.lng,
        label: locationLabel.value.trim() || '',
      },
      reportedBy: userStore.displayName,
    }
    const created = await createAnimal(payload)
    // Refresh the store and navigate to the new listing
    await animalsStore.fetchAll()
    router.push({ name: 'listing', params: { id: created._id } })
  } catch (e) {
    alert('Failed to submit report. Make sure the backend is running.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page">
    <AppHeader :show-back="true" back-label="Back to all listings" />

    <main class="form-wrap">
      <div class="form-card">
        <h1>Report an Animal</h1>

        <!-- Photo upload -->
        <div class="field">
          <label>Photo</label>
          <div v-if="!photoPreview" class="upload-zone" @click="$refs.fileInput.click()">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>Click to upload a photo</span>
            <span class="upload-hint">PNG, JPG up to 10MB</span>
          </div>
          <div v-else class="preview-wrap">
            <img :src="photoPreview" alt="Preview" class="preview-img" />
            <button class="remove-photo" @click="clearPhoto">✕ Remove</button>
          </div>
          <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="onFileChange" />
        </div>

        <!-- Animal name -->
        <div class="field">
          <label for="animal-name">Animal Name <span class="optional">(if known)</span></label>
          <input
            id="animal-name"
            v-model="name"
            type="text"
            placeholder="e.g., Max, Luna, Unknown"
          />
        </div>

        <!-- Species -->
        <div class="field">
          <label>Species</label>
          <div class="species-btns">
            <button
              v-for="s in speciesOptions"
              :key="s"
              class="species-btn"
              :class="{ active: species === s }"
              @click="species = s"
            >
              {{ s.charAt(0).toUpperCase() + s.slice(1) }}
            </button>
          </div>
        </div>

        <!-- Description -->
        <div class="field">
          <label for="description">Description <span class="required">*</span></label>
          <textarea
            id="description"
            v-model="description"
            placeholder="Describe the animal, any identifying features, circumstances of sighting…"
            rows="4"
            :class="{ invalid: errors.description }"
          />
          <span v-if="errors.description" class="err">{{ errors.description }}</span>
        </div>

        <!-- Map pin -->
        <div class="field">
          <label>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle;margin-right:4px;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Click on the Map to Drop a Pin <span class="required">*</span>
          </label>
          <div id="pin-map" class="pin-map" :class="{ invalid: errors.location }"></div>
          <span v-if="locationPin" class="pin-note">
            📍 Pin at {{ locationPin.lat.toFixed(5) }}, {{ locationPin.lng.toFixed(5) }}
          </span>
          <span v-if="errors.location" class="err">{{ errors.location }}</span>
        </div>

        <!-- Optional location label -->
        <div class="field">
          <label for="loc-label">Location Name <span class="optional">(optional)</span></label>
          <input
            id="loc-label"
            v-model="locationLabel"
            type="text"
            placeholder="e.g., Central Park West, near the bus stop"
          />
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button class="btn-submit" :disabled="submitting" @click="submit">
            {{ submitting ? 'Submitting…' : 'Submit Report' }}
          </button>
          <button class="btn-cancel" @click="$router.push({ name: 'home' })">
            Cancel
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }

.form-wrap {
  padding: 32px 24px 80px;
  display: flex;
  justify-content: center;
}

.form-card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1.5px solid var(--border);
  padding: 40px 36px;
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  font-size: 1.5rem;
  font-weight: 800;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
}

.optional { font-weight: 400; color: var(--text-muted); }
.required { color: var(--status-missing); }

input, textarea {
  padding: 11px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  color: var(--text);
  background: var(--surface);
  outline: none;
  transition: border-color 0.15s;
}

input:focus, textarea:focus { border-color: var(--primary); }
textarea { resize: vertical; }
.invalid { border-color: var(--status-missing) !important; }

.err {
  font-size: 0.8rem;
  color: var(--status-missing);
}

/* Photo upload */
.upload-zone {
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-muted);
  transition: border-color 0.15s, background 0.15s;
}

.upload-zone:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.upload-hint { font-size: 0.8rem; }

.preview-wrap {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1.5px solid var(--border);
}

.preview-img {
  width: 100%;
  max-height: 240px;
  object-fit: cover;
  display: block;
}

.remove-photo {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,.55);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}

/* Species buttons */
.species-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.species-btn {
  padding: 8px 20px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  border: 1.5px solid var(--border);
  color: var(--text-muted);
  background: var(--surface);
  transition: all 0.15s;
}

.species-btn:hover { border-color: var(--primary); color: var(--primary); }
.species-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); }

/* Map */
.pin-map {
  width: 100%;
  height: 260px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
  overflow: hidden;
  z-index: 0;
}

.pin-map.invalid { border-color: var(--status-missing); }

.pin-note {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Actions */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-submit {
  flex: 1;
  padding: 13px;
  background: var(--primary);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.btn-submit:hover:not(:disabled) { background: var(--primary-hover); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-cancel {
  padding: 13px 24px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--surface);
  transition: all 0.15s;
}

.btn-cancel:hover { border-color: #aaa; color: var(--text); }
</style>
