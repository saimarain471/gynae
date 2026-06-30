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

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json?.error || 'Admin API request failed.')
  }
  return json.data
}

export const createClass = async (payload) => adminFetch('create', payload)
export const updateClass = async (payload) => adminFetch('update', payload)
export const toggleClassVisible = async (id, visible) => adminFetch('toggleVisible', { id, visible })
export const deleteClass = async (id) => adminFetch('delete', { id })
