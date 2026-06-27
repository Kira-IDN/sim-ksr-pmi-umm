import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';
import { createAuditLog } from '../utils/auditLogger';

export class UserService {
  static async getAllUsers() {
    return prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        nia: true,
        name: true,
        division: true,
        generation: true,
        status: true,
        roleId: true,
        role: { select: { name: true } },
      }
    });
  }

  static async createUser(data: any, adminId: string, reqIp?: string, reqUa?: string) {
    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          nia: data.nia,
          name: data.name,
          passwordHash,
          roleId: data.roleId,
          division: data.division,
          generation: data.generation,
          status: data.status,
        }
      });

      await createAuditLog({
        userId: adminId,
        module: 'Data Anggota',
        action: 'Create',
        targetTable: 'users',
        targetId: newUser.id,
        newValue: { nia: data.nia, name: data.name, roleId: data.roleId },
      }, tx);

      return newUser;
    });
  }

  static async updateUser(id: string, data: any, adminId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.user.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) {
        throw { status: 404, message: 'User not found' };
      }

      let passwordHash = existing.passwordHash;
      if (data.password) {
        passwordHash = await bcrypt.hash(data.password, 10);
      }

      const updated = await tx.user.update({
        where: { id },
        data: {
          nia: data.nia || existing.nia,
          name: data.name || existing.name,
          roleId: data.roleId || existing.roleId,
          division: data.division || existing.division,
          generation: data.generation || existing.generation,
          status: data.status || existing.status,
          passwordHash,
        }
      });

      await createAuditLog({
        userId: adminId,
        module: 'Data Anggota',
        action: 'Update',
        targetTable: 'users',
        targetId: id,
        oldValue: { nia: existing.nia, name: existing.name },
        newValue: { nia: updated.nia, name: updated.name },
      }, tx);

      return updated;
    });
  }

  static async softDeleteUser(id: string, adminId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.user.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) {
        throw { status: 404, message: 'User not found' };
      }

      await tx.user.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: adminId,
        }
      });

      await createAuditLog({
        userId: adminId,
        module: 'Data Anggota',
        action: 'Delete',
        targetTable: 'users',
        targetId: id,
        oldValue: { isDeleted: false },
        newValue: { isDeleted: true },
      }, tx);
    });
  }
}
