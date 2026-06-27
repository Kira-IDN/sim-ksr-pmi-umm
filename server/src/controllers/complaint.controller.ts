import { Request, Response, NextFunction } from 'express';
import { ComplaintService } from '../services/complaint.service';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendResponse } from '../utils/response';
import { dispatchNotification } from '../utils/notificationDispatcher';

const createComplaintSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const updateComplaintSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'Resolved', 'Rejected']),
});

export class ComplaintController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { complaints, total } = await ComplaintService.getAll(page, limit);
      
      sendResponse(res, 200, 'Complaints fetched successfully', complaints, {
        page, limit, total, totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createComplaintSchema.safeParse(req.body);
      if (!parsed.success) {
        sendResponse(res, 400, 'Validation failed', parsed.error.format());
        return;
      }

      const complaint = await ComplaintService.create(parsed.data, req.user!.id);
      sendResponse(res, 201, 'Complaint submitted successfully', complaint);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateComplaintSchema.safeParse(req.body);
      if (!parsed.success) {
        sendResponse(res, 400, 'Validation failed', parsed.error.format());
        return;
      }

      const complaint = await ComplaintService.updateStatus(req.params.id as string, parsed.data.status, req.user!.id);
      
      await dispatchNotification({
        userId: complaint.userId,
        title: 'Complaint Update',
        message: `Your complaint "${complaint.title}" has been updated to ${parsed.data.status}`,
        type: 'Complaint'
      });

      sendResponse(res, 200, 'Complaint status updated', complaint);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await ComplaintService.softDelete(req.params.id as string, req.user!.id);
      sendResponse(res, 200, 'Complaint deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
