import { prisma } from '../config/prisma';

export class RoleService {
  static async getAllRoles() {
    return prisma.role.findMany({
      select: {
        id: true,
        name: true,
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  static async getAllPermissions() {
    return prisma.permission.findMany({
      orderBy: [
        { module: 'asc' },
        { action: 'asc' }
      ]
    });
  }
}
