<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const router = useRouter()
const userStore = useUserStore()

const name = ref('')
const error = ref('')

function submit() {
  if (!name.value.trim()) {
    error.value = 'Please enter a display name to continue.'
    return
  }
  userStore.setName(name.value)
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="welcome-page">
    <div class="card">
      <div class="paw-icon">🐾</div>
      <h1>Welcome to Stray Animal Tracker</h1>
      <p class="subtitle">
        Before you continue, please enter a display name that will be shown
        with your reports and comments.
      </p>

      <div class="field">
        <label for="display-name">Display Name</label>
        <input
          id="display-name"
          v-model="name"
          type="text"
          placeholder="e.g., Sarah M."
          @keyup.enter="submit"
          autocomplete="off"
        />
        <span v-if="error" class="error">{{ error }}</span>
      </div>

      <button class="btn-primary" @click="submit">Continue</button>
    </div>
  </div>
</template>

<style scoped>
.welcome-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
  padding: 48px 40px;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.paw-icon {
  font-size: 32px;
  line-height: 1;
}

h1 {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--text);
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
}

input {
  padding: 12px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  color: var(--text);
  background: var(--surface);
  transition: border-color 0.15s;
  outline: none;
}

input:focus {
  border-color: var(--primary);
}

.error {
  font-size: 0.8rem;
  color: var(--status-missing);
}

.btn-primary {
  margin-top: 8px;
  padding: 14px;
  background: var(--primary);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  transition: background 0.15s, transform 0.1s;
}

.btn-primary:hover { background: var(--primary-hover); }
.btn-primary:active { transform: scale(0.98); }
</style>
