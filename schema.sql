CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  height_cm DECIMAL(5,1),
  goal_weight_kg DECIMAL(5,1),
  unit_preference TEXT DEFAULT 'kg',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE weight_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE body_measurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  waist_cm DECIMAL(5,1),
  hip_cm DECIMAL(5,1),
  chest_cm DECIMAL(5,1),
  thigh_cm DECIMAL(5,1),
  arm_cm DECIMAL(5,1),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_weight_entries_user_date ON weight_entries(user_id, date DESC);
CREATE INDEX idx_body_measurements_user_date ON body_measurements(user_id, date DESC);

-- Migration helper for existing databases:
-- ALTER TABLE users ADD COLUMN goal_weight_kg DECIMAL(5,1);
-- ALTER TABLE users ADD COLUMN unit_preference TEXT DEFAULT 'kg';
