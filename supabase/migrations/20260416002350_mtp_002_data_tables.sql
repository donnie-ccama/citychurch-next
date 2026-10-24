CREATE TABLE mtp_trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES mtp_groups(id) ON DELETE CASCADE,
  name text NOT NULL,
  destination text NOT NULL DEFAULT '',
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE mtp_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES mtp_trips(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES mtp_groups(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'chaperone' CHECK (role IN ('leader', 'chaperone', 'driver', 'medical', 'kitchen')),
  background_check boolean NOT NULL DEFAULT false,
  first_aid_cert boolean NOT NULL DEFAULT false,
  orientation boolean NOT NULL DEFAULT false,
  approved boolean NOT NULL DEFAULT false,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE mtp_training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES mtp_trips(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES mtp_groups(id) ON DELETE CASCADE,
  title text NOT NULL,
  session_date date,
  session_time text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE mtp_budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES mtp_trips(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES mtp_groups(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('transportation', 'lodging', 'food', 'supplies', 'activities', 'other')),
  description text NOT NULL,
  estimated_cost numeric(10,2) NOT NULL DEFAULT 0,
  actual_cost numeric(10,2) NOT NULL DEFAULT 0,
  paid boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE mtp_parent_comms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES mtp_trips(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES mtp_groups(id) ON DELETE CASCADE,
  subject text NOT NULL,
  message text NOT NULL,
  comm_type text NOT NULL DEFAULT 'email' CHECK (comm_type IN ('email', 'text', 'letter')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'failed')),
  sent_date timestamptz,
  sent_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE mtp_parent_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES mtp_groups(id) ON DELETE CASCADE,
  parent_name text NOT NULL DEFAULT '',
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  youth_name text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(group_id, email)
);

CREATE TABLE mtp_daily_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES mtp_trips(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES mtp_groups(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  schedule_date date,
  title text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE mtp_schedule_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid NOT NULL REFERENCES mtp_daily_schedules(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES mtp_groups(id) ON DELETE CASCADE,
  activity_time text NOT NULL,
  activity text NOT NULL,
  location text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mtp_trips_group ON mtp_trips(group_id);
CREATE INDEX idx_mtp_team_trip ON mtp_team_members(trip_id);
CREATE INDEX idx_mtp_team_group ON mtp_team_members(group_id);
CREATE INDEX idx_mtp_training_trip ON mtp_training_sessions(trip_id);
CREATE INDEX idx_mtp_budget_trip ON mtp_budget_items(trip_id);
CREATE INDEX idx_mtp_comms_trip ON mtp_parent_comms(trip_id);
CREATE INDEX idx_mtp_recipients_group ON mtp_parent_recipients(group_id);
CREATE INDEX idx_mtp_schedules_trip ON mtp_daily_schedules(trip_id);
CREATE INDEX idx_mtp_activities_schedule ON mtp_schedule_activities(schedule_id);;
