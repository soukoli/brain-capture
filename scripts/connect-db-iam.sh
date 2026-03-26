#!/bin/bash
# Generate PostgreSQL connection string with IAM authentication token

# Configuration
AWS_REGION="us-east-1"
PGHOST="my-brain-capture.cluster-c4vyo86kug4b.us-east-1.rds.amazonaws.com"
PGPORT="5432"
PGUSER="postgres"
PGDATABASE="postgres"

# Generate IAM auth token (valid for 15 minutes)
echo "Generating IAM authentication token..."
PGPASSWORD=$(aws rds generate-db-auth-token \
    --hostname "$PGHOST" \
    --port "$PGPORT" \
    --username "$PGUSER" \
    --region "$AWS_REGION")

# Export for use with psql
export PGPASSWORD
export PGHOST
export PGPORT
export PGUSER
export PGDATABASE
export PGSSLMODE="require"

echo "✅ IAM token generated (valid for 15 minutes)"
echo ""
echo "You can now run:"
echo "  psql"
echo "  npm run db:init"
echo "  npm run dev"
echo ""
echo "Or use this connection string:"
echo "postgresql://$PGUSER:$PGPASSWORD@$PGHOST:$PGPORT/$PGDATABASE?sslmode=require"
