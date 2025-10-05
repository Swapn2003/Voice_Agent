import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { detectIntent } from './intents.js';
import { generatePlan } from './plans.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory Context DB for demo
const contexts = new Map();
contexts.set('demoApp', {
  appId: 'demoApp',
  caseApiBase: '/api',
  uiHints: {
    tables: [{ selector: '[data-cases-table="true"]', name: 'cases' }]
  }
});

app.get('/voice-agent/context/:appId', (req, res) => {
  const ctx = contexts.get(req.params.appId);
  if (!ctx) {
    console.warn('[VA][context] miss for appId:', req.params.appId);
    return res.status(404).json({ error: 'Unknown appId' });
  }
  console.log('[VA][context] hit for appId:', req.params.appId);
  res.json(ctx);
});

app.post('/voice-agent/onboard', (req, res) => {
  const { appId, backendRepo, frontendRepo } = req.body || {};
  if (!appId) return res.status(400).json({ error: 'appId required' });
  // In a full impl, clone repos, scan for endpoints/components, extract context
  contexts.set(appId, { appId, caseApiBase: '/api', repos: { backendRepo, frontendRepo } });
  res.json({ ok: true, appId });
});

app.post('/voice-agent/telemetry', (req, res) => {
  // Store learning signals (demo: log only)
  try {
    console.log('[VA][telemetry]', JSON.stringify(req.body));
  } catch {
    console.log('[VA][telemetry] received');
  }
  res.json({ ok: true });
});

// Simple server-side NLP + planning to return a multi-step plan
app.post('/voice-agent/plan', (req, res) => {
  const { text, appId } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text required' });
  const ctx = (appId && contexts.get(appId)) || {};
  try {
    const intent = parseIntent(text);
    const entities = extractEntities(text);
    const plan = planAction({ intent, entities, context: ctx });
    return res.json({ plan, intent, entities });
  } catch (e) {
    return res.status(500).json({ error: 'planning failed', message: String(e?.message || e) });
  }
});

// GET variant for clients preferring query params
app.get('/voice-agent/plan', (req, res) => {
  const text = req.query.text;
  const appId = req.query.appId;
  if (!text) return res.status(400).json({ error: 'text required' });
  const ctx = (appId && contexts.get(appId)) || {};
  try {
    console.log('[VA][plan] GET', text, appId);
    const intent = parseIntent(text);
    const entities = extractEntities(text);
    const plan = planAction({ intent, entities, context: ctx });
    return res.json({ plan, intent, entities });
  } catch (e) {
    return res.status(500).json({ error: 'planning failed', message: String(e?.message || e) });
  }
});

// Legacy function - now uses structured intent detection
function parseIntent(text) {
  return detectIntent(text, 'regex');
}

function extractEntities(text) {
  const entities = {};
  const caseMatch = text.match(/case\s*([\w-]+)/i);
  if (caseMatch) entities.caseId = caseMatch[1];
  const statusMatch = text.match(/status\s*(pending|open|closed|approved|rejected|new|hold)/i);
  if (statusMatch) entities.status = statusMatch[1].toLowerCase();
  if (/excel|evidence|file|csv/i.test(text)) entities.fileType = 'file';
  const mine = /(my|assigned to me)/i.test(text);
  if (mine) entities.assignedTo = 'me';
  return entities;
}

// Legacy function - now uses structured plan generation
function planAction({ intent, entities, context }) {
  return generatePlan(intent, entities, context);
}

const port = process.env.PORT || 8081;

// 404 handler for unknown Voice Agent routes (after all known routes)
app.use('/voice-agent', (req, res) => {
  console.warn('[VA][404]', req.method, req.originalUrl);
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error('[VA][ERROR]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

process.on('unhandledRejection', (reason) => {
  console.error('[VA][UNHANDLED_REJECTION]', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[VA][UNCAUGHT_EXCEPTION]', err);
});

app.listen(port, () => console.log(`Voice Agent server on :${port}`));


