import { Request, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activity.service';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendResponse } from '../utils/response';
import { dispatchNotification } from '../utils/notificationDispatcher';

const createActivitySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

const approveActivitySchema = z.object({
  status: z.enum(['Approved', 'Rejected']),
  notes: z.string().optional(),
});

export class ActivityController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { activities, total } = await ActivityService.getAll(page, limit);
      
      sendResponse(res, 200, 'Activities fetched successfully', activities, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createActivitySchema.safeParse(req.body);
      if (!parsed.success) {
        sendResponse(res, 400, 'Validation failed', parsed.error.format());
        return;
      }

      const activity = await ActivityService.create(parsed.data, req.user!.id);
      sendResponse(res, 201, 'Activity created successfully', activity);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createActivitySchema.partial().safeParse(req.body);
      if (!parsed.success) {
        sendResponse(res, 400, 'Validation failed', parsed.error.format());
        return;
      }

      const activity = await ActivityService.update(req.params.id as string, parsed.data, req.user!.id);
      sendResponse(res, 200, 'Activity updated successfully', activity);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await ActivityService.softDelete(req.params.id as string, req.user!.id);
      sendResponse(res, 200, 'Activity deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async approve(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = approveActivitySchema.safeParse(req.body);
      if (!parsed.success) {
        sendResponse(res, 400, 'Validation failed', parsed.error.format());
        return;
      }

      const activity = await ActivityService.approve(req.params.id as string, req.user!.id, parsed.data.status, parsed.data.notes);
      
      // Dispatch Notification
      await dispatchNotification({
        userId: activity.createdBy, // Notify the creator
        title: `Activity ${parsed.data.status}`,
        message: `Your activity "${activity.title}" was ${parsed.data.status}.`,
        type: `Activity ${parsed.data.status}`
      });

      sendResponse(res, 200, `Activity ${parsed.data.status.toLowerCase()} successfully`, activity);
    } catch (error) {
      next(error);
    }
  }
}
