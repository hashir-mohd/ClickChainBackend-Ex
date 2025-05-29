import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';

const app = express();
const PORT = 3000;
const LOG_FILE = path.resolve('logs/trace-logs.json');

app.use(cors());
app.use(express.json());

// Ensure log file exists
fs.ensureFileSync(LOG_FILE);
(async () => {
  if (!(await fs.readJson(LOG_FILE, { throws: false }))) {
    await fs.writeJson(LOG_FILE, []);
  }
})();

// POST /log → Save trace event and log to console
app.post('/log', async (req, res) => {
  const entry = {
    ...req.body,
    receivedAt: new Date().toISOString(),
  };

  // Log incoming payload nicely
  console.log('--- New Log Entry Received ---');
  console.log('Type:', entry.type);
  console.log('Timestamp:', entry.timestamp);
  console.log('Received At:', entry.receivedAt);
  // console.log('Data:', JSON.stringify(entry.data, null, 2));
  console.log('------------------------------\n');

  try {
    const logs = await fs.readJson(LOG_FILE);
    logs.push(entry);
    await fs.writeJson(LOG_FILE, logs, { spaces: 2 });
    res.status(200).send({ status: 'ok' });
  } catch (err) {
    console.error('Failed to write log:', err);
    res.status(500).send({ status: 'error' });
  }
});

// GET /logs → Retrieve all trace logs
app.get('/logs', async (req, res) => {
  try {
    const logs = await fs.readJson(LOG_FILE);
    res.json(logs);
  } catch (err) {
    res.status(500).send({ error: 'Failed to read logs' });
  }
});

// Clear logs (optional utility route)
app.delete('/logs', async (req, res) => {
  await fs.writeJson(LOG_FILE, []);
  res.send({ status: 'cleared' });
});

app.listen(PORT, () => {
  console.log(`✅ Trace Logger API running at http://localhost:${PORT}`);
});
