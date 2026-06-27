import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendResponse } from '../utils/response';

const createInventorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
  stock: z.number().nonnegative(),
  condition: z.enum(['Baik', 'Rusak Ringan', 'Rusak Berat']),
});

export class InventoryController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const { items, total } = await InventoryService.getAll(page, limit);
      
      sendResponse(res, 200, 'Inventory fetched successfully', items, {
        page, limit, total, totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createInventorySchema.safeParse(req.body);
      if (!parsed.success) {
        sendResponse(res, 400, 'Validation failed', parsed.error.format());
        return;
      }

      const item = await InventoryService.create(parsed.data, req.user!.id);
      sendResponse(res, 201, 'Inventory item created successfully', item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createInventorySchema.partial().safeParse(req.body);
      if (!parsed.success) {
        sendResponse(res, 400, 'Validation failed', parsed.error.format());
        return;
      }

      const item = await InventoryService.update(req.params.id as string, parsed.data, req.user!.id);
      sendResponse(res, 200, 'Inventory item updated successfully', item);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await InventoryService.softDelete(req.params.id as string, req.user!.id);
      sendResponse(res, 200, 'Inventory item deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
