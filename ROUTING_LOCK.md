HomePlanet Routing Lock

This project is a Vite SPA deployed on Vercel.

Deep links MUST work:
  /mls
  /city/creator
  /press/:slug
  /:slug

The SPA fallback is implemented via:

apps/web/public/_redirects
---------------------------
/*    /index.html   200

Do NOT remove or replace this file.
Do NOT rely on vercel.json rewrites for SPA routing.

If removed:
Direct navigation and refresh will 404 in production.

If routing ever breaks:
1) Check that _redirects exists in apps/web/public
2) Redeploy production
