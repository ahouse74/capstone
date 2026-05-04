// All API calls proxy through Vite to http://localhost:5000
const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Request failed')
  }
  return res.json()
}

// Animals
export const getAnimals = () => request('/animals')
export const getAnimal = (id) => request(`/animals/${id}`)
export const createAnimal = (data) =>
  request('/animals', { method: 'POST', body: JSON.stringify(data) })
export const updateAnimalStatus = (id, status) =>
  request(`/animals/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })

// Comments
export const getComments = (animalId) => request(`/animals/${animalId}/comments`)
export const postComment = (animalId, data) =>
  request(`/animals/${animalId}/comments`, { method: 'POST', body: JSON.stringify(data) })
