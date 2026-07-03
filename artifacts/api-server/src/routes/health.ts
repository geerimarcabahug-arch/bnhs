import { Router, Request, Response } from 'express';

const router = Router();

// Make sure req and res are explicitly typed!
router.get('/health', (req: Request, res: Response) => {
  // If you are using pino-http, req.log is now available
  req.log.info('Health check triggered'); 
  
  res.status(200).json({ 
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

export default router;
