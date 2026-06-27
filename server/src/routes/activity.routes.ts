import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Manajemen Kegiatan', 'View'), ActivityController.getAll);
router.post('/', authorize('Manajemen Kegiatan', 'Create'), ActivityController.create);
router.put('/:id', authorize('Manajemen Kegiatan', 'Edit'), ActivityController.update);
router.delete('/:id', authorize('Manajemen Kegiatan', 'Delete'), ActivityController.delete);
router.post('/:id/approve', authorize('Approval', 'Approve'), ActivityController.approve);

export default router;
