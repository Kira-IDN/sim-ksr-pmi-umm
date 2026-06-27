import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';

const loginSchema = z.object({
  nia: z.string().min(1, 'NIA is required'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, message: 'Validation failed', details: parsed.error.format() });
        return;
      }

      const { nia, password } = parsed.data;
      const ip = req.ip;
      const ua = req.get('User-Agent');

      const result = await AuthService.login(nia, password, ip, ua);
      res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refresh(refreshToken);
      res.status(200).json({ success: true, message: 'Token refreshed', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ success: false, message: 'Refresh token is required for logout' });
        return;
      }

      await AuthService.logout(refreshToken, req.user!.id);
      res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  }
}
