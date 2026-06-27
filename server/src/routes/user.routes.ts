import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

const router = Router();

// Every route must pass authentication
router.use(verifyToken);

// Connect RBAC based on the exact module & action names defined in Architecture Lock & RBAC
router.get('/', authorize('Data Anggota', 'View'), UserController.getAll);
router.post('/', authorize('Data Anggota', 'Create'), UserController.create);
router.put('/:id', authorize('Data Anggota', 'Edit'), UserController.update);
router.delete('/:id', authorize('Data Anggota', 'Delete'), UserController.delete);

export default router;
