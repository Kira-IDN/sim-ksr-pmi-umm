import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

const router = Router();

router.use(verifyToken);

// For seeing roles, they must have manage access to structure or just viewing. 
// Assuming viewing roles is related to "Struktur Organisasi" or "Data Anggota"
router.get('/', authorize('Struktur Organisasi', 'View'), RoleController.getRoles);
router.get('/permissions', authorize('Struktur Organisasi', 'View'), RoleController.getPermissions);

export default router;
