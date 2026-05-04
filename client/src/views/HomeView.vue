<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AnimalMap from '../components/AnimalMap.vue'
import AnimalCard from '../components/AnimalCard.vue'
import { useAnimalsStore } from '../stores/animals.js'

const store = useAnimalsStore()

const statusFilter = ref('all')
const speciesFilter = ref('all')

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'missing', label: 'Missing' },
  { value: 'caring', label: 'Being Cared For' },
  { value: 'reunited', label: 'Reunited' },
]

const speciesOptions = [
  { value: 'all', label: 'All Species' },
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
  { value: 'bird', label: 'Birds' },
  { value: 'other', label: 'Other' },
]

const filtered = computed(() => {
  return store.animals.filter((a) => {
    const statusOk = statusFilter.value === 'all' || a.status === statusFilter.value
    const speciesOk = speciesFilter.value === 'all' || a.species === speciesFilter.value
    return statusOk && speciesOk
  })
})

onMounted(() => {
  store.fetchAll()
})
</script>

<template>
  <div class="page">
    <AppHeader />

    <div class="layout">
      <!-- Map panel -->
      <div class="map-panel">
        <AnimalMap :animals="store.animals" />
      </div>

      <!-- List panel -->
      <div class="list-panel">
        <!-- Filters -->
        <div class="filters">
          <div class="filter-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filters
          </div>

          <div class="filter-group">
            <button
              v-for="opt in statusOptions"
              :key="opt.value"
              class="filter-btn"
              :class="[opt.value, { active: statusFilter === opt.value }]"
              @click="statusFilter = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>

          <div class="filter-group">
            <button
              v-for="opt in speciesOptions"
              :key="opt.value"
              class="filter-btn species"
              :class="{ active: speciesFilter === opt.value }"
              @click="speciesFilter = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Cards grid -->
        <div class="grid-wrap">
          <div v-if="store.loading" class="state-msg">Loading listings…</div>
          <div v-else-if="store.error" class="state-msg error">{{ store.error }}</div>
          <div v-else-if="filtered.length === 0" class="state-msg">No animals match these filters.</div>
          <div v-else class="grid">
            <AnimalCard v-for="a in filtered" :key="a._id" :animal="a" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* MAP */
.map-panel {
  flex: 0 0 52%;
  height: 100%;
}

/* LIST */
.list-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1.5px solid var(--border);
  overflow: hidden;
}

/* FILTERS */
.filters {
  padding: 16px 20px;
  border-bottom: 1.5px solid var(--border);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: .04em;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-btn {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  border: 1.5px solid var(--border);
  color: var(--text-muted);
  background: var(--surface);
  transition: all 0.15s;
}

.filter-btn:hover { border-color: #aaa; color: var(--text); }

/* Active states */
.filter-btn.active,
.filter-btn.all.active,
.filter-btn.species.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.filter-btn.missing.active {
  background: var(--status-missing-bg);
  color: var(--status-missing);
  border-color: var(--status-missing);
}

.filter-btn.caring.active {
  background: var(--status-caring-bg);
  color: var(--status-caring);
  border-color: var(--status-caring);
}

.filter-btn.reunited.active {
  background: var(--status-reunited-bg);
  color: var(--status-reunited);
  border-color: var(--status-reunited);
}

/* GRID */
.grid-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.state-msg {
  margin-top: 48px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.state-msg.error { color: var(--status-missing); }
</style>
