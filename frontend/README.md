# CIRMS Frontend Deployment Guide

This project is a Next.js 14 application connected to a Supabase PostgreSQL backend.

## Deployment to Vercel

To deploy this application to Vercel, follow these steps:

1. **Connect to GitHub**: Push your code to a GitHub repository and import it into Vercel.
2. **Framework Preset**: Vercel will automatically detect **Next.js**.
3. **Environment Variables**:
   - In the Vercel project settings, go to the **Environment Variables** tab.
   - Add a variable named `DATABASE_URL`.
   - Use your Supabase connection string. 
   - **Tip**: For production, use the Supabase **Transaction Mode** connection string (usually port 6543) to prevent connection exhaustion in serverless functions.

### Database Connection String Format
`postgresql://postgres:[YOUR-PASSWORD]@db.pkeallwuvbcckrvxwdrr.supabase.co:5432/postgres`

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file with your `DATABASE_URL`.
3. Run the development server:
   ```bash
   npm run dev
   ```

## Production Build

The build command is standard for Next.js:
```bash
npm run build
```
This will compile all server components and verify database connectivity during the build process if static generation is used.
