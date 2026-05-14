# Super Antigravity Mario

A complete Mario-style platformer built with Next.js 14, Supabase, and HTML5 Canvas.

## Features
- **Mario-Style Physics**: Gravity, jumping, and collision detection.
- **Progressive Difficulty**: Speed increases as you play.
- **Supabase Integration**: Global leaderboard and user authentication.
- **Retro Aesthetic**: Pixel-art UI and 8-bit styling.
- **Responsive Design**: Playable on desktop and mobile.

## Setup Instructions

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the contents of `supabase/schema.sql`.
3. Copy your project URL and Anon Key.

### 2. Environment Variables
1. Create a `.env.local` file in the root directory.
2. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Installation
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```

## Deployment
This project is configured for one-click deployment on Netlify.
1. Connect your GitHub repository to Netlify.
2. Add the environment variables in the Netlify dashboard.
3. The `netlify.toml` file will handle the build configuration.

## Technologies
- **Frontend**: Next.js 14, Tailwind CSS, Lucide React
- **Backend**: Supabase Auth & Database
- **Rendering**: HTML5 Canvas
