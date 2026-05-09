const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function createDiaryEntry(payload) {
  const response = await fetch(`${API_BASE_URL}/diary/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Unable to save diary entry')
  }

  return response.json()
}

export async function fetchDiaryEntries(password, signal) {
  const response = await fetch(`${API_BASE_URL}/diary/entries`, {
    signal,
    headers: {
      'X-Lover-Password': password,
    },
  })

  if (response.status === 401) {
    throw new Error('Invalid password')
  }

  if (!response.ok) {
    throw new Error('Unable to load diary entries')
  }

  return response.json()
}
