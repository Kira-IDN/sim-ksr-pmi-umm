import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Inventaris', 'View'), InventoryController.getAll);
router.post('/', authorize('Inventaris', 'Manage'), InventoryController.create);
router.put('/:id', authorize('Inventaris', 'Manage'), InventoryController.update);
router.delete('/:id', authorize('Inventaris', 'Manage'), InventoryController.delete);

export default router;
