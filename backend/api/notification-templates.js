/**
 * Manages notification templates in Firebase
 * Initialize default templates or update existing ones
 */

function isAdminUser(telegramId) {
  // Check if the Telegram ID matches the admin ID
  const adminTelegramId = '1529689011';
  return String(telegramId) === adminTelegramId;
}

function isValidTemplateName(name) {
  // Only allow alphanumeric and underscore
  return /^[a-zA-Z0-9_]+$/.test(name) && name.length <= 50;
}

const DEFAULT_TEMPLATES = {
  dailyChallenge: {
    templateName: "Daily Challenge",
    enabled: true,
    title: "🎮 Daily Challenge",
    message: "🎮 Daily Challenge is ready! Play now and earn rewards.",
    icon: "🎮"
  },
  tournamentReminder: {
    templateName: "Tournament Reminder",
    enabled: true,
    title: "🏆 Tournament Reminder",
    message: "🏆 Tournament is live. Join now and climb the leaderboard.",
    icon: "🏆"
  },
  comeBack: {
    templateName: "Come Back",
    enabled: true,
    title: "🔥 Come Back",
    message: "🔥 Your rivals are playing right now. Come back and defend your rank.",
    icon: "🔥"
  }
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-telegram-id");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const firebaseDbUrl = process.env.FIREBASE_DATABASE_URL;
  if (!firebaseDbUrl) {
    return res.status(500).json({ error: "Missing FIREBASE_DATABASE_URL" });
  }

  try {
    if (req.method === "GET") {
      // Get all templates
      const response = await fetch(
        `${firebaseDbUrl}/notifications/templates.json`,
        { method: "GET" }
      );

      if (response.status === 404) {
        // Templates don't exist, create defaults
        console.log('[Templates] Creating default templates');
        for (const [name, template] of Object.entries(DEFAULT_TEMPLATES)) {
          await fetch(
            `${firebaseDbUrl}/notifications/templates/${name}.json`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(template)
            }
          );
        }
        return res.status(200).json({
          ok: true,
          message: "Default templates created",
          templates: DEFAULT_TEMPLATES
        });
      }

      if (!response.ok) {
        return res.status(500).json({ error: "Failed to fetch templates" });
      }

      const templates = await response.json() || {};
      return res.status(200).json({
        ok: true,
        templates
      });
    } else if (req.method === "POST") {
      // Require admin privileges to create templates
      const adminTelegramId = req.headers['x-telegram-id'];
      if (!adminTelegramId || !isAdminUser(adminTelegramId)) {
        return res.status(403).json({ error: "Admin access required to create templates" });
      }

      // Create a new template
      const { templateName, title, message, icon } = req.body;

      if (!templateName || !title || !message) {
        return res.status(400).json({ error: "Missing required fields: templateName, title, message" });
      }

      // Validate template name to prevent path traversal
      if (!isValidTemplateName(templateName)) {
        return res.status(400).json({ error: "Invalid template name. Only alphanumeric and underscore allowed." });
      }

      // Create unique ID from template name
      const templateId = templateName.toLowerCase().replace(/\s+/g, '_');

      const newTemplate = {
        templateName,
        enabled: true,
        title,
        message,
        icon: icon || ""
      };

      const response = await fetch(
        `${firebaseDbUrl}/notifications/templates/${templateId}.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTemplate)
        }
      );

      if (!response.ok) {
        return res.status(500).json({ error: "Failed to create template" });
      }

      console.log('[Templates] Created new template:', templateId);

      return res.status(200).json({
        ok: true,
        message: "Template created",
        templateId,
        template: newTemplate
      });
    } else if (req.method === "PUT") {
      // Require admin privileges to update templates
      const adminTelegramId = req.headers['x-telegram-id'];
      if (!adminTelegramId || !isAdminUser(adminTelegramId)) {
        return res.status(403).json({ error: "Admin access required to update templates" });
      }

      // Update a template
      const { templateName, template } = req.body;

      if (!templateName || !template) {
        return res.status(400).json({ error: "Missing templateName or template data" });
      }

      // Validate template name to prevent path traversal
      if (!isValidTemplateName(templateName)) {
        return res.status(400).json({ error: "Invalid template name. Only alphanumeric and underscore allowed." });
      }

      const response = await fetch(
        `${firebaseDbUrl}/notifications/templates/${templateName}.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(template)
        }
      );

      if (!response.ok) {
        return res.status(500).json({ error: "Failed to update template" });
      }

      console.log('[Templates] Updated template:', templateName);

      return res.status(200).json({
        ok: true,
        message: "Template updated",
        templateName,
        template
      });
    } else if (req.method === "DELETE") {
      // Require admin privileges to delete templates
      const adminTelegramId = req.headers['x-telegram-id'];
      if (!adminTelegramId || !isAdminUser(adminTelegramId)) {
        return res.status(403).json({ error: "Admin access required to delete templates" });
      }

      // Delete a template
      const { templateName } = req.body;

      if (!templateName) {
        return res.status(400).json({ error: "Missing templateName" });
      }

      // Validate template name to prevent path traversal
      if (!isValidTemplateName(templateName)) {
        return res.status(400).json({ error: "Invalid template name. Only alphanumeric and underscore allowed." });
      }

      const response = await fetch(
        `${firebaseDbUrl}/notifications/templates/${templateName}.json`,
        { method: "DELETE" }
      );

      if (!response.ok && response.status !== 404) {
        return res.status(500).json({ error: "Failed to delete template" });
      }

      console.log('[Templates] Deleted template:', templateName);

      return res.status(200).json({
        ok: true,
        message: "Template deleted",
        templateName
      });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (e) {
    console.error('[Templates] Error:', e?.message || e);
    return res.status(500).json({ error: "Internal server error", details: e?.message });
  }
}
