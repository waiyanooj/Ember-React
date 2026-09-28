# Ember & Bean

A React and Vite storefront with account registration, Google sign-in, a menu,
saved items, a cart, Stripe checkout, and order history.

## Development

```sh
npm install
npm run dev
```

The frontend expects the existing backend at `http://127.0.0.1:8000`.
Set `VITE_STRIPE_KEY` in your local `.env` file for Stripe checkout.

```sh
npm run build         # Production build
npm run preview       # Preview the production build
npm run lint          # ESLint checks
npm run format        # Format source and configuration
npm run format:check  # Check formatting without modifying files
```

## Project structure

```text
src/
  main.jsx                 Entry point and router provider
  routes/                  Route table and authentication guard
  pages/                   Page components
    auth/                  Login, registration, and Google callback
  components/
    Loading.jsx            Shared loading overlay
    profile/               Profile form, password modal, and saved items
    payment/               Stripe payment form
  services/                Backend requests grouped by feature
  data/                    Existing sample data
  styles/                  Stylesheets
  assets/                  Bundled images and SVGs
public/                    Public assets served directly
examples/                  Learning code and Vite starter component
```

Pages own state and navigation. Extracted form components receive values and
handlers through props. Service functions return the original Axios response
and accept request configuration. Authentication headers, payloads, and error
handling remain with their callers.

Component filenames use PascalCase. Non-component JavaScript modules use
`.js`. Keep shared UI in `components/`, routes in `routes/`, and backend
requests in `services/`.

Existing route URLs, including `/paymentSuccess` and `/OrderHistory`, are
preserved. Stylesheet import order is preserved. The entry point loads
`styles/App.css` to preserve the former starter import's stylesheet effect.
`styles/index.css` remains available but is not newly applied to the app.

Files under `examples/` are retained for reference and are not imported by the
application. The Vite starter still uses the original assets in `src/assets/`.
