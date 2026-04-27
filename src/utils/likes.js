// Calls Upstash Redis REST API directly from the browser
// Uses the READ-ONLY token for gets, full token for increments

const BASE_URL = import.meta.env.VITE_UPSTASH_URL
const TOKEN     = import.meta.env.VITE_UPSTASH_TOKEN

async function upstash(command) {
  const res = await fetch(`${BASE_URL}/${command}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const data = await res.json()
  return data.result
}

export async function getLikes(postId) {
  try {
    const result = await upstash(`GET/likes:${postId}`)
    return parseInt(result) || 0
  } catch {
    return 0
  }
}

export async function incrementLikes(postId) {
  try {
    const result = await upstash(`INCR/likes:${postId}`)
    return parseInt(result) || 0
  } catch {
    return 0
  }
}
