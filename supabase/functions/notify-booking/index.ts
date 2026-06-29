import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAKE_WEBHOOK_URL = Deno.env.get("MAKE_WEBHOOK_URL") ?? ""
const DOCTOR_WHATSAPP = Deno.env.get("DOCTOR_WHATSAPP_NUMBER") ?? ""
const DOCTOR_EMAIL = Deno.env.get("DOCTOR_EMAIL") ?? ""

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    const body = await req.json()

    const record = body.record
    const table = body.table

    if (!record || typeof record !== "object") {
      return new Response(JSON.stringify({ error: "No record found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (!record.full_name || !record.payment_method || !record.transaction_id) {
      return new Response(JSON.stringify({ error: "Missing required booking fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const isClass = table === "class_bookings"
    const bookingType = isClass ? "Class Booking" : "Consultation Booking"
    const subject = isClass ? record.class_title : "Consultation"
    const amount = isClass ? `PKR ${record.class_price}` : "PKR 2,000"

    const sanitize = (val: unknown): string =>
      typeof val === "string" ? val.slice(0, 500) : ""

    const payload = {
      booking_type: bookingType,
      full_name: sanitize(record.full_name),
      email: sanitize(record.email),
      phone: sanitize(record.phone),
      whatsapp_number: sanitize(record.whatsapp_number),
      city: sanitize(record.city),
      subject: sanitize(subject),
      amount,
      payment_method: sanitize(record.payment_method),
      transaction_id: sanitize(record.transaction_id),
      additional_notes: sanitize(record.additional_notes),
      preferred_date: sanitize(record.preferred_date),
      preferred_time: sanitize(record.preferred_time),
      concern: sanitize(record.concern),
      status: sanitize(record.status),
      created_at: sanitize(record.created_at),
      booking_id: sanitize(record.id),
      doctor_whatsapp: DOCTOR_WHATSAPP,
      doctor_email: DOCTOR_EMAIL,
    }

    if (!MAKE_WEBHOOK_URL) {
      return new Response(JSON.stringify({ error: "Webhook URL is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const makeResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!makeResponse.ok) {
      console.error("Webhook delivery failed")
      return new Response(JSON.stringify({ error: "Webhook delivery failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Edge function error:", error instanceof Error ? error.message : "Unknown error")
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
