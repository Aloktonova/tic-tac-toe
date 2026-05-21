# NVIDIA AI Integration - Setup & Security Guide

This document explains how the NVIDIA AI integration is set up in this project and best practices for using it securely.

## Overview

- **Service**: `backend/lib/nvidia-ai-client.js` - Reusable NVIDIA AI client
- **Example API**: `backend/api/ai-generate.js` - Example endpoint using the client
- **Model**: Qwen3-Coder-480B via NVIDIA API
- **Security**: API key stored securely in Vercel environment variables only

## Setup Instructions

### Step 1: Add NVIDIA API Key to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add a new environment variable:
   - **Name**: `NVIDIA_API_KEY`
   - **Value**: Your NVIDIA API key
   - **Environments**: Select Production, Preview, and Development (as needed)
4. Redeploy your project to apply the environment variable

### Step 2: Verify Backend Files

The following files have been added/modified:

**New Files:**
- `backend/lib/nvidia-ai-client.js` - Main AI client service
- `backend/lib/README.md` - Detailed API documentation
- `backend/api/ai-generate.js` - Example endpoint
- `NVIDIA_AI_SETUP.md` - This file

**Modified Files:**
- `backend/vercel.json` - Added NVIDIA_API_KEY env var and /api/ai-generate route

## Usage Example

### In a Backend API Endpoint

```javascript
import { createNvidiaAIClient } from "../lib/nvidia-ai-client.js";

export default async function handler(req, res) {
  try {
    const client = createNvidiaAIClient();
    
    const response = await client.chat([
      {
        role: "user",
        content: "Your prompt here"
      }
    ]);
    
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

## Security Best Practices

### ✅ DO

- ✅ Store API key only in Vercel environment variables
- ✅ Access API key only in backend code (Node.js)
- ✅ Use the `createNvidiaAIClient()` factory function
- ✅ Validate user input before sending to API
- ✅ Handle API errors gracefully
- ✅ Rate limit API calls to prevent abuse
- ✅ Log only non-sensitive information
- ✅ Use HTTPS for all API calls (automatic with Vercel)

### ❌ DON'T

- ❌ Never hardcode the API key in source code
- ❌ Never expose the API key to frontend code
- ❌ Never send the API key in query parameters or headers from frontend
- ❌ Never log the API key or sensitive responses
- ❌ Never commit `.env.local` or other local env files
- ❌ Never expose the API key in error messages sent to clients
- ❌ Don't make unlimited API calls without rate limiting

## API Reference

### createNvidiaAIClient()

Creates a secure NVIDIA AI client instance.

**Returns:**
```javascript
{
  chat(messages, options)         // Send completion request
  chatStream(messages, options)    // Send streaming request
  getModel()                       // Get model name
  getBaseUrl()                     // Get API base URL
}
```

**Throws:**
- `Error` if `NVIDIA_API_KEY` environment variable is not set

### chat(messages, options)

Send a chat completion request.

**Parameters:**
```javascript
{
  messages: [                      // Required
    {
      role: "user",               // "user", "assistant", "system"
      content: "Your prompt"      // String content
    }
  ],
  options: {                       // Optional
    temperature: 0.7,              // 0-2, default 0.7
    top_p: 0.8,                    // 0-1, default 0.8
    max_tokens: 4096,              // default 4096
    stream: false                  // boolean
  }
}
```

**Returns:**
```javascript
Promise<{
  choices: [{
    message: { role: string, content: string }
  }],
  usage: {
    prompt_tokens: number,
    completion_tokens: number,
    total_tokens: number
  }
}>
```

### chatStream(messages, options)

Send a streaming chat completion request.

**Parameters:** Same as `chat()`

**Returns:** `Promise<Response>` - Streaming response that can be iterated

## Troubleshooting

### Error: "NVIDIA_API_KEY environment variable not configured"

**Cause:** The environment variable is not set in Vercel

**Solution:**
1. Go to Vercel project settings
2. Add `NVIDIA_API_KEY` to environment variables
3. Redeploy your project

### Error: "NVIDIA API error (401)"

**Cause:** Invalid or expired API key

**Solution:**
1. Verify the API key in Vercel environment variables
2. Check if the key has expired or been revoked
3. Generate a new API key and update Vercel

### Error: "NVIDIA API error (429)"

**Cause:** Rate limit exceeded

**Solution:**
1. Implement exponential backoff for retries
2. Add request throttling in your API endpoint
3. Consider caching responses when applicable

### Error: "NVIDIA API error (500)"

**Cause:** Server-side error from NVIDIA API

**Solution:**
1. Wait and retry after a delay
2. Check NVIDIA API status: https://integrate.api.nvidia.com/status
3. Contact NVIDIA support if issue persists

## Performance Considerations

- **Default max_tokens**: 4096 (adjust based on needs)
- **Temperature**: 0.7 is balanced, 0.5 for deterministic, 0.9+ for creative
- **Streaming**: Use for long responses to improve perceived performance
- **Caching**: Consider caching common responses to reduce API calls

## Cost & Usage

Monitor your API usage through:
1. NVIDIA API dashboard
2. Vercel analytics
3. Server logs (check for errors/rate limits)

## Integration with Game Logic

The AI client can be used for:
- Tournament descriptions and commentary
- Leaderboard summaries
- Game suggestions and tips
- AI player hints or strategies
- Content generation for the store

**Important**: Keep AI calls asynchronous and non-blocking to maintain game responsiveness.

## Support & Documentation

- NVIDIA API Docs: https://docs.nvidia.com/ai-enterprise/cloud-services/
- Vercel Env Vars: https://vercel.com/docs/concepts/projects/environment-variables
- OpenAI SDK (compatible): https://github.com/openai/node-sdk

## Maintenance

- Review and update the client service as NVIDIA API evolves
- Monitor for deprecations or API changes
- Keep the environment variable configuration current
- Test the integration regularly in staging before production
