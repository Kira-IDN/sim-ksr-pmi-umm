import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import roleRoutes from './role.routes';
import activityRoutes from './activity.routes';
import attendanceRoutes from './attendance.routes';
import complaintRoutes from './complaint.routes';
import financeRoutes from './finance.routes';
import inventoryRoutes from './inventory.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/activities', activityRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/complaints', complaintRoutes);
router.use('/finances', financeRoutes);
router.use('/inventories', inventoryRoutes);

export default router;
