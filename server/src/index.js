import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import basicRoutes from './routes/basic.js';
import bearerRoutes from './routes/bearer.js';
import jwtRoutes from './routes/jwtRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.use('/api/basic', basicRoutes);
app.use('/api/bearer', bearerRoutes);
app.use('/api/jwt', jwtRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Auth demo server listening on http://localhost:${PORT}`);
});
