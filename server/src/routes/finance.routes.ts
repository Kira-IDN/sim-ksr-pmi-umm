import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

const router = Router();

router.use(verifyToken);

router.get('/', authorize('Keuangan', 'View'), FinanceController.getAll);
router.post('/', authorize('Keuangan', 'Manage'), FinanceController.create);
router.put('/:id', authorize('Keuangan', 'Manage'), FinanceController.update);
router.delete('/:id', authorize('Keuangan', 'Manage'), FinanceController.delete);

export default router;
