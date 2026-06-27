import { prisma } from '../config/prisma';

interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: string;
}

/**
 * Dispatches an internal notification.
 * Optionally accepts a transaction object (`tx`) to be part of an atomic operation.
 */
export async function dispatchNotification(payload: NotificationPayload, tx: any = prisma) {
  try {
    await tx.notification.create({
      data: {
        userId: payload.userId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
      },
    });
  } catch (error) {
    console.error('Failed to dispatch Notification:', error);
    // Notification failure might not necessarily block a transaction, 
    // but in strict enterprise mode we can throw.
    throw new Error('Notification Dispatch failed');
  }
}
