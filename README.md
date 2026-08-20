# Beguiling Studios Web App

A mobile-friendly booking/quote web app based on the supplied flowchart.

## Included flow

- Home screen
- Matric Dance
  - Promo R1,200
  - Personalised quote
- Wedding
  - Promo 1 — R6,000
  - Promo 2 — R14,700
  - Personalised quote
- Custom makeup/hair quantities
- Venue and additional notes
- Booking summary
- WhatsApp and email hand-off

## Before publishing

Open `app.js` and replace:

```js
const BUSINESS_WHATSAPP = "27XXXXXXXXX";
const BUSINESS_EMAIL = "bookings@beguilingstudios.com";
```

Use the WhatsApp number in international format with digits only, for example `27821234567`.

## Publish free with GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, and `app.js`.
3. Commit the files.
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/ (root)`.
7. Save.
8. GitHub will provide the public web address.

No build process or npm installation is required.

## Custom logo

The current app uses a simple `BS` logo mark. If you want to use your actual Beguiling Studios logo, add the image to the repository and replace the `.logo-mark` element in `index.html` with an `<img>` tag.

## Notes

This version is front-end only. It can send the completed request into WhatsApp or email, but it does not yet save bookings to a database.

A later version can connect this to Supabase so submissions are stored automatically.
