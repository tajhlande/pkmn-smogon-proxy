import express, { Application, Request, Response } from 'express';
import analysesRouter from './routes/analyses';
import formatsRouter from './routes/formats';
import setsRouter from './routes/sets';
import statsRouter from './routes/stats';
import teamsRouter from './routes/teams';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import logger from './services/logger';
import { cacheService } from './services';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Smogon API Proxy',
    version: '1.0.0',
    endpoints: {
      analyses: '/analyses',
      formats: '/formats',
      sets: '/sets',
      stats: '/stats',
      teams: '/teams'
    },
    documentation: '/api-docs'
  });
});

app.get('/health', (req: Request, res: Response) => {
  const cacheStats = cacheService.getStats();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cache: {
      size: cacheStats.size,
    },
  });
});

app.get('/ready', (req: Request, res: Response) => {
  const cacheStats = cacheService.getStats();
  
  res.status(200).json({
    ready: true,
    timestamp: new Date().toISOString(),
    checks: {
      server: 'ok',
      cache: {
        status: 'ok',
        entries: cacheStats.size,
      },
    },
  });
});

app.get('/api-docs', (req: Request, res: Response) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'Smogon API Proxy',
      description: 'OpenAPI wrapper for pkmn/smogon functionality',
      version: '1.0.0',
    },
    endpoints: {
      formats: {
        method: 'GET',
        path: '/formats',
        description: 'Get list of available battle formats',
        example: 'GET /formats',
      },
      analyses: {
        method: 'GET',
        path: '/analyses',
        description: 'Get Pokémon analyses from Smogon',
        parameters: ['format', 'pokemon'],
        example: 'GET /analyses?format=gen9ou&pokemon=Charizard',
      },
      sets: {
        method: 'GET',
        path: '/sets',
        description: 'Get Pokémon movesets from Smogon',
        parameters: ['format (required)', 'pokemon (required)'],
        example: 'GET /sets?format=gen9ou&pokemon=Charizard',
      },
      stats: {
        method: 'GET',
        path: '/stats',
        description: 'Get usage statistics from Smogon',
        parameters: ['format (required)', 'pokemon (required)', 'month', 'rating'],
        example: 'GET /stats?format=gen9ou&pokemon=Charizard&month=2024-01',
      },
      teams: {
        method: 'GET',
        path: '/teams',
        description: 'Get sample teams from Smogon',
        parameters: ['format (required)'],
        example: 'GET /teams?format=gen9ou',
      },
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
  });
});

app.use('/analyses', analysesRouter);
app.use('/formats', formatsRouter);
app.use('/sets', setsRouter);
app.use('/stats', statsRouter);
app.use('/teams', teamsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;

