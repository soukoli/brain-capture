#!/bin/bash
# Generate PostgreSQL connection string with IAM authentication token
#
# IMPORTANT: This is an example script for AWS RDS IAM authentication.
# Update the configuration below with your actual RDS instance details.
# This script is useful for Vercel deployments with AWS RDS.

# Configuration - UPDATE THESE WITH YOUR VALUES
AWS_REGION="us-east-1"
PGHOST="my-brain-capture.cluster-c4vyo86kug4b.us-east-1.rds.amazonaws.com"  # Replace with your RDS endpoint
PGPORT="5432"
PGUSER="postgres"  # Replace with your DB user
PGDATABASE="postgres"  # Replace with your database name

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
