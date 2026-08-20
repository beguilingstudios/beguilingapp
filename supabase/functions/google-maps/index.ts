// Supabase Edge Function: google-maps
// Google Places Autocomplete (New) + Routes API distance.
//
// Required Supabase secrets:
// GOOGLE_MAPS_API_KEY
// BUSINESS_ORIGIN_ADDRESS
//
// Example:
// supabase secrets set GOOGLE_MAPS_API_KEY="AIza..."
// supabase secrets set BUSINESS_ORIGIN_ADDRESS="Your starting address, Johannesburg, South Africa"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "POST required" }, 405);
  }

  const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
  const originAddress = Deno.env.get("BUSINESS_ORIGIN_ADDRESS");

  if (!apiKey) {
    return json({ error: "GOOGLE_MAPS_API_KEY is not configured" }, 500);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (body.action === "autocomplete") {
    const input = String(body.input || "").trim();
    if (input.length < 3) {
      return json({ suggestions: [] });
    }

    const googleBody: any = {
      input,
      includedRegionCodes: ["za"],
      regionCode: "ZA",
      languageCode: "en",
    };

    if (body.sessionToken) {
      googleBody.sessionToken = String(body.sessionToken);
    }

    const response = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId," +
            "suggestions.placePrediction.text.text," +
            "suggestions.placePrediction.structuredFormat.mainText.text," +
            "suggestions.placePrediction.structuredFormat.secondaryText.text",
        },
        body: JSON.stringify(googleBody),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Places API error", response.status, text);
      return json({ error: "Google Places request failed" }, 502);
    }

    const data = await response.json();
    const suggestions = (data.suggestions || [])
      .filter((s: any) => s.placePrediction)
      .slice(0, 6)
      .map((s: any) => {
        const p = s.placePrediction;
        return {
          placeId: p.placeId,
          fullText: p.text?.text || "",
          mainText: p.structuredFormat?.mainText?.text || p.text?.text || "",
          secondaryText: p.structuredFormat?.secondaryText?.text || "",
        };
      });

    return json({ suggestions });
  }

  if (body.action === "route") {
    const placeId = String(body.placeId || "").trim();

    if (!placeId) {
      return json({ error: "placeId is required" }, 400);
    }

    if (!originAddress) {
      return json({ error: "BUSINESS_ORIGIN_ADDRESS is not configured" }, 500);
    }

    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
        },
        body: JSON.stringify({
          origin: {
            address: originAddress,
          },
          destination: {
            placeId,
          },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_UNAWARE",
          units: "METRIC",
          languageCode: "en",
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Routes API error", response.status, text);
      return json({ error: "Google Routes request failed" }, 502);
    }

    const data = await response.json();

    if (!data.routes || !data.routes.length) {
      return json({ error: "No driving route found" }, 404);
    }

    const route = data.routes[0];
    const meters = Number(route.distanceMeters || 0);
    const distanceKm = Math.round((meters / 1000) * 10) / 10;

    let durationText = "";
    if (route.duration) {
      const seconds = parseInt(String(route.duration).replace("s", ""), 10) || 0;
      const minutes = Math.round(seconds / 60);
      if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remaining = minutes % 60;
        durationText = hours + " hr" + (hours === 1 ? "" : "s");
        if (remaining) durationText += " " + remaining + " min";
      } else {
        durationText = minutes + " min";
      }
    }

    return json({
      distanceMeters: meters,
      distanceKm,
      durationText,
    });
  }

  return json({ error: "Unknown action" }, 400);
});
