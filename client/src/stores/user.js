import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const displayName = ref(localStorage.getItem('sat_display_name') || '')

  const hasName = computed(() => displayName.value.trim().length > 0)

  function setName(name) {
    displayName.value = name.trim()
    localStorage.setItem('sat_display_name', displayName.value)
  }

  return { displayName, hasName, setName }
})
