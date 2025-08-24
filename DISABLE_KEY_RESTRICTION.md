# How to Enable Service Account Key Creation

## Quick Steps (5 minutes)

### Step 1: Open Organization Policies
Go to: https://console.cloud.google.com/iam-admin/orgpolicies

### Step 2: Search for the Policy
- In the filter box, type: `disableServiceAccountKey`
- Or look for: **"Disable service account key creation"**
- You should see it's currently **Enforced**

### Step 3: Edit the Policy
1. Click on **"Disable service account key creation"**
2. Click **"MANAGE POLICY"** button
3. You'll see it's currently set to "Enforce"

### Step 4: Change the Policy

#### Option A: Disable Completely (Easiest)
- Select **"Off"** or **"Not enforced"**
- Click **"SET POLICY"**
- Done! You can now create keys

#### Option B: Allow for Specific Project (More Secure)
- Select **"Custom"**
- Click **"ADD RULE"**
- Set **Enforcement**: Off
- Add **Condition**:
  ```
  resource.project == "dulcet-aileron-468217-a7"
  ```
- Click **"SAVE"**
- Click **"SET POLICY"**

### Step 5: Create the Service Account Key
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=dulcet-aileron-468217-a7
2. Click on: `emailtotextnotify@dulcet-aileron-468217-a7.iam.gserviceaccount.com`
3. Click **"KEYS"** tab
4. Click **"ADD KEY"** → **"Create new key"**
5. Select **JSON**
6. Click **"CREATE"**
7. Save the file as `ga4-credentials.json` in your project root

### Step 6: Run the GA4 Setup
```bash
npx tsx scripts/setup-ga4-config.ts
```

## 🔒 Security Note

After you're done setting up GA4, you can re-enable the policy for security:
1. Go back to the organization policy
2. Set it back to "Enforce"
3. The GA4 setup only needs to run once

## Alternative: Keep Policy, Use Workload Identity

If you want to keep the security policy, you can use Workload Identity Federation instead, but it's more complex to set up.

## Need Help?

The policy blocking keys is actually a good security practice. Options:
1. Temporarily disable → create key → re-enable (5 min)
2. Use Workload Identity Federation (more secure but complex)
3. Do the manual GA4 setup from the checklist (15 min)

Choose based on your security requirements!