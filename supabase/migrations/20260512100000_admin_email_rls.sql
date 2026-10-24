-- Tighten write-access RLS on admin-managed tables:
-- previously any authenticated user could write; now only allow-listed admin
-- emails can. Reads keep their existing public/published policies.
--
-- To add or change admins, update the allowlist below and re-run.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(auth.jwt() ->> 'email', '') IN (
    'donnie@citykid.me'
  );
$$;

-- Sermons
DROP POLICY IF EXISTS "Authenticated users can manage sermons" ON sermons;
DROP POLICY IF EXISTS "Admins can manage sermons" ON sermons;
CREATE POLICY "Admins can manage sermons"
  ON sermons
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Blog posts
DROP POLICY IF EXISTS "Authenticated users can do everything on blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts"
  ON blog_posts
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Events
DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events"
  ON events
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Media items
DROP POLICY IF EXISTS "Authenticated users can manage media" ON media_items;
DROP POLICY IF EXISTS "Admins can manage media" ON media_items;
CREATE POLICY "Admins can manage media"
  ON media_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
