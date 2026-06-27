import { prisma } from '../config/prisma';
import { createAuditLog } from '../utils/auditLogger';

export class ComplaintService {
  static async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where: { isDeleted: false },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { submitter: { select: { name: true, nia: true } } }
      }),
      prisma.complaint.count({ where: { isDeleted: false } })
    ]);
    return { complaints, total };
  }

  static async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const complaint = await tx.complaint.create({
        data: {
          category: data.category,
          title: data.title,
          description: data.description,
          status: 'Open',
          userId,
        }
      });

      await createAuditLog({
        userId,
        module: 'Aspirasi/Pengaduan',
        action: 'Create',
        targetTable: 'complaints',
        targetId: complaint.id,
        newValue: complaint,
      }, tx);

      return complaint;
    });
  }

  static async updateStatus(id: string, status: string, responderId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.complaint.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) throw { status: 404, message: 'Complaint not found' };

      const updated = await tx.complaint.update({
        where: { id },
        data: { status, handledBy: responderId }
      });

      await createAuditLog({
        userId: responderId,
        module: 'Aspirasi/Pengaduan',
        action: 'Update Status',
        targetTable: 'complaints',
        targetId: id,
        oldValue: { status: existing.status },
        newValue: { status: updated.status },
      }, tx);

      return updated;
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.complaint.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) throw { status: 404, message: 'Complaint not found' };

      await tx.complaint.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
        }
      });

      await createAuditLog({
        userId,
        module: 'Aspirasi/Pengaduan',
        action: 'Delete',
        targetTable: 'complaints',
        targetId: id,
        oldValue: { isDeleted: false },
        newValue: { isDeleted: true },
      }, tx);
    });
  }
}
