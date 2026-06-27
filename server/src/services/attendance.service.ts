import { prisma } from '../config/prisma';
import { createAuditLog } from '../utils/auditLogger';

export class AttendanceService {
  static async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [attendances, total] = await Promise.all([
      prisma.attendance.findMany({
        skip,
        take: limit,
        orderBy: { checkIn: 'desc' },
        include: { user: { select: { name: true, nia: true } } }
      }),
      prisma.attendance.count()
    ]);
    return { attendances, total };
  }

  static async clockIn(userId: string, activityId: string, attendanceType: string) {
    return prisma.$transaction(async (tx) => {
      // Check if already clocked in today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existing = await tx.attendance.findFirst({
        where: {
          userId,
          activityId,
          checkIn: { gte: today },
        }
      });

      if (existing) {
        throw { status: 400, message: 'Already clocked in today' };
      }

      const attendance = await tx.attendance.create({
        data: {
          userId,
          activityId,
          attendanceType,
          checkIn: new Date(),
          status: 'Present'
        }
      });

      await createAuditLog({
        userId,
        module: 'Kehadiran', // Using standard if module applies, or general
        action: 'Clock In',
        targetTable: 'attendances',
        targetId: attendance.id,
        newValue: attendance,
      }, tx);

      return attendance;
    });
  }

  static async clockOut(userId: string) {
    return prisma.$transaction(async (tx) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existing = await tx.attendance.findFirst({
        where: {
          userId,
          checkIn: { gte: today },
          checkOut: null
        }
      });

      if (!existing) {
        throw { status: 404, message: 'No active clock-in found for today' };
      }

      const updated = await tx.attendance.update({
        where: { id: existing.id },
        data: { checkOut: new Date() }
      });

      await createAuditLog({
        userId,
        module: 'Kehadiran',
        action: 'Clock Out',
        targetTable: 'attendances',
        targetId: existing.id,
        oldValue: { checkOut: null },
        newValue: { checkOut: updated.checkOut },
      }, tx);

      return updated;
    });
  }
}
