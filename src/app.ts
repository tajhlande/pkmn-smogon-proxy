import express, { Application, Request, Response } from 'express';
import analysesRouter from './routes/analyses';
import formatsRouter from './routes/formats';
import setsRouter from './routes/sets';
import statsRouter from './routes/stats';
import teamsRouter from './routes/teams';

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Smogon API Proxy',
    endpoints: {
      analyses: '/analyses',
      formats: '/formats',
      sets: '/sets',
      stats: '/stats',
      teams: '/teams'
    }
  });
});

app.use('/analyses', analysesRouter);
app.use('/formats', formatsRouter);
app.use('/sets', setsRouter);
app.use('/stats', statsRouter);
app.use('/teams', teamsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
