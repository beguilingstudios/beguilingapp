# Beguiling Studios Web App

A mobile-friendly booking/quote web app based on the supplied flowchart.

## Included flow

- Home screen
- Matric Dance
  - Promo R1,200
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


## iPad / Safari compatibility

The JavaScript has been written to avoid several newer syntax features that can cause the whole app to stop responding on older iPads/Safari versions.

For best results:
- Publish the app through GitHub Pages and open the HTTPS GitHub Pages address in Safari.
- Do not open `index.html` directly from the iPad Files app.
- Update iPadOS/Safari where possible.
- After uploading a new version, refresh Safari and, if needed, clear the site's cached data so the older JavaScript file is not reused.


## iPad mini 2 / iOS 12 support

This build is specifically adjusted for Safari on iOS 12:

- JavaScript uses ES5-compatible syntax.
- No optional chaining, arrow functions, template literals, NodeList.forEach, or Element.closest.
- Flexbox spacing does not rely on `gap`, which iOS 12 Safari does not support.
- CSS `min()` and `clamp()` were removed.
- `-webkit-` prefixes and older flexbox fallbacks are included.
- Form fields use 16px text to stop Safari automatically zooming when focused.
- CSS and JavaScript filenames include cache-busting version strings.
- The layout falls back cleanly if newer visual effects are unavailable.

### Important testing note

Use the GitHub Pages HTTPS link in Safari. Do not test by opening `index.html` directly from the iPad Files app.

If an old version still appears:
1. Go to Settings > Safari > Advanced > Website Data.
2. Remove the data for your GitHub Pages site.
3. Reopen the site in Safari.
