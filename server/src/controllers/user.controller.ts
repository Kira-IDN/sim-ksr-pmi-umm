import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';

const createUserSchema = z.object({
  loginId: z.string().min(1),
  nia: z.string().min(1),
  name: z.string().min(1),
  password: z.string().min(6),
  roleId: z.string().uuid(),
  division: z.string().optional(),
  position: z.string().optional(),
  status: z.string().optional(),
});

const updateUserSchema = z.object({
  loginId: z.string().optional(),
  nia: z.string().optional(),
  name: z.string().optional(),
  password: z.string().min(6).optional(),
  roleId: z.string().uuid().optional(),
  division: z.string().optional(),
  position: z.string().optional(),
  status: z.string().optional(),
});

export class UserController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = createUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Validation failed', details: parsed.error.format() });
        return;
      }

      const user = await UserService.createUser(parsed.data, req.user!.id);
      res.status(201).json({ success: true, message: 'User created successfully', data: { id: user.id } });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Validation failed', details: parsed.error.format() });
        return;
      }

      await UserService.updateUser(req.params.id as string, parsed.data, req.user!.id);
      res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await UserService.softDeleteUser(req.params.id as string, req.user!.id);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
