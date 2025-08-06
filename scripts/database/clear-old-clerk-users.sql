-- SQL query to clear old Clerk user data after migrating to new Clerk account
-- Run this in your Supabase SQL editor

-- Option 1: Delete the user completely
DELETE FROM users 
WHERE clerk_id = 'user_30saNhCSCvsyavbY00XZqXWFQk1';

-- Option 2: Keep the user data but clear the clerk_id (if you want to preserve the data)
-- UPDATE users 
-- SET clerk_id = NULL 
-- WHERE clerk_id = 'user_30saNhCSCvsyavbY00XZqXWFQk1';

-- View all users to confirm
SELECT id, clerk_id, phone, email, plan_type, created_at 
FROM users 
ORDER BY created_at DESC;