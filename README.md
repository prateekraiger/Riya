# Riya: AI Girlfriend App

This contains everything you need to run your AI companion app locally.

## Run Locally

**Prerequisites:** Node.js and pnpm

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Setup

### 1. Environment Variables

Make sure to configure your Gemini API key in the `.env.local` file before running the application.

### 2. Database Setup

The app uses Supabase for authentication and chat history. To set up the database:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL commands from `database-setup.sql` to create the messages table and set up Row Level Security

**Note:** The app will work without the database setup, but chat history won't be saved.

### 3. Supabase Configuration

The Supabase configuration is already set up in `supabase.ts`. If you want to use your own Supabase project:

1. Replace the `supabaseUrl` and `supabaseAnonKey` in `supabase.ts`
2. Run the database setup script in your project
