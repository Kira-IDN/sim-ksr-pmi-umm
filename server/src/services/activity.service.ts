import { prisma } from '../config/prisma';
import { createAuditLog } from '../utils/auditLogger';

export class ActivityService {
  static async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: { isDeleted: false },
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: { creator: { select: { name: true } } }
      }),
      prisma.activity.count({ where: { isDeleted: false } })
    ]);
    return { activities, total };
  }

  static async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const activity = await tx.activity.create({
        data: {
          title: data.title,
          description: data.description,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          status: 'Pending',
          createdBy: userId,
        }
      });

      await createAuditLog({
        userId,
        module: 'Manajemen Kegiatan',
        action: 'Create',
        targetTable: 'activities',
        targetId: activity.id,
        newValue: activity,
      }, tx);

      return activity;
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.activity.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) throw { status: 404, message: 'Activity not found' };

      const updated = await tx.activity.update({
        where: { id },
        data: {
          title: data.title || existing.title,
          description: data.description || existing.description,
          startDate: data.startDate ? new Date(data.startDate) : existing.startDate,
          endDate: data.endDate ? new Date(data.endDate) : existing.endDate,
        }
      });

      await createAuditLog({
        userId,
        module: 'Manajemen Kegiatan',
        action: 'Update',
        targetTable: 'activities',
        targetId: id,
        oldValue: existing,
        newValue: updated,
      }, tx);

      return updated;
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.activity.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) throw { status: 404, message: 'Activity not found' };

      await tx.activity.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
        }
      });

      await createAuditLog({
        userId,
        module: 'Manajemen Kegiatan',
        action: 'Delete',
        targetTable: 'activities',
        targetId: id,
        oldValue: { isDeleted: false },
        newValue: { isDeleted: true },
      }, tx);
    });
  }

  static async approve(id: string, approverId: string, status: string, notes?: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.activity.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) throw { status: 404, message: 'Activity not found' };

      const updated = await tx.activity.update({
        where: { id },
        data: { status }
      });

      await tx.approvalLog.create({
        data: {
          targetId: id,
          targetType: 'Activity',
          approverId,
          status,
          notes,
        }
      });

      await createAuditLog({
        userId: approverId,
        module: 'Manajemen Kegiatan',
        action: 'Approve',
        targetTable: 'activities',
        targetId: id,
        oldValue: { status: existing.status },
        newValue: { status: updated.status },
      }, tx);

      return updated;
    });
  }
}
