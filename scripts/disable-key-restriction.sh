#!/bin/bash

# Script to disable service account key creation restriction
# This allows you to download service account keys for your project

PROJECT_ID="dulcet-aileron-468217-a7"
ORGANIZATION_ID=$(gcloud projects describe $PROJECT_ID --format="value(parent.id)")

echo "🔓 Disabling service account key creation restriction..."
echo "Project: $PROJECT_ID"
echo "Organization: $ORGANIZATION_ID"
echo ""

# Option 1: Completely disable the policy (less secure)
disable_completely() {
    echo "Disabling policy completely for the organization..."
    gcloud resource-manager org-policies delete \
        iam.disableServiceAccountKeyCreation \
        --organization=$ORGANIZATION_ID
    echo "✅ Policy disabled - keys can now be created"
}

# Option 2: Allow for specific project only (more secure)
allow_for_project() {
    echo "Creating custom policy to allow keys for project $PROJECT_ID only..."
    
    cat > /tmp/policy.yaml << EOF
name: organizations/$ORGANIZATION_ID/policies/iam.disableServiceAccountKeyCreation
spec:
  rules:
  - denyAll: true
  - allowAll: true
    condition:
      expression: "resource.project == '$PROJECT_ID'"
      title: "Allow keys for emailtotext project"
      description: "Allows service account key creation for the emailtotext project only"
EOF

    gcloud org-policies set-policy /tmp/policy.yaml
    echo "✅ Policy updated - keys can now be created for project $PROJECT_ID"
}

# Option 3: Temporarily disable (for testing)
temporary_disable() {
    echo "Temporarily disabling policy..."
    gcloud resource-manager org-policies allow \
        iam.disableServiceAccountKeyCreation \
        --project=$PROJECT_ID
    echo "✅ Policy temporarily disabled for project"
    echo "⚠️  Remember to re-enable for security!"
}

echo "Choose an option:"
echo "1) Disable completely for organization (least secure)"
echo "2) Allow for this project only (recommended)"
echo "3) Temporarily disable for project"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        disable_completely
        ;;
    2)
        allow_for_project
        ;;
    3)
        temporary_disable
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎯 Next steps:"
echo "1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=$PROJECT_ID"
echo "2. Click on: emailtotextnotify@dulcet-aileron-468217-a7.iam.gserviceaccount.com"
echo "3. Go to 'Keys' tab"
echo "4. Click 'Add Key' → 'Create new key' → JSON"
echo "5. Save as ga4-credentials.json"
echo "6. Run: npx tsx scripts/setup-ga4-config.ts"