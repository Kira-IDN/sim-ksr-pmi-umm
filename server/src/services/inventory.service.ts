import { prisma } from '../config/prisma';
import { createAuditLog } from '../utils/auditLogger';

export class InventoryService {
  static async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where: { isDeleted: false },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.inventoryItem.count({ where: { isDeleted: false } })
    ]);
    return { items, total };
  }

  static async create(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.create({
        data: {
          categoryId: data.categoryId,
          name: data.name,
          stock: data.stock,
          condition: data.condition,
        }
      });

      await createAuditLog({
        userId,
        module: 'Inventaris',
        action: 'Create',
        targetTable: 'inventories',
        targetId: item.id,
        newValue: item,
      }, tx);

      return item;
    });
  }

  static async update(id: string, data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.inventoryItem.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) throw { status: 404, message: 'Item not found' };

      const updated = await tx.inventoryItem.update({
        where: { id },
        data: {
          categoryId: data.categoryId || existing.categoryId,
          name: data.name || existing.name,
          stock: data.stock !== undefined ? data.stock : existing.stock,
          condition: data.condition || existing.condition,
        }
      });

      await createAuditLog({
        userId,
        module: 'Inventaris',
        action: 'Update',
        targetTable: 'inventories',
        targetId: id,
        oldValue: existing,
        newValue: updated,
      }, tx);

      return updated;
    });
  }

  static async softDelete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.inventoryItem.findUnique({ where: { id } });
      if (!existing || existing.isDeleted) throw { status: 404, message: 'Item not found' };

      await tx.inventoryItem.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
        }
      });

      await createAuditLog({
        userId,
        module: 'Inventaris',
        action: 'Delete',
        targetTable: 'inventories',
        targetId: id,
        oldValue: { isDeleted: false },
        newValue: { isDeleted: true },
      }, tx);
    });
  }
}
