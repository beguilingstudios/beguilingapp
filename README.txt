Beguiling Studios - Live Submit Connection

1. Run pricing-package-additions.sql in Supabase SQL Editor.
   This adds the Matric R1,200 package and Wedding Promo 2 R14,700,
   and verifies Wedding Promo 1 R6,000.

2. Replace the current GitHub Pages index.html with the included index.html.

3. The website now sends directly to:
   Supabase Edge Function: send-quote

4. The browser no longer uses EmailJS.

5. The website sends:
   - client name / surname
   - client email
   - cellphone
   - selected Google Places venue
   - one-way Google Routes distance
   - secure pricing service codes and quantities

6. Supabase then:
   - reads prices from service_pricing
   - doubles the route distance for return travel
   - charges the database travel rate
   - generates the branded PDF
   - emails the quote through Gmail

Personalised quote note:
Some source price-list entries were visually ambiguous. The website intentionally
blocks combinations where the exact rate has not yet been confirmed instead of
guessing a price.
