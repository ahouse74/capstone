import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAnimals, getAnimal } from '../api/index.js'

export const useAnimalsStore = defineStore('animals', () => {
  const animals = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      animals.value = await getAnimals()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id) {
    const cached = animals.value.find((a) => a._id === id)
    if (cached) return cached
    return getAnimal(id)
  }

  function updateLocal(id, patch) {
    const idx = animals.value.findIndex((a) => a._id === id)
    if (idx !== -1) animals.value[idx] = { ...animals.value[idx], ...patch }
  }

  return { animals, loading, error, fetchAll, fetchOne, updateLocal }
})
