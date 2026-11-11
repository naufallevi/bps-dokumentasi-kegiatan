# Routing: `/cara-teknik-dokumentasi`

The Vite app now renders the documentation guide when the browser path is
`/cara-teknik-dokumentasi`. The information card links to that route.

For local development, run `npm run dev`; Vite serves the app with history
fallback automatically.

For static hosting, configure the host to rewrite unknown paths to `/index.html`
so a direct visit or refresh on `/cara-teknik-dokumentasi` loads the Vite app.
Examples:
- Netlify: add a `_redirects` file containing `/* /index.html 200`
- Vercel: add a rewrite from `/(.*)` to `/index.html`
- Apache: configure an SPA fallback to `index.html`

Keep the `public/assets` directory from the original project in place.
