<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  animal: { type: Object, required: true },
})

const router = useRouter()

const timeAgo = computed(() => {
  const diff = Date.now() - new Date(props.animal.createdAt).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
})

function open() {
  router.push({ name: 'listing', params: { id: props.animal._id } })
}
</script>

<template>
  <article class="card" @click="open">
    <div class="photo-wrap">
      <img
        v-if="animal.photoUrl"
        :src="animal.photoUrl"
        :alt="animal.name"
        class="photo"
      />
      <div v-else class="photo-placeholder">
        {{ animal.species === 'dog' ? '🐕' : animal.species === 'cat' ? '🐈' : animal.species === 'bird' ? '🐦' : '🐾' }}
      </div>
    </div>

    <div class="body">
      <div class="row">
        <span class="name">{{ animal.name || 'Unknown' }}</span>
        <StatusBadge :status="animal.status" />
      </div>
      <div class="species">{{ animal.species }}</div>
      <div class="meta">Last seen {{ timeAgo }}</div>
      <p class="desc">{{ animal.description }}</p>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  border: 1.5px solid var(--border);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.photo-wrap {
  width: 100%;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: var(--bg);
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.card:hover .photo { transform: scale(1.03); }

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: var(--bg);
}

.body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
}

.species {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: capitalize;
}

.meta {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-top: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
