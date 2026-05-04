<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  showBack: { type: Boolean, default: false },
  backLabel: { type: String, default: 'Back to all listings' },
})

function goBack() {
  router.push({ name: 'home' })
}

function goReport() {
  router.push({ name: 'new-listing' })
}

function goHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <header class="app-header">
    <div class="left" @click="goHome">
      <span class="logo-icon">🐾</span>
      <div>
        <div class="title">Stray Animal Tracker</div>
        <div class="tagline">Help reunite lost pets with their families</div>
      </div>
    </div>
    <button class="btn-report" @click="goReport">+ Report Animal</button>
  </header>
  <div v-if="showBack" class="back-bar">
    <button class="back-btn" @click="goBack">← {{ backLabel }}</button>
  </div>
</template>

<style scoped>
.app-header {
  height: var(--header-h);
  background: var(--surface);
  border-bottom: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-icon { font-size: 22px; }

.title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1.2;
}

.tagline {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.btn-report {
  padding: 10px 20px;
  background: var(--primary);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.btn-report:hover { background: var(--primary-hover); }

.back-bar {
  padding: 10px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.back-btn {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
  transition: color 0.15s;
}

.back-btn:hover { color: var(--text); }
</style>
