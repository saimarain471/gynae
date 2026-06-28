# Make.com Setup Guide — Dr. Zainab Mohsin Website

## What Make.com does
When a patient books a class or consultation, Make.com automatically:
1. Adds their details to Google Sheets
2. Sends Dr. Zainab a WhatsApp message
3. Sends Dr. Zainab an email alert

## Step 1 — Create Make.com account
Go to make.com → Sign up free → Create a new scenario

## Step 2 — Add Webhook trigger
- Click the + icon → search "Webhooks" → choose "Custom webhook"
- Click "Add" → copy the webhook URL
- Paste this URL as MAKE_WEBHOOK_URL in your Supabase Edge Function secrets

## Step 3 — Add Google Sheets action
- Click + after the webhook → search "Google Sheets" → "Add a Row"
- Connect your Google account
- Select your spreadsheet: "Dr. Zainab Bookings"
- Select sheet: "All Bookings"
- Map columns:
  - Column A (Date)           → {{created_at}}
  - Column B (Type)           → {{booking_type}}
  - Column C (Name)           → {{full_name}}
  - Column D (Email)          → {{email}}
  - Column E (Phone)          → {{phone}}
  - Column F (WhatsApp)       → {{whatsapp_number}}
  - Column G (City)           → {{city}}
  - Column H (Class/Service)  → {{subject}}
  - Column I (Amount)         → {{amount}}
  - Column J (Payment Method) → {{payment_method}}
  - Column K (TID)            → {{transaction_id}}
  - Column L (Status)         → {{status}}
  - Column M (Booking ID)     → {{booking_id}}
  - Column N (Notes)          → {{additional_notes}}

## Step 4 — Add WhatsApp notification (via Twilio or CallMeBot)
Option A — CallMeBot (free, no setup fee):
- Go to callmebot.com → follow the WhatsApp API activation steps (send a message to their number)
- In Make.com: add HTTP → Make a request
  URL: https://api.callmebot.com/whatsapp.php?phone={{doctor_whatsapp}}&text=MESSAGE&apikey=YOUR_KEY
  Replace MESSAGE with:
  New {{booking_type}} from {{full_name}} ({{city}})
  Class: {{subject}} — {{amount}}
  Payment: {{payment_method}} — TID: {{transaction_id}}
  WhatsApp: {{whatsapp_number}}
  Phone: {{phone}}

Option B — Twilio WhatsApp (paid but more reliable):
- Make.com has a built-in Twilio module
- Add action: Twilio → Send a WhatsApp Message
- Fill sender (your Twilio number) and recipient ({{doctor_whatsapp}})


## Step 6 — Test the scenario
- In Make.com, click "Run once"
- Submit a test booking on the website
- Check: Google Sheet gets a new row, Dr. Zainab gets WhatsApp 
- If it works, click "Activate scenario" to run automatically forever

## Google Sheet to create
Go to sheets.google.com → New spreadsheet
Name it: "Dr. Zainab Mohsin — Bookings"
First row headers (bold these):
Date | Type | Name | Email | Phone | WhatsApp | City | Class/Service | Amount | Payment Method | TID | Status | Booking ID | Notes
