import { Request, Response, NextFunction } from 'express';
import { FinanceService } from '../services/finance.service';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendResponse } from '../utils/response';

const createFinanceSchema = z.object({
  title: z.string().min(1),
  categoryId: z.string().uuid(),
  type: z.enum(['Income', 'Expense']),
  amount: z.number().positive(),
  transactionDate: z.string().datetime(),
  proofUrl: z.string().url().optional(),
});

export class FinanceController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { finances, total } = await FinanceService.getAll(page, limit);
      
      sendResponse(res, 200, 'Finance records fetched successfully', finances, {
        page, limit, total, totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createFinanceSchema.safeParse(req.body);
      if (!parsed.success) {
        sendResponse(res, 400, 'Validation failed', parsed.error.format());
        return;
      }

      const finance = await FinanceService.create(parsed.data, req.user!.id);
      sendResponse(res, 201, 'Finance record created successfully', finance);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createFinanceSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        sendResponse(res, 400, 'Validation failed', parsed.error.format());
        return;
      }

      const finance = await FinanceService.update(req.params.id as string, parsed.data, req.user!.id);
      sendResponse(res, 200, 'Finance record updated successfully', finance);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await FinanceService.softDelete(req.params.id as string, req.user!.id);
      sendResponse(res, 200, 'Finance record deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
