import { Router } from 'express';
import { ComplaintController } from '../controllers/complaint.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

const router = Router();

router.use(verifyToken);

// Assuming complaints can be viewed by anyone who manages "Aspirasi & Pengaduan" or perhaps just everyone?
// Based on typical RBAC, let's use the standard approach. 
router.get('/', authorize('Aspirasi/Pengaduan', 'View'), ComplaintController.getAll);
router.post('/', authorize('Aspirasi/Pengaduan', 'Create'), ComplaintController.create);
router.put('/:id/status', authorize('Aspirasi/Pengaduan', 'Manage'), ComplaintController.updateStatus);
router.delete('/:id', authorize('Aspirasi/Pengaduan', 'Manage'), ComplaintController.delete);

export default router;
