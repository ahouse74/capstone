<script setup>
defineProps({
  status: { type: String, required: true },
})

const labels = {
  missing: 'Missing',
  caring: 'Being Cared For',
  reunited: 'Reunited',
}
</script>

<template>
  <span class="badge" :class="status">{{ labels[status] ?? status }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.missing {
  background: var(--status-missing-bg);
  color: var(--status-missing);
  border: 1px solid #fecaca;
}

.caring {
  background: var(--status-caring-bg);
  color: var(--status-caring);
  border: 1px solid #fde68a;
}

.reunited {
  background: var(--status-reunited-bg);
  color: var(--status-reunited);
  border: 1px solid #bbf7d0;
}
</style>
