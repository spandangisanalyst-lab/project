-- Cooch Behar Swimming Portal
-- Supabase backend for the migrated Firestore-compatible data layer.
-- Run this once in Supabase SQL Editor.

create table if not exists public.firestore_documents (
  collection text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);

create index if not exists firestore_documents_collection_idx
  on public.firestore_documents (collection);

create index if not exists firestore_documents_updated_at_idx
  on public.firestore_documents (updated_at desc);

alter table public.firestore_documents enable row level security;

drop policy if exists "public read firestore documents" on public.firestore_documents;
drop policy if exists "public insert firestore documents" on public.firestore_documents;
drop policy if exists "public update firestore documents" on public.firestore_documents;
drop policy if exists "public delete firestore documents" on public.firestore_documents;

create policy "public read firestore documents"
  on public.firestore_documents for select
  using (true);

create policy "public insert firestore documents"
  on public.firestore_documents for insert
  with check (true);

create policy "public update firestore documents"
  on public.firestore_documents for update
  using (true)
  with check (true);

create policy "public delete firestore documents"
  on public.firestore_documents for delete
  using (true);

-- Enable Supabase Realtime for the compatibility table.
-- If Supabase reports that the table is already in the publication, that is harmless.
do $$
begin
  begin
    alter publication supabase_realtime add table public.firestore_documents;
  exception when duplicate_object then
    null;
  end;
end $$;

-- Optional migration helper: copies old Supabase tables into the new
-- Firestore-compatible store when those tables already exist and contain an id column.
create or replace function public.migrate_legacy_swim_table(
  p_table text,
  p_collection text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_collection text := coalesce(p_collection, p_table);
begin
  if to_regclass('public.' || quote_ident(p_table)) is null then
    return;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = p_table
      and column_name = 'id'
  ) then
    return;
  end if;

  execute format(
    'insert into public.firestore_documents (collection, id, data, updated_at)
     select %L, id::text, to_jsonb(t), now()
     from public.%I t
     where id is not null
     on conflict (collection, id) do update
       set data = excluded.data,
           updated_at = excluded.updated_at',
    target_collection, p_table
  );
end;
$$;

-- Copy any existing data from the common tables created by earlier Bolt/Supabase versions.
select public.migrate_legacy_swim_table('participants', 'participants');
select public.migrate_legacy_swim_table('clubs', 'clubs');
select public.migrate_legacy_swim_table('results', 'results');
select public.migrate_legacy_swim_table('activityLogs', 'activityLogs');
select public.migrate_legacy_swim_table('emailNotices', 'emailNotices');
select public.migrate_legacy_swim_table('liveUpdates', 'liveUpdates');
select public.migrate_legacy_swim_table('flaggedSwimmers', 'flaggedSwimmers');
select public.migrate_legacy_swim_table('event_timings', 'event_timings');
select public.migrate_legacy_swim_table('completed_events', 'completed_events');
select public.migrate_legacy_swim_table('staff_roster', 'staff_roster');
select public.migrate_legacy_swim_table('settings', 'settings');
select public.migrate_legacy_swim_table('feedback', 'feedback');
select public.migrate_legacy_swim_table('foto_finishes', 'foto_finishes');
select public.migrate_legacy_swim_table('system_nodes', 'system_nodes');
select public.migrate_legacy_swim_table('system_remote_requests', 'system_remote_requests');
select public.migrate_legacy_swim_table('camera_streams', 'camera_streams');
select public.migrate_legacy_swim_table('system_sound_trigger', 'system_sound_trigger');
select public.migrate_legacy_swim_table('config', 'config');

-- Keep the migration helper out of the public API after running it.
revoke all on function public.migrate_legacy_swim_table(text, text) from public;
