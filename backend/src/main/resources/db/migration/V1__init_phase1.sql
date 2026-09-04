-- Phase 1 schema: users, organizations, organization_members, teams, team_members, projects
-- No Phase 2 tables (milestones, issues, progress_logs)

-- Users
CREATE TABLE users (
    id          UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Organizations
CREATE TABLE organizations (
    id          UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Organization Members (junction: users <-> organizations)
CREATE TABLE organization_members (
    org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'MEMBER')),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (org_id, user_id)
);

-- Teams
CREATE TABLE teams (
    id          UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_teams_org_id ON teams(org_id);

-- Team Members (junction: users <-> teams)
CREATE TABLE team_members (
    team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        VARCHAR(20) NOT NULL CHECK (role IN ('LEAD', 'MEMBER')),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

-- Projects
CREATE TABLE projects (
    id           UUID DEFAULT RANDOM_UUID() PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    description  TEXT,
    team_id      UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    repo_link    VARCHAR(500),
    meeting_link VARCHAR(500),
    storage_link VARCHAR(500),
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_team_id ON projects(team_id);
