require('dotenv').config();
const express = require('express');
const cors = require('cors');

const basicRoutes = require('./routes/basic');
const bearerRoutes = require('./routes/bearer');
const jwtRoutes = require('./routes/jwt');

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:4200';

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/basic', basicRoutes);
app.use('/api/bearer', bearerRoutes);
app.use('/api/jwt', jwtRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Auth demo API listening on http://localhost:${PORT}`);
});
