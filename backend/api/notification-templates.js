import { requireAdmin, setAdminCors } from '../lib/admin-auth.js';
import {
  ensureDefaultTemplates,
  fetchTemplates,
  isValidTemplateId,
  slugifyTemplateId
} from '../lib/notification-helpers.js';

function normalizeTemplate(body, existing = null) {
  const now = Date.now();
  return {
    displayName: String(body.displayName || existing?.displayName || 'Untitled').slice(0, 80),
    icon: String(body.icon || existing?.icon || '').slice(0, 8),
    title: String(body.title || existing?.title || '').slice(0, 120),
    message: String(body.message || existing?.message || '').slice(0, 2000),
    buttonText: String(body.buttonText || existing?.buttonText || 'Play Now').slice(0, 40),
    enabled: body.enabled !== undefined ? !!body.enabled : (existing?.enabled !== false),
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };
}

export default async function handler(req, res) {
  setAdminCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: 'Missing FIREBASE_DATABASE_URL' });
  }

  try {
    if (req.method === 'GET') {
      const templates = await ensureDefaultTemplates(firebaseDbUrl);
      return res.status(200).json({ ok: true, templates });
    }

    const adminId = requireAdmin(req, res);
    if (!adminId) return;

    if (req.method === 'POST' && req.body?.action === 'init_defaults') {
      const templates = await ensureDefaultTemplates(firebaseDbUrl);
      return res.status(200).json({ ok: true, message: 'Default templates initialized', templates });
    }

    if (req.method === 'POST') {
      const { templateId, displayName, title, message, icon, buttonText, enabled, duplicateFrom } = req.body || {};
      let source = null;
      if (duplicateFrom) {
        if (!isValidTemplateId(duplicateFrom)) {
          return res.status(400).json({ error: 'Invalid duplicateFrom template id' });
        }
        const all = await fetchTemplates(firebaseDbUrl);
        source = all?.[duplicateFrom];
        if (!source) {
          return res.status(404).json({ error: 'Source template not found' });
        }
      }

      let id = templateId ? slugifyTemplateId(templateId) : slugifyTemplateId(displayName || 'template');
      if (!isValidTemplateId(id)) {
        return res.status(400).json({ error: 'Invalid template id' });
      }

      const all = await fetchTemplates(firebaseDbUrl) || {};
      if (all[id] && !duplicateFrom) {
        id = `${id}_${Date.now().toString(36).slice(-4)}`;
      }

      const template = normalizeTemplate(
        {
          displayName: displayName || (source ? `${source.displayName} (Copy)` : 'New Template'),
          title: title || source?.title,
          message: message || source?.message,
          icon: icon ?? source?.icon,
          buttonText: buttonText || source?.buttonText,
          enabled: enabled ?? source?.enabled
        },
        source
      );

      await fetch(`${firebaseDbUrl}/notifications/templates/${id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });

      return res.status(200).json({ ok: true, templateId: id, template });
    }

    if (req.method === 'PUT') {
      const templateId = req.body?.templateId || req.body?.templateName;
      const { template } = req.body || {};
      if (!templateId || !isValidTemplateId(templateId)) {
        return res.status(400).json({ error: 'Invalid templateId' });
      }
      if (!template || typeof template !== 'object') {
        return res.status(400).json({ error: 'Missing template data' });
      }

      const all = await fetchTemplates(firebaseDbUrl) || {};
      const existing = all[templateId] || null;
      const normalized = normalizeTemplate(template, existing);

      await fetch(`${firebaseDbUrl}/notifications/templates/${templateId}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized)
      });

      return res.status(200).json({ ok: true, templateId, template: normalized });
    }

    if (req.method === 'DELETE') {
      const templateId = req.query?.templateId || req.query?.templateName
        || req.body?.templateId || req.body?.templateName;
      if (!templateId || !isValidTemplateId(templateId)) {
        return res.status(400).json({ error: 'Invalid templateId' });
      }

      const response = await fetch(
        `${firebaseDbUrl}/notifications/templates/${templateId}.json`,
        { method: 'DELETE' }
      );
      if (!response.ok && response.status !== 404) {
        return res.status(500).json({ error: 'Failed to delete template' });
      }

      return res.status(200).json({ ok: true, templateId });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('[Templates] Error:', e?.message || e);
    return res.status(500).json({ error: 'Internal server error', details: e?.message });
  }
}
