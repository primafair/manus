# BehördenAssistent Project Documentation

This document outlines the setup, deployment, and troubleshooting for the BehördenAssistent Next.js project.

## 1. Project Setup

To set up the project locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000`.

## 2. Deployment

This project is a Next.js application. For deployment, it is recommended to use a platform that supports Next.js, such as Vercel, Netlify, or a custom Node.js server.

### Build for Production

To create an optimized production build, run:

```bash
npm run build
```

This will generate the `.next` directory with the production-ready build.

### Running in Production

To run the built application in production mode, use:

```bash
npm run start
```

## 3. Troubleshooting

### Common Issues and Solutions

*   **`npm install` or `npm run build` errors:**
    *   Ensure you have Node.js and npm installed.
    *   Try clearing the npm cache: `npm cache clean --force`
    *   Delete `node_modules` and `package-lock.json` and reinstall: `rm -rf node_modules package-lock.json && npm install`
    *   If there are dependency conflicts, try `npm audit fix --force`.

*   **Type errors during build (e.g., `Type 'string | null' is not assignable to type 'string | undefined'`):**
    *   This was a known issue with the `paymentId` type in `app/api/payments/verify/route.ts`.
    *   The `paymentId` field in the `Application` interface was updated to `paymentId?: string | null;` to correctly handle `null` values.

*   **`Error: Page "/api/applications/[id]" is missing "generateStaticParams()" so it cannot be used with "output: export" config.`:**
    *   This error occurs when `output: 'export'` is enabled in `next.config.js` for dynamic routes that do not implement `generateStaticParams`.
    *   The `output: 'export'` line has been removed from `next.config.js` to resolve this, allowing the application to be server-rendered on demand.

## 4. Project Structure

```
.next/             # Next.js build output
app/               # Application routes and API handlers
  admin/           # Admin pages
  api/             # API routes
    admin/         # Admin API routes
    applications/  # Application API routes
    payments/      # Payment API routes
    pdf/           # PDF generation API routes
  antrag/          # Application form pages
  erfolg/          # Success page
  zahlung/         # Payment page
data/              # Data files (e.g., applications.json)
node_modules/      # Installed Node.js modules
public/            # Static assets
.gitignore         # Git ignore file
next.config.js     # Next.js configuration
package.json       # Project dependencies and scripts
package-lock.json  # Dependency lock file
README.md          # This documentation
tsconfig.json      # TypeScript configuration
```

## 5. Next.js Version

The project is currently configured to use Next.js version `14.2.5`.

