import express from 'express';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'url';
import apiRouter from './api/index.js';
import { HTTPError } from './lib/errors.js';

const currentDirName = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.static(path.join(currentDirName, '..', 'public')));

app.use('/api', apiRouter);

app.get('/', (_, res) => {
  res.sendFile(path.join(currentDirName, '..', 'public', 'index.html'));
});

app.use((err, _, res) => {
  if (err instanceof HTTPError) {
    // eslint-disable-next-line no-console
    if (err.statusCode === 500) console.log(err);
    return res.status(err.statusCode).json({ message: err.message });
  }

  // eslint-disable-next-line no-console
  console.log(err);
  return res.status(500).json({ message: 'Unexpected Error' });
});

export default app;
