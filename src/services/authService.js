/**
 * GoTicket Authentication Service (Mock / Development Implementation)
 * 
 * FUTURE BACKEND INTEGRATION:
 * When connecting to FastAPI + MySQL backend, replace the LocalStorage implementation below
 * with asynchronous HTTP calls using Axios or fetch API:
 * 
 * example:
 * export const login = async (email, password) => {
 *   const response = await axios.post('/api/v1/auth/login', { email, password });
 *   const { token, user } = response.data;
 *   localStorage.setItem('authToken', token);
 *   localStorage.setItem('authUser', JSON.stringify(user));
 *   return user;
 * };
 */

const DEMO_EMAIL    = 'demo@goticket.in';
const DEMO_PASSWORD = 'demo123';
const DEMO_NAME     = 'Demo User';
const DEMO_MOBILE   = '9876543210';

export const authService = {
  /**
   * Authenticate user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} user object
   */
  async login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();

    // 1. Check Demo Credentials
    if (cleanEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const user = {
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        mobile: DEMO_MOBILE,
        token: 'token-demo-' + Date.now(),
      };
      this._persistSession(user);
      return user;
    }

    // 2. Check Locally Registered Users in LocalStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const found = users.find(
      (u) => u.email === cleanEmail && u.password === password
    );

    if (found) {
      const user = {
        name: found.name,
        email: found.email,
        mobile: found.mobile || DEMO_MOBILE,
        token: 'token-' + Date.now(),
      };
      this._persistSession(user);
      return user;
    }

    // 3. Fallback error if credentials do not match
    throw new Error('Invalid email or password. Please try again or create a new account.');
  },

  /**
   * Register a new user account
   * @param {Object} userData { name, email, mobile, password }
   * @returns {Promise<Object>} user object
   */
  async signup({ name, email, mobile, password }) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    const existing = users.find((u) => u.email === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUserRecord = {
      name: name.trim(),
      email: cleanEmail,
      mobile: (mobile || '').trim(),
      password,
      registeredAt: new Date().toISOString(),
    };

    users.push(newUserRecord);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    const user = {
      name: newUserRecord.name,
      email: newUserRecord.email,
      mobile: newUserRecord.mobile,
      token: 'token-' + Date.now(),
    };

    this._persistSession(user);
    return user;
  },

  /**
   * Get currently authenticated user from persisted storage
   * @returns {Object|null}
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('authUser');
      if (userStr) {
        return JSON.parse(userStr);
      }
      // Legacy fallback check for userName key in existing GoTicket repo
      const userName = localStorage.getItem('userName');
      if (userName) {
        return {
          name: userName,
          email: localStorage.getItem('userEmail') || '',
          mobile: localStorage.getItem('userMobile') || '',
          token: localStorage.getItem('authToken') || 'token-existing',
        };
      }
    } catch (e) {
      console.error('Error reading user session:', e);
    }
    return null;
  },

  /**
   * Logout user and clear session
   */
  async logout() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userMobile');
    localStorage.removeItem('authToken');
  },

  /**
   * Internal helper to persist active session in localStorage
   * @private
   */
  _persistSession(user) {
    localStorage.setItem('authUser', JSON.stringify(user));
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userMobile', user.mobile);
    localStorage.setItem('authToken', user.token);
  }
};

export default authService;
