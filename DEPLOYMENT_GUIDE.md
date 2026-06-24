# 🚀 Deployment Configuration Guide

## ✅ Fixed Issues

### 1. **Security: Exposed Credentials** ✓
- **Issue**: `.env` file was committed to git with sensitive credentials exposed
- **Fix**: Added `.env` to `.gitignore` to prevent future commits
- **Action**: `.env` file will no longer be tracked in version control

### 2. **Security: Plain Text Passwords** ✓
- **Issue**: Password comparison was done with plain strings instead of secure hashing
- **Fix**: Implemented `bcryptjs` for secure password hashing and comparison
- **Action**: All cadre passwords must be bcrypt-hashed in database

### 3. **Security: Hardcoded Credentials** ✓
- **Issue**: Admin username and password were hardcoded in `config.js`
- **Fix**: Moved to environment variables (`VITE_ADMIN_USERNAME`, `VITE_ADMIN_PASSWORD`)
- **Action**: Update `.env` with actual admin credentials before deployment

### 4. **Configuration: Missing Environment Template** ✓
- **Issue**: No `.env.example` file for reference
- **Fix**: Created `.env.example` with all required environment variables
- **Action**: Use as template for deployment environments

### 5. **Configuration: Incomplete Capacitor Config** ✓
- **Issue**: `capacitor.config.json` missing platform-specific settings
- **Fix**: Enhanced with iOS, Android, and plugin configurations
- **Action**: Review and customize for your deployment target

### 6. **Code Quality: Unused Imports** ✓
- **Issue**: Unused imports in AdminDashboard
- **Fix**: Removed unused `DEFAULT_USER` import
- **Action**: Code is now cleaner

---

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Copy `.env.example` to `.env.local` (for development) or `.env.production` (for production)
- [ ] Update `VITE_ADMIN_USERNAME` with actual admin username
- [ ] Update `VITE_ADMIN_PASSWORD` with actual admin password
- [ ] Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- [ ] Confirm `VITE_ADMIN_RECOVERY_PHONE` is set

### Database Setup
- [ ] Ensure Supabase `profiles` table has:
  - `cadre_id` (string, unique)
  - `name` (string)
  - `password` (string) - **MUST BE BCRYPT HASHED**
  - `phone` (string)
  - `assigned_villages` (array)
  - `role` (string, enum: 'admin' or 'cadre')

### Build & Test
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run build` to compile the project
- [ ] Verify `dist/` folder is created with all assets
- [ ] Test login functionality with test admin credentials
- [ ] Test cadre login with test user from database
- [ ] Verify all routes navigate correctly
- [ ] Test form submissions and data persistence

### Android Deployment (if applicable)
- [ ] Run `npx cap build android` to generate APK
- [ ] Update `capacitor.config.json` with correct `appId`
- [ ] Configure signing keys for release build
- [ ] Test on physical device or emulator
- [ ] Check Android-specific permissions if needed

### iOS Deployment (if applicable)
- [ ] Run `npx cap build ios` to generate Xcode project
- [ ] Open in Xcode and configure signing certificates
- [ ] Test on physical device or simulator
- [ ] Verify app permissions and capabilities

### Web Deployment
- [ ] Ensure environment variables are set in deployment platform:
  - For Vercel/Netlify: Add to Environment Variables section
  - For custom server: Ensure `.env` is loaded before app starts
- [ ] Test CORS settings if backend is on different domain
- [ ] Verify Supabase connection is accessible from deployment region
- [ ] Test all API calls work from deployed URL

---

## 🔐 Security Best Practices

### Before Deployment
1. **Rotate Supabase Keys**: Generate new anon keys and public keys
2. **Secure Admin Password**: Use strong, unique password
3. **Enable HTTPS**: Ensure all connections are encrypted
4. **Database Security**: Set Supabase RLS (Row Level Security) policies
5. **Environment Variables**: Never commit sensitive data to git

### Production Checklist
- [ ] All credentials use environment variables
- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` exists with placeholders
- [ ] No console.log statements with sensitive data
- [ ] Supabase RLS policies are configured
- [ ] Database backups are enabled
- [ ] Monitoring/logging is set up

---

## 📚 Key Files Modified

1. **`.gitignore`** - Added `.env` exclusion
2. **`src/config.js`** - Updated to use environment variables
3. **`src/supabaseClient.js`** - Added validation for env variables
4. **`src/pages/LoginPage.jsx`** - Implemented bcrypt password verification
5. **`src/pages/AdminDashboard.jsx`** - Updated to use env variables
6. **`capacitor.config.json`** - Enhanced with platform configs
7. **`src/utils/authHelpers.js`** - NEW: Authentication utilities
8. **`.env.example`** - NEW: Environment template

---

## 🚨 Critical Environment Variables

```
VITE_SUPABASE_URL          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY     # Your Supabase anon key
VITE_ADMIN_USERNAME        # Admin login username
VITE_ADMIN_PASSWORD        # Admin login password
VITE_ADMIN_RECOVERY_PHONE  # Admin recovery phone number
```

---

## ⚠️ Important Notes

1. **Password Hashing**: Cadre passwords in database MUST be bcrypt-hashed. Use bcrypt tools to hash before storing.
2. **Session Storage**: Uses `sessionStorage` which clears on browser close. Consider `localStorage` if persistence needed.
3. **CORS**: If Supabase and app are on different domains, ensure CORS is properly configured.
4. **Rate Limiting**: Consider adding rate limiting to login endpoint to prevent brute force attacks.

---

## 📞 Troubleshooting

### "Environment variables not configured"
- Ensure `.env` file exists in project root
- Verify variable names match exactly (case-sensitive)
- Restart dev server after changing `.env`

### "Database Error: undefined"
- Check Supabase credentials in `.env`
- Verify Supabase project is active
- Check table name and column names match code

### "Invalid Password" always shows
- Ensure passwords in database are bcrypt-hashed
- Verify plain text passwords are not being stored
- Use `bcryptjs` tool to generate hashes

### Android APK won't install
- Check `appId` in `capacitor.config.json` is unique
- Verify signing certificate is valid
- Check device compatibility
