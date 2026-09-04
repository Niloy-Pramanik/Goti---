ALTER TABLE invitations ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE CASCADE;
CREATE INDEX idx_invitations_team ON invitations(team_id);
