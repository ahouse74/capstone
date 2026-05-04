<script setup>
import { ref, onMounted } from 'vue'
import { getComments, postComment } from '../api/index.js'
import { useUserStore } from '../stores/user.js'

const props = defineProps({
  animalId: { type: String, required: true },
})

const userStore = useUserStore()
const comments = ref([])
const body = ref('')
const loading = ref(false)
const posting = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  try {
    comments.value = await getComments(props.animalId)
  } finally {
    loading.value = false
  }
}

async function submit() {
  if (!body.value.trim()) return
  posting.value = true
  error.value = ''
  try {
    const comment = await postComment(props.animalId, {
      author: userStore.displayName,
      body: body.value.trim(),
    })
    comments.value.push(comment)
    body.value = ''
  } catch (e) {
    error.value = 'Failed to post comment. Please try again.'
  } finally {
    posting.value = false
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

onMounted(load)
</script>

<template>
  <section class="comments">
    <h2 class="section-title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      Comments ({{ comments.length }})
    </h2>

    <div v-if="loading" class="state">Loading comments…</div>

    <div v-else-if="comments.length === 0" class="state">
      No comments yet. Be the first to share information!
    </div>

    <ul v-else class="comment-list">
      <li v-for="c in comments" :key="c._id" class="comment">
        <div class="comment-header">
          <span class="author">{{ c.author }}</span>
          <span class="date">{{ formatDate(c.createdAt) }}</span>
        </div>
        <p class="comment-body">{{ c.body }}</p>
      </li>
    </ul>

    <!-- Post form -->
    <div class="post-form">
      <textarea
        v-model="body"
        placeholder="Share any information that might help…"
        rows="3"
      />
      <span v-if="error" class="error">{{ error }}</span>
      <button class="btn-post" :disabled="posting" @click="submit">
        {{ posting ? 'Posting…' : 'Post Comment' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.comments {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 700;
}

.state {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.comment-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment {
  background: var(--bg);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  border: 1.5px solid var(--border);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.author {
  font-size: 0.875rem;
  font-weight: 700;
}

.date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.comment-body {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text);
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

textarea {
  padding: 12px 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--text);
  background: var(--surface);
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}

textarea:focus { border-color: var(--primary); }

.error {
  font-size: 0.8rem;
  color: var(--status-missing);
}

.btn-post {
  align-self: flex-start;
  padding: 10px 24px;
  background: var(--primary);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}

.btn-post:hover:not(:disabled) { background: var(--primary-hover); }
.btn-post:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
