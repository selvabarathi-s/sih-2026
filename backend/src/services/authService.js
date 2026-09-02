import { SEED_USERS, ROLE_PERMISSIONS } from '../models/userModel.js';

class AuthService {
  constructor() {
    this.activeSessions = new Map();
  }

  async login(username, password) {
    const user = SEED_USERS.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.passwordHash === password
    );

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const token = `paimana_token_${user.id}_${Date.now()}`;
    const permissions = ROLE_PERMISSIONS[user.role] || [];

    const sessionData = {
      token,
      userId: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      assignedProjects: user.assignedProjects || [],
      permissions,
      createdAt: new Date().toISOString(),
    };

    this.activeSessions.set(token, sessionData);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        assignedProjects: user.assignedProjects || [],
        permissions,
      },
    };
  }

  async verifyToken(token) {
    if (!token) return null;
    const cleanToken = token.replace(/^Bearer\s+/i, '');

    // Check memory session
    if (this.activeSessions.has(cleanToken)) {
      return this.activeSessions.get(cleanToken);
    }

    // Fallback for default seed users if token format matches
    for (const user of SEED_USERS) {
      if (cleanToken.includes(user.id) || cleanToken.includes(user.role.toLowerCase())) {
        const session = {
          token: cleanToken,
          userId: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          department: user.department,
          designation: user.designation,
          assignedProjects: user.assignedProjects || [],
          permissions: ROLE_PERMISSIONS[user.role] || [],
          createdAt: new Date().toISOString(),
        };
        this.activeSessions.set(cleanToken, session);
        return session;
      }
    }

    return null;
  }

  async logout(token) {
    if (token) {
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      this.activeSessions.delete(cleanToken);
    }
    return { success: true };
  }

  getAllRoles() {
    return Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
      role,
      permissionsCount: permissions.length,
      permissions,
    }));
  }
}

export const authService = new AuthService();
