# 🗄️ Supabase Database Configuration Guide

## Required Table Structure

Your `profiles` table should have these columns:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cadre_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,              -- ⚠️ MUST BE BCRYPT HASHED
  phone TEXT,
  assigned_villages TEXT[] DEFAULT '{}', -- Array of village names
  role TEXT NOT NULL,                  -- 'admin' or 'cadre'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## ⚠️ CRITICAL: Password Hashing

### Current State
Your existing passwords in the database are likely **plain text**:
```
password: "8791"
password: "mypassword"
```

### Required State for New Code
All passwords must be **bcrypt-hashed**:
```
password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36CHhAPm"
```

### How to Hash Passwords

#### Option 1: Using the Provided Script
```bash
# Hash a single password
node scripts/hashPassword.js "8791"

# Output:
# $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36CHhAPm
```

#### Option 2: In Supabase SQL Editor
```sql
-- First, install pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash all existing passwords (one-time migration)
UPDATE profiles
SET password = crypt(password, gen_salt('bf'))
WHERE password IS NOT NULL AND password !~ '^\$2[aby]\$';
-- ☝️ This regex checks if password is NOT already hashed

-- Hash a single password for insertion
SELECT crypt('8791', gen_salt('bf'));
```

#### Option 3: Update Individual Records
```sql
-- Hash a specific password
UPDATE profiles
SET password = crypt('8791', gen_salt('bf'))
WHERE cadre_id = 'CADRE_ID_HERE';
```

---

## 🔐 Row Level Security (RLS) Setup

### CRITICAL: Enable RLS
1. Go to Supabase Dashboard → Authentication → Policies
2. Enable RLS on `profiles` table
3. Add these policies:

### Policy 1: Cadres can only read their own profile
```sql
CREATE POLICY "Cadres can read own profile" ON profiles
  FOR SELECT
  USING (
    auth.uid()::text = cadre_id OR 
    (SELECT role FROM profiles WHERE id = auth.uid()::text LIMIT 1) = 'admin'
  );
```

### Policy 2: Admin can read all profiles
```sql
CREATE POLICY "Admin can read all profiles" ON profiles
  FOR SELECT
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );
```

### Policy 3: Only app service can insert
```sql
CREATE POLICY "Authenticated users can insert" ON profiles
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### Policy 4: Users can only update their own profile
```sql
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid()::text = cadre_id)
  WITH CHECK (auth.uid()::text = cadre_id);
```

---

## 📋 Pre-Deployment Supabase Checklist

### Database Setup
- [ ] `profiles` table exists with correct columns
- [ ] All passwords are **bcrypt-hashed** (not plain text)
- [ ] `cadre_id` column has UNIQUE constraint
- [ ] `role` column contains 'admin' or 'cadre'
- [ ] `assigned_villages` is array/JSON type

### Security Setup
- [ ] RLS (Row Level Security) is **ENABLED** on profiles table
- [ ] RLS policies are configured (use provided SQL above)
- [ ] Anon key has minimal required permissions
- [ ] No direct table access without filters

### Testing in Supabase
- [ ] Can query profile by `cadre_id` and get correct data
- [ ] Password field is hashed (not readable as plain text)
- [ ] RLS policies prevent unauthorized access

### Backup & Access
- [ ] Database backups are enabled
- [ ] Only necessary staff have Supabase admin access
- [ ] Sensitive keys are rotated regularly

---

## 🔄 Password Migration Process

### Step 1: Backup Your Database
```sql
-- Create backup table
CREATE TABLE profiles_backup AS SELECT * FROM profiles;
```

### Step 2: Hash All Passwords
```sql
-- Install pgcrypto if not installed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash all plain text passwords
UPDATE profiles
SET password = crypt(password, gen_salt('bf'))
WHERE password IS NOT NULL 
  AND password !~ '^\$2[aby]\$'  -- Skip already-hashed passwords
  AND length(password) < 100;     -- Skip hashed passwords (they're 60+ chars)
```

### Step 3: Verify Hashing
```sql
-- Check that passwords are hashed
SELECT cadre_id, password FROM profiles LIMIT 5;

-- Should look like:
-- cadre_id | password
-- CADRE-001| $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36CHhAPm
```

### Step 4: Test Login
- Use your app to login with original plain text password
- If login works, hashing is correct! ✅

---

## 🚨 Common Supabase Issues & Fixes

### Issue: "Database Error: undefined"
**Cause**: Missing or wrong Supabase credentials
**Fix**: Check `.env` file has correct:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Issue: Login always fails with valid credentials
**Cause**: Passwords not bcrypt-hashed
**Fix**: Run the password migration SQL above

### Issue: "Permission denied" error
**Cause**: RLS policies preventing access
**Fix**: Check RLS policies are correctly configured

### Issue: Can't insert new cadre records
**Cause**: RLS or column constraints
**Fix**: 
- Verify RLS policy allows INSERT
- Check `cadre_id` is unique and not null
- Verify all required columns have values

---

## 💾 Inserting Test Data

### Using Supabase Dashboard
1. Go to Table Editor
2. Click "Insert row"
3. Fill in fields:
   - `cadre_id`: "TEST-001"
   - `name`: "Test Cadre"
   - `password`: Use hashed value from script
   - `phone`: "9999999999"
   - `assigned_villages`: ["VALTOHA", "THATHA"]
   - `role`: "cadre"

### Using SQL
```sql
INSERT INTO profiles (cadre_id, name, password, phone, assigned_villages, role)
VALUES (
  'TEST-001',
  'Test Cadre',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36CHhAPm', -- hashed password
  '9999999999',
  ARRAY['VALTOHA', 'THATHA'],
  'cadre'
);
```

---

## ✅ Testing Your Setup

### Test 1: Direct Query
In Supabase SQL Editor:
```sql
SELECT cadre_id, name, phone, assigned_villages, role
FROM profiles
WHERE cadre_id = 'TEST-001';
```
✅ Should return one row

### Test 2: Login Test
In your app:
```
Cadre ID: TEST-001
Password: (original plain text password before hashing)
```
✅ Should successfully login

### Test 3: Security Test
```sql
-- Verify passwords are hashed (should return false)
SELECT password = 'plaintext' as is_plain_text
FROM profiles
WHERE cadre_id = 'TEST-001';
```
✅ Should return `false` (passwords are hashed)

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Hash a password | `node scripts/hashPassword.js "password"` |
| Migrate all passwords | See "Password Migration Process" above |
| Enable RLS | Dashboard → Policies → Enable RLS |
| Test query | Use Supabase SQL Editor |
| View profiles | Table Editor → profiles table |

---

## ⚠️ Important Security Notes

1. **NEVER store plain text passwords** - Always use bcrypt
2. **Hash before insertion** - Don't rely on code to hash
3. **Enable RLS immediately** - Protect your data
4. **Rotate API keys regularly** - Especially if exposed
5. **Backup before migrations** - Always have a fallback
6. **Test in development first** - Don't modify production directly

---

## 🔗 Useful Supabase Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [pgcrypto Extension](https://www.postgresql.org/docs/current/pgcrypto.html)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database/sql-editor)
