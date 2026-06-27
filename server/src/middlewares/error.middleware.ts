import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Unhandled Exception:', err);

  // Prisma Unique Constraint Error (e.g. Duplicate NIA)
  if (err.code === 'P2002') {
    const target = err.meta?.target ? err.meta.target.join(', ') : 'Field';
    res.status(409).json({
      success: false,
      message: `Data sudah digunakan (Duplikat: ${target})`
    });
    return;
  }

  // Do not expose stack traces in production
  const isProd = process.env.NODE_ENV === 'production';
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isProd ? {} : { stack: err.stack })
  });
};
