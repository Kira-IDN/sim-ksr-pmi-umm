import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role.service';

export class RoleController {
  static async getRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await RoleService.getAllRoles();
      // Format roles to simplify the response
      const formattedRoles = roles.map(role => ({
        id: role.id,
        name: role.name,
        permissions: role.rolePermissions.map(rp => ({
          module: rp.permission.module,
          action: rp.permission.action
        }))
      }));
      res.status(200).json({ success: true, data: formattedRoles });
    } catch (error) {
      next(error);
    }
  }

  static async getPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permissions = await RoleService.getAllPermissions();
      res.status(200).json({ success: true, data: permissions });
    } catch (error) {
      next(error);
    }
  }
}
