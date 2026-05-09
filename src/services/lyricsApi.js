const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function fetchLyricsByMusicId(musicId, signal) {
  const response = await fetch(`${API_BASE_URL}/musics/${musicId}/lyrics`, { signal })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(`Unable to load lyrics for ${musicId}`)
  }

  return response.json()
}
