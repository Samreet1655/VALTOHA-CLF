import bcrypt from 'bcryptjs';

/**
 * Validates admin credentials against environment variables
 * @param {string} username - Admin username to verify
 * @param {string} password - Admin password to verify
 * @returns {boolean} True if credentials match
 */
export const validateAdminCredentials = (username, password) => {
  const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error('Admin credentials not configured');
    return false;
  }

  return username.trim() === adminUsername && password === adminPassword;
};

/**
 * Validates cadre password using bcrypt
 * @param {string} inputPassword - Password entered by user
 * @param {string} hashedPassword - Bcrypt hashed password from database
 * @returns {Promise<boolean>} True if password matches
 */
export const validateCadrePassword = async (inputPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    console.error('Password validation error:', error);
    return false;
  }
};

/**
 * Checks if user is authenticated in current session
 * @returns {object|null} Session data if authenticated, null otherwise
 */
export const getSessionData = () => {
  const role = sessionStorage.getItem('active_role');
  const cadreData = sessionStorage.getItem('active_cadre');

  if (!role) return null;

  return {
    role,
    cadre: cadreData ? JSON.parse(cadreData) : null
  };
};

/**
 * Clears all session data
 */
export const clearSession = () => {
  sessionStorage.clear();
};

/**
 * Sets admin session
 */
export const setAdminSession = () => {
  sessionStorage.setItem('active_role', 'admin');
  sessionStorage.removeItem('active_cadre');
};

/**
 * Sets cadre session
 * @param {object} cadreProfile - Cadre profile data
 */
export const setCadreSession = (cadreProfile) => {
  sessionStorage.setItem('active_role', 'cadre');
  const payload = {
    cadreId: cadreProfile.cadre_id,
    name: cadreProfile.name,
    villages: cadreProfile.assigned_villages || []
  };
  sessionStorage.setItem('active_cadre', JSON.stringify(payload));
};
