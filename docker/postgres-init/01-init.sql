-- Initial database setup for microservice planner
-- This script runs when PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create schemas for future use
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS audit;

-- Create basic tables for future features
CREATE TABLE IF NOT EXISTS app.architectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    version INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS app.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    complexity VARCHAR(50),
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_official BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS audit.architecture_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    architecture_id UUID REFERENCES app.architectures(id),
    action VARCHAR(50) NOT NULL,
    changes JSONB,
    changed_by UUID,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_architectures_created_by ON app.architectures(created_by);
CREATE INDEX IF NOT EXISTS idx_architectures_created_at ON app.architectures(created_at);
CREATE INDEX IF NOT EXISTS idx_architectures_tags ON app.architectures USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_templates_category ON app.templates(category);
CREATE INDEX IF NOT EXISTS idx_audit_architecture_id ON audit.architecture_changes(architecture_id);
CREATE INDEX IF NOT EXISTS idx_audit_changed_at ON audit.architecture_changes(changed_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_architectures_updated_at BEFORE UPDATE ON app.architectures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON app.templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA app TO microplan;
GRANT USAGE ON SCHEMA audit TO microplan;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app TO microplan;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA audit TO microplan;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA app TO microplan;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA audit TO microplan;