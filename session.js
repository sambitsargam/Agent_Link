// Simple in-memory session management for user conversations
class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  }

  getSession(userId) {
    const session = this.sessions.get(userId);
    if (session && Date.now() - session.lastActivity < this.SESSION_TIMEOUT) {
      session.lastActivity = Date.now();
      return session;
    }
    
    // Create new session if expired or doesn't exist
    const newSession = {
      userId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      messageCount: 0,
      context: {},
      wallets: [],
      preferences: {
        language: 'en',
        notifications: true
      }
    };
    
    this.sessions.set(userId, newSession);
    return newSession;
  }

  updateSession(userId, updates) {
    const session = this.getSession(userId);
    Object.assign(session, updates);
    session.lastActivity = Date.now();
    return session;
  }

  addWalletToSession(userId, wallet) {
    const session = this.getSession(userId);
    if (!session.wallets.find(w => w.address === wallet.address)) {
      session.wallets.push({
        address: wallet.address,
        nickname: wallet.nickname || `Wallet ${session.wallets.length + 1}`,
        createdAt: Date.now()
      });
    }
    return session;
  }

  getUserWallets(userId) {
    const session = this.getSession(userId);
    return session.wallets || [];
  }

  setContext(userId, key, value) {
    const session = this.getSession(userId);
    session.context[key] = value;
    return session;
  }

  getContext(userId, key) {
    const session = this.getSession(userId);
    return session.context[key];
  }

  incrementMessageCount(userId) {
    const session = this.getSession(userId);
    session.messageCount++;
    return session.messageCount;
  }

  clearSession(userId) {
    this.sessions.delete(userId);
  }

  // Clean up expired sessions periodically
  cleanupExpiredSessions() {
    const now = Date.now();
    for (const [userId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.SESSION_TIMEOUT) {
        this.sessions.delete(userId);
      }
    }
  }

  getAllActiveSessions() {
    return Array.from(this.sessions.values());
  }
}

// Create global session manager instance
const sessionManager = new SessionManager();

// Clean up expired sessions every 10 minutes
setInterval(() => {
  sessionManager.cleanupExpiredSessions();
}, 10 * 60 * 1000);

module.exports = sessionManager;
