/**
 * Example AI Endpoint
 * 
 * Demonstrates how to use the NVIDIA AI client service.
 * This is a reference implementation - you can modify or remove it.
 */

import { createNvidiaAIClient } from "../lib/nvidia-ai-client.js";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed. Use POST."
    });
  }

  try {
    const { message, context } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'message' parameter"
      });
    }

    // Create AI client
    const client = createNvidiaAIClient();

    // Build messages array
    const messages = [];
    
    if (context) {
      messages.push({
        role: "system",
        content: context
      });
    }

    messages.push({
      role: "user",
      content: message
    });

    // Call NVIDIA API
    const response = await client.chat(messages, {
      temperature: 0.7,
      top_p: 0.8,
      max_tokens: 2048
    });

    // Return response
    return res.status(200).json({
      success: true,
      message: response.choices[0]?.message?.content || "No response",
      model: client.getModel(),
      usage: response.usage
    });

  } catch (error) {
    console.error("AI API error:", error);
    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
}
