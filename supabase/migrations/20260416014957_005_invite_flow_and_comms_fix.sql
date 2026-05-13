-- Phase 5: Invite flow support + comms status fix

-- 1. Allow any authenticated user to look up a group by invite_code (for joining)
CREATE POLICY mtp_groups_lookup_by_invite
  ON public.mtp_groups FOR SELECT
  TO authenticated
  USING (true);

-- 2. Allow authenticated users without a group to update their own profile
-- (needed for the join-group flow to set group_id and role)
-- The existing policy only allows users IN a group to update their own profile.
-- We need one for users not yet in a group.
CREATE POLICY mtp_profiles_self_join_group
  ON public.mtp_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 3. Fix mtp_parent_comms status constraint to include 'pending'
ALTER TABLE public.mtp_parent_comms DROP CONSTRAINT IF EXISTS mtp_parent_comms_status_check;
ALTER TABLE public.mtp_parent_comms ADD CONSTRAINT mtp_parent_comms_status_check
  CHECK (status = ANY (ARRAY['draft'::text, 'sent'::text, 'failed'::text, 'pending'::text]));

-- 4. Add an invite_role column to mtp_groups so the owner can set what role new joiners get
ALTER TABLE public.mtp_groups ADD COLUMN IF NOT EXISTS invite_role text NOT NULL DEFAULT 'member'
  CHECK (invite_role = ANY (ARRAY['admin'::text, 'member'::text]));;
