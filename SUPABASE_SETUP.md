# Supabase setup

1. Open the Supabase project used by this app.
2. Open **SQL Editor**.
3. Run `supabase_migration.sql`.
4. Confirm that `public.firestore_documents` exists.
5. Keep these Vite variables in `.env.local` / Bolt environment settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Start the app normally.

The React application now talks to Supabase through `src/lib/firestoreCompat.ts`. Existing Firestore-style application code is preserved so the UI and business logic do not need to be rewritten page by page.

Firebase is retained only for the existing Gmail Google OAuth flow in `gmailService.ts`; Firestore is no longer used.
