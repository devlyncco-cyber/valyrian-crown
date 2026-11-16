-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER FOR ADMIN SIGNUP
-- Automatically creates a profile record with role = 'admin' when a user signs up
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Administrator'),
    coalesce(new.raw_user_meta_data->>'role', 'admin')
  )
  on conflict (id) do update
  set role = coalesce(excluded.role, 'admin'),
      full_name = coalesce(excluded.full_name, profiles.full_name);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute automatically after auth.users row creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
