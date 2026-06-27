import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { prisma } from '../config/prisma';

/**
 * Enterprise RBAC Middleware
 * Dynamically resolves if the user's role has the required permission.
 * No hardcoded role names used.
 */
export const authorize = (moduleName: string, actionName: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      // Check RolePermission dynamically
      const hasPermission = await prisma.rolePermission.findFirst({
        where: {
          roleId: req.user.roleId,
          permission: {
            module: moduleName,
            action: actionName,
          }
        }
      });

      if (!hasPermission) {
        res.status(403).json({ 
          success: false, 
          message: `Forbidden: Missing permission for ${moduleName}:${actionName}` 
        });
        return;
      }

      next();
    } catch (error) {
      console.error('RBAC Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error during authorization' });
    }
  };
};
