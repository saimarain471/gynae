import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAKE_WEBHOOK_URL = Deno.env.get("MAKE_WEBHOOK_URL") ?? ""
const DOCTOR_WHATSAPP = Deno.env.get("DOCTOR_WHATSAPP_NUMBER") ?? ""
const DOCTOR_EMAIL = Deno.env.get("DOCTOR_EMAIL") ?? ""

serve(async (req) => {
  try {
    const body = await req.json()

    const record = body.record
    const table = body.table

    if (!record) {
      return new Response(JSON.stringify({ error: "No record found" }), { status: 400 })
    }

    const isClass = table === "class_bookings"
    const bookingType = isClass ? "Class Booking" : "Consultation Booking"
    const subject = isClass ? record.class_title : "Consultation"
    const amount = isClass ? `PKR ${record.class_price}` : "PKR 2,000"

    const payload = {
      booking_type: bookingType,
      full_name: record.full_name,
      email: record.email,
      phone: record.phone,
      whatsapp_number: record.whatsapp_number,
      city: record.city,
      subject,
      amount,
      payment_method: record.payment_method,
      transaction_id: record.transaction_id,
      additional_notes: record.additional_notes ?? "",
      preferred_date: record.preferred_date ?? "",
      preferred_time: record.preferred_time ?? "",
      concern: record.concern ?? "",
      status: record.status,
      created_at: record.created_at,
      booking_id: record.id,
      doctor_whatsapp: DOCTOR_WHATSAPP,
      doctor_email: DOCTOR_EMAIL,
    }

    if (!MAKE_WEBHOOK_URL) {
      return new Response(JSON.stringify({ error: "MAKE_WEBHOOK_URL is not configured" }), { status: 500 })
    }

    const makeResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!makeResponse.ok) {
      console.error("Make.com webhook failed:", await makeResponse.text())
      return new Response(JSON.stringify({ error: "Make.com webhook failed" }), { status: 500 })
    }

    console.log(`Booking notification sent for: ${record.full_name} — ${bookingType}`)
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error("Edge function error:", error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), { status: 500 })
  }
})
