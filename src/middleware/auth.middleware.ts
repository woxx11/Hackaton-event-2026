import { Request, Response, NextFunction } from 'express';

// For future JWT implementation
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  // if (!token) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  
  // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //   if (err) return res.status(401).json({ message: 'Invalid token' });
  //   req.user = decoded;
  //   next();
  // });
  
  // For now, allow all
  next();
};
