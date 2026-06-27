import { Request, Response, NextFunction } from 'express';
import { AttendanceService } from '../services/attendance.service';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendResponse } from '../utils/response';

const clockInSchema = z.object({
  activityId: z.string().uuid(),
  attendanceType: z.enum(['Field', 'Office', 'Event']),
});

export class AttendanceController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { attendances, total } = await AttendanceService.getAll(page, limit);
      
      sendResponse(res, 200, 'Attendances fetched successfully', attendances, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      next(error);
    }
  }

  static async clockIn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = clockInSchema.safeParse(req.body);
      if (!parsed.success) {
        sendResponse(res, 400, 'Validation failed', parsed.error.format());
        return;
      }

      const attendance = await AttendanceService.clockIn(req.user!.id, parsed.data.activityId, parsed.data.attendanceType);
      sendResponse(res, 201, 'Clock-in successful', attendance);
    } catch (error) {
      next(error);
    }
  }

  static async clockOut(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const attendance = await AttendanceService.clockOut(req.user!.id);
      sendResponse(res, 200, 'Clock-out successful', attendance);
    } catch (error) {
      next(error);
    }
  }
}
