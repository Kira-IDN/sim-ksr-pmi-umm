import { prisma } from '../config/prisma';
import { Request } from 'express';

interface AuditLogPayload {
  userId: string;
  module: string;
  action: string;
  targetTable: string;
  targetId: string;
  oldValue?: Record<string, any> | null;
  newValue?: Record<string, any> | null;
  req?: Request;
}

/**
 * Creates an immutable audit log entry.
 * Should be called inside services when mutating data.
 * Does not throw, errors are logged to avoid breaking the main transaction, 
 * OR it can be part of the Prisma Transaction.
 */
export async function createAuditLog(payload: AuditLogPayload, tx: any = prisma) {
  try {
    const ipAddress = payload.req ? payload.req.ip : null;
    const userAgent = payload.req ? payload.req.get('User-Agent') : null;

    await tx.auditLog.create({
      data: {
        userId: payload.userId,
        module: payload.module,
        action: payload.action,
        targetTable: payload.targetTable,
        targetId: payload.targetId,
        oldValue: payload.oldValue ? JSON.stringify(payload.oldValue) : null,
        newValue: payload.newValue ? JSON.stringify(payload.newValue) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to create Audit Log:', error);
    // Depending on strictness, we might throw here to rollback the transaction.
    // For enterprise compliance, audit logging failure SHOULD rollback the transaction.
    throw new Error('Audit Log failed');
  }
}
