import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createAuditLog } from '../utils/auditLogger';

export class AuthService {
  static async login(nia: string, password: string, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({
      where: { nia, isDeleted: false },
      include: { role: true },
    });

    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    // Generate tokens
    const payload = { id: user.id, roleId: user.roleId, nia: user.nia };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any,
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });

    // Save refresh token to DB (Atomic Transaction)
    await prisma.$transaction(async (tx) => {
      // Create token
      await tx.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          ipAddress: ipAddress || null,
          deviceInfo: userAgent || null,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Audit Log
      await createAuditLog({
        userId: user.id,
        module: 'Auth',
        action: 'Login',
        targetTable: 'users',
        targetId: user.id,
      }, tx);
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        nia: user.nia,
        role: user.role.name,
      }
    };
  }

  static async refresh(token: string) {
    if (!token) throw { status: 401, message: 'Refresh token required' };

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    } catch (e) {
      throw { status: 401, message: 'Invalid or expired refresh token' };
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.user.isDeleted) {
      throw { status: 401, message: 'Token not found or user deleted' };
    }

    const payload = { id: tokenRecord.user.id, roleId: tokenRecord.user.roleId, nia: tokenRecord.user.nia };
    const newAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any,
    });

    return { accessToken: newAccessToken };
  }

  static async logout(token: string, userId: string) {
    await prisma.$transaction(async (tx) => {
      await tx.refreshToken.deleteMany({
        where: { token, userId },
      });

      await createAuditLog({
        userId,
        module: 'Auth',
        action: 'Logout',
        targetTable: 'users',
        targetId: userId,
      }, tx);
    });
  }
}
