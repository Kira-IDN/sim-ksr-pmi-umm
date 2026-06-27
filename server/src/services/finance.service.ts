import { prisma } from '../config/prisma';
import { createAuditLog } from '../utils/auditLogger';

export class FinanceService {
  static async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [finances, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where: { isDeleted: false },
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: { creator: { select: { name: true, nia: true } } }
      }),
      prisma.financialRecord.count({ where: { isDeleted: false } })
    ]);
    return { finances, total };
  }

  static async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const finance = await tx.financialRecord.create({
        data: {
          title: data.title,
          categoryId: data.categoryId,
          type: data.type,
          amount: data.amount,
          date: new Date(data.transactionDate),
          createdBy: userId,
        }
      });

      await createAuditLog({
        userId,
        module: 'Keuangan',
        action: 'Create',
        targetTable: 'finances',
        targetId: finance.id,
        newValue: finance,
      }, tx);

      return finance;
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.financialRecord.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) throw { status: 404, message: 'Finance record not found' };

      const updated = await tx.financialRecord.update({
        where: { id },
        data: {
          title: data.title || existing.title,
          categoryId: data.categoryId || existing.categoryId,
          type: data.type || existing.type,
          amount: data.amount || existing.amount,
          date: data.transactionDate ? new Date(data.transactionDate) : existing.date,
        }
      });

      await createAuditLog({
        userId,
        module: 'Keuangan',
        action: 'Update',
        targetTable: 'finances',
        targetId: id,
        oldValue: existing,
        newValue: updated,
      }, tx);

      return updated;
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.financialRecord.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) throw { status: 404, message: 'Finance record not found' };

      await tx.financialRecord.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
        }
      });

      await createAuditLog({
        userId,
        module: 'Keuangan',
        action: 'Delete',
        targetTable: 'finances',
        targetId: id,
        oldValue: { isDeleted: false },
        newValue: { isDeleted: true },
      }, tx);
    });
  }
}
