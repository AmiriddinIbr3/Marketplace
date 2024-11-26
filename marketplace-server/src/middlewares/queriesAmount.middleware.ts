import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

export function createRateLimiterMiddleware(points: number, duration: number) {
    const rateLimiter = new RateLimiterMemory({
      points: points,
      duration: duration,
    });
  
    return (req: Request, res: Response, next: NextFunction) => {
      rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => res.status(429).send('Too Many Requests'));
    };
}