import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

const router = Router();

router.use(verifyToken);

// Admin / HR viewing all attendances
router.get('/', authorize('Data Anggota', 'View'), AttendanceController.getAll);

// Any authenticated user can clock in/out
router.post('/clock-in', AttendanceController.clockIn);
router.post('/clock-out', AttendanceController.clockOut);

export default router;
