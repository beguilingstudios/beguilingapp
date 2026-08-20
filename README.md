# Beguiling Studios — Google Places + Automatic Distance

This build keeps the web app compatible with iPad mini 2 / iOS 12 while adding:

- Google Places type-ahead search as the client types a venue/address.
- Google Places selection instead of free-text only.
- Automatic driving distance from your configured business/travel origin.
- Automatic estimated driving duration.
- The selected venue, Google Maps link, distance, and duration can be included in the emailed quote.
- Your Google Maps API key is kept on the server in Supabase, not exposed in `index.html`.

## Why this uses a Supabase Edge Function

Google's current Maps JavaScript API officially supports only the current and previous major iOS versions. iOS 12 is far outside that support window.

This version therefore does NOT load the modern Google Maps JavaScript library on the iPad. The iPad uses old-compatible JavaScript to call your Supabase Edge Function, and the Edge Function calls the current Google Places and Routes APIs.

## 1. Google Cloud setup

In Google Cloud Console, enable:

- Places API (New)
- Routes API

Create an API key. Restrict the key to those APIs if possible.

## 2. Supabase secrets

In your Supabase project, add these Edge Function secrets:

- `GOOGLE_MAPS_API_KEY` = your Google API key
- `TRAVEL_BASE_LAT` = latitude where your travel calculation starts
- `TRAVEL_BASE_LNG` = longitude where your travel calculation starts

Example only:

TRAVEL_BASE_LAT=-26.2041
TRAVEL_BASE_LNG=28.0473

Use YOUR actual starting point, not the example.

## 3. Deploy the Edge Function

Place the supplied function at:

supabase/functions/google-places/index.ts

Then deploy:

supabase functions deploy google-places

If you normally deploy Edge Functions through the Supabase dashboard/project workflow instead, use that method.

## 4. Configure index.html

Open `index.html` and replace:

var SUPABASE_URL = "YOUR_SUPABASE_URL";
var SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

Example Supabase URL format:

https://YOUR_PROJECT_REF.supabase.co

Keep your Google API key OUT of index.html.

## 5. EmailJS

Your existing email configuration remains:

var BUSINESS_EMAIL = "YOUR_EMAIL_ADDRESS";
var EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
var EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
var EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

Add these to your EmailJS template if you want the travel information in the email:

{{travel_distance}}
{{travel_duration}}
{{venue}}
{{google_maps_link}}

## 6. GitHub Pages

Upload only `index.html` to the root of the GitHub Pages repository.

The Supabase folder is for deploying the Edge Function; it does not need to be uploaded to GitHub Pages.

## Client flow

1. Client starts typing a venue/address.
2. Your app sends the text to Supabase.
3. Supabase calls Google Places Autocomplete.
4. Google suggestions appear below the input.
5. Client taps a suggestion.
6. Supabase retrieves the exact place and coordinates.
7. Supabase calls Google Routes.
8. The app displays the driving distance and estimated duration.
9. That information is included with the quote.
