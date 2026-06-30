const getAdminPassword = () => {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem('admin_password') || ''
}

const adminFetch = async (action, payload) => {
  const adminPassword = getAdminPassword()
  if (!adminPassword) {
    throw new Error('Admin password is missing. Please refresh and log in again.')
  }

  const response = await fetch('/api/admin/classes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': adminPassword,
    },
    body: JSON.stringify({ action, payload }),
  })

  const text = await response.text()
  let json = null
  if (text) {
    try {
      json = JSON.parse(text)
    } catch (parseError) {
      throw new Error(`Admin API returned invalid JSON: ${parseError.message}`)
    }
  }

  if (!response.ok) {
    const message = json?.error || json?.message || text || `Admin API request failed with status ${response.status}`
    throw new Error(message)
  }

  return json?.data ?? null
}

export const createClass = async (payload) => adminFetch('create', payload)
export const updateClass = async (payload) => adminFetch('update', payload)
export const toggleClassVisible = async (id, visible) => adminFetch('toggleVisible', { id, visible })
export const deleteClass = async (id) => adminFetch('delete', { id })
