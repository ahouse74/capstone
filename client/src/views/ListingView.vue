<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import CommentSection from '../components/CommentSection.vue'
import { getAnimal, updateAnimalStatus } from '../api/index.js'
import { useAnimalsStore } from '../stores/animals.js'

const route = useRoute()
const store = useAnimalsStore()
const animal = ref(null)
const loading = ref(true)
const error = ref('')
const updatingStatus = ref(false)

const timeAgo = computed(() => {
  if (!animal.value) return ''
  const diff = Date.now() - new Date(animal.value.createdAt).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
})

const locationLabel = computed(() => {
  if (!animal.value?.location) return null
  const loc = animal.value.location
  if (loc.label) return loc.label
  if (loc.lat && loc.lng) return `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`
  return null
})

async function load() {
  loading.value = true
  try {
    animal.value = await getAnimal(route.params.id)
  } catch (e) {
    error.value = 'Could not load this listing.'
  } finally {
    loading.value = false
  }
}

async function setStatus(status) {
  if (updatingStatus.value) return
  updatingStatus.value = true
  try {
    const updated = await updateAnimalStatus(animal.value._id, status)
    animal.value = { ...animal.value, ...updated }
    store.updateLocal(animal.value._id, { status })
  } catch (e) {
    alert('Failed to update status.')
  } finally {
    updatingStatus.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="page">
    <AppHeader :show-back="true" />

    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="error" class="state err">{{ error }}</div>

    <main v-else class="detail">
      <!-- Photo -->
      <div class="photo-wrap">
        <img v-if="animal.photoUrl" :src="animal.photoUrl" :alt="animal.name" class="photo" />
        <div v-else class="photo-placeholder">
          {{ animal.species === 'dog' ? '🐕' : animal.species === 'cat' ? '🐈' : animal.species === 'bird' ? '🐦' : '🐾' }}
        </div>
      </div>

      <!-- Name + status -->
      <div class="name-row">
        <div>
          <h1 class="name">{{ animal.name || 'Unknown' }}</h1>
          <p class="species">{{ animal.species }}</p>
        </div>
        <StatusBadge :status="animal.status" />
      </div>

      <hr class="divider" />

      <!-- Meta row -->
      <div class="meta-row">
        <div class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <div>
            <div class="meta-label">Last Seen</div>
            <div class="meta-value">{{ timeAgo }}</div>
          </div>
        </div>

        <div v-if="locationLabel" class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <div>
            <div class="meta-label">Location</div>
            <div class="meta-value">{{ locationLabel }}</div>
          </div>
        </div>

        <div v-if="animal.reportedBy" class="meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <div>
            <div class="meta-label">Reported By</div>
            <div class="meta-value">{{ animal.reportedBy }}</div>
          </div>
        </div>
      </div>

      <hr class="divider" />

      <!-- Description -->
      <section class="section">
        <h2 class="section-title">Description</h2>
        <p class="description">{{ animal.description || 'No description provided.' }}</p>
      </section>

      <hr class="divider" />

      <!-- Status controls -->
      <section class="section">
        <h2 class="section-title">Update Status</h2>
        <div class="status-btns">
          <button
            class="status-btn missing"
            :class="{ active: animal.status === 'missing' }"
            :disabled="updatingStatus"
            @click="setStatus('missing')"
          >
            Mark as Missing
          </button>
          <button
            class="status-btn caring"
            :class="{ active: animal.status === 'caring' }"
            :disabled="updatingStatus"
            @click="setStatus('caring')"
          >
            Being Cared For
          </button>
          <button
            class="status-btn reunited"
            :class="{ active: animal.status === 'reunited' }"
            :disabled="updatingStatus"
            @click="setStatus('reunited')"
          >
            Mark as Reunited
          </button>
        </div>
      </section>

      <hr class="divider" />

      <!-- Comments -->
      <section class="section">
        <CommentSection :animal-id="animal._id" />
      </section>
    </main>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; background: var(--bg); }

.state {
  text-align: center;
  padding: 80px 24px;
  color: var(--text-muted);
}
.state.err { color: var(--status-missing); }

.detail {
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.photo-wrap {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
  border: 1.5px solid var(--border);
}

.photo { width: 100%; height: 100%; object-fit: cover; }

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
}

.name-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.name {
  font-size: 1.6rem;
  font-weight: 800;
}

.species {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-transform: capitalize;
  margin-top: 2px;
}

.divider {
  border: none;
  border-top: 1.5px solid var(--border);
}

.meta-row {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--text-muted);
  padding-top: 2px;
}

.meta-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--text-muted);
  font-weight: 600;
}

.meta-value {
  font-size: 0.875rem;
  color: var(--text);
  font-weight: 500;
  margin-top: 2px;
}

.section { display: flex; flex-direction: column; gap: 10px; }

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
}

.description {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text);
}

/* Status buttons */
.status-btns {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.status-btn {
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 2px solid;
  transition: all 0.15s;
  opacity: 0.5;
}

.status-btn.missing { border-color: var(--status-missing); color: var(--status-missing); }
.status-btn.caring  { border-color: var(--status-caring);  color: var(--status-caring);  }
.status-btn.reunited{ border-color: var(--status-reunited); color: var(--status-reunited); }

.status-btn.active, .status-btn:hover:not(:disabled) { opacity: 1; }

.status-btn.missing.active  { background: var(--status-missing);  color: #fff; }
.status-btn.caring.active   { background: var(--status-caring);   color: #fff; }
.status-btn.reunited.active { background: var(--status-reunited);  color: #fff; }

.status-btn:disabled { cursor: not-allowed; }
</style>
