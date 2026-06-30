import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminPassword = process.env.VITE_ADMIN_PASSWORD

if (!supabaseUrl || !supabaseServiceRole || !adminPassword) {
  throw new Error('Missing required environment variables for admin API.')
}

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export async function POST(request) {
  try {
    const body = await request.json()
    const auth = request.headers.get('x-admin-password') || ''
    if (auth !== adminPassword) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const { action, payload } = body || {}
    if (!action || !payload) {
      return new Response(JSON.stringify({ error: 'Action and payload are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    if (action === 'create') {
      const result = await supabase.from('classes').insert([payload]).select()
      if (result.error) {
        return new Response(JSON.stringify({ error: result.error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({ data: result.data }), { status: 201, headers: { 'Content-Type': 'application/json' } })
    }

    if (action === 'update') {
      if (!payload.id) {
        return new Response(JSON.stringify({ error: 'Payload.id is required for update.' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
      const { id, ...rest } = payload
      const result = await supabase.from('classes').update(rest).eq('id', id).select()
      if (result.error) {
        return new Response(JSON.stringify({ error: result.error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({ data: result.data }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    if (action === 'toggleVisible') {
      if (!payload.id || typeof payload.visible !== 'boolean') {
        return new Response(JSON.stringify({ error: 'Payload.id and payload.visible are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
      const result = await supabase.from('classes').update({ visible: payload.visible }).eq('id', payload.id).select()
      if (result.error) {
        return new Response(JSON.stringify({ error: result.error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({ data: result.data }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    if (action === 'delete') {
      if (!payload.id) {
        return new Response(JSON.stringify({ error: 'Payload.id is required for delete.' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
      const result = await supabase.from('classes').delete().eq('id', payload.id)
      if (result.error) {
        return new Response(JSON.stringify({ error: result.error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({ data: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: 'Unknown action.' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Internal error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
