ALTER TABLE mtp_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtp_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtp_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtp_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtp_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtp_budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtp_parent_comms ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtp_parent_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtp_daily_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtp_schedule_activities ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION mtp_user_group_id()
RETURNS uuid AS $$
  SELECT group_id FROM mtp_profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION mtp_user_role()
RETURNS text AS $$
  SELECT role FROM mtp_profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "Users can view own group" ON mtp_groups FOR SELECT USING (id = mtp_user_group_id());
CREATE POLICY "Admins can update own group" ON mtp_groups FOR UPDATE USING (id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Authenticated users can create groups" ON mtp_groups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Anyone can read group by invite code" ON mtp_groups FOR SELECT USING (true);

CREATE POLICY "Users can view group profiles" ON mtp_profiles FOR SELECT USING (group_id = mtp_user_group_id() OR id = auth.uid());
CREATE POLICY "Users can update own profile" ON mtp_profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON mtp_profiles FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Group members can view trips" ON mtp_trips FOR SELECT USING (group_id = mtp_user_group_id());
CREATE POLICY "Admins can insert trips" ON mtp_trips FOR INSERT WITH CHECK (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can update trips" ON mtp_trips FOR UPDATE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can delete trips" ON mtp_trips FOR DELETE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));

CREATE POLICY "Group members can view team" ON mtp_team_members FOR SELECT USING (group_id = mtp_user_group_id());
CREATE POLICY "Admins can manage team" ON mtp_team_members FOR INSERT WITH CHECK (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can update team" ON mtp_team_members FOR UPDATE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can delete team" ON mtp_team_members FOR DELETE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));

CREATE POLICY "Group members can view training" ON mtp_training_sessions FOR SELECT USING (group_id = mtp_user_group_id());
CREATE POLICY "Admins can manage training" ON mtp_training_sessions FOR INSERT WITH CHECK (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can update training" ON mtp_training_sessions FOR UPDATE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can delete training" ON mtp_training_sessions FOR DELETE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));

CREATE POLICY "Group members can view budget" ON mtp_budget_items FOR SELECT USING (group_id = mtp_user_group_id());
CREATE POLICY "Admins can manage budget" ON mtp_budget_items FOR INSERT WITH CHECK (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can update budget" ON mtp_budget_items FOR UPDATE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can delete budget" ON mtp_budget_items FOR DELETE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));

CREATE POLICY "Group members can view comms" ON mtp_parent_comms FOR SELECT USING (group_id = mtp_user_group_id());
CREATE POLICY "Admins can manage comms" ON mtp_parent_comms FOR INSERT WITH CHECK (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can update comms" ON mtp_parent_comms FOR UPDATE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can delete comms" ON mtp_parent_comms FOR DELETE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));

CREATE POLICY "Group members can view recipients" ON mtp_parent_recipients FOR SELECT USING (group_id = mtp_user_group_id());
CREATE POLICY "Admins can manage recipients" ON mtp_parent_recipients FOR INSERT WITH CHECK (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can update recipients" ON mtp_parent_recipients FOR UPDATE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can delete recipients" ON mtp_parent_recipients FOR DELETE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));

CREATE POLICY "Group members can view schedules" ON mtp_daily_schedules FOR SELECT USING (group_id = mtp_user_group_id());
CREATE POLICY "Admins can manage schedules" ON mtp_daily_schedules FOR INSERT WITH CHECK (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can update schedules" ON mtp_daily_schedules FOR UPDATE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can delete schedules" ON mtp_daily_schedules FOR DELETE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));

CREATE POLICY "Group members can view activities" ON mtp_schedule_activities FOR SELECT USING (group_id = mtp_user_group_id());
CREATE POLICY "Admins can manage activities" ON mtp_schedule_activities FOR INSERT WITH CHECK (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can update activities" ON mtp_schedule_activities FOR UPDATE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));
CREATE POLICY "Admins can delete activities" ON mtp_schedule_activities FOR DELETE USING (group_id = mtp_user_group_id() AND mtp_user_role() IN ('owner', 'admin'));;
