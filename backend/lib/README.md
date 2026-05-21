# NVIDIA AI Client Service

Secure, backend-only client for NVIDIA API with Qwen3-Coder-480B model.

## Setup

1. **Set Environment Variable in Vercel:**
   - Go to your Vercel project Settings > Environment Variables
   - Add `NVIDIA_API_KEY` with your NVIDIA API key
   - Ensure it's available in the Production, Preview, and Development environments

2. **Never hardcode or expose the API key to the frontend**

## Usage

### Basic Chat Completion

```javascript
import { createNvidiaAIClient } from './lib/nvidia-ai-client.js';

export default async function handler(req, res) {
  try {
    const client = createNvidiaAIClient();
    
    const response = await client.chat([
      {
        role: "user",
        content: "What is the capital of France?"
      }
    ]);
    
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
```

### With Custom Options

```javascript
const response = await client.chat(
  [
    {
      role: "user",
      content: "Write a Python function to sort a list"
    }
  ],
  {
    temperature: 0.5,      // Lower = more deterministic
    top_p: 0.7,            // Diversity control
    max_tokens: 2048       // Response length limit
  }
);
```

### Streaming Response

```javascript
const streamResponse = await client.chatStream([
  {
    role: "user",
    content: "Explain quantum computing"
  }
]);

// Handle streaming in your API endpoint
for await (const chunk of streamResponse.body) {
  // Process streaming chunks
}
```

## API Reference

### createNvidiaAIClient()
Creates and returns a client instance.

**Returns:**
- `Object` with the following methods:
  - `chat(messages, options)` - Send chat completion request
  - `chatStream(messages, options)` - Send streaming chat completion request
  - `getModel()` - Returns model name (qwen/qwen3-coder-480b-a35b-instruct)
  - `getBaseUrl()` - Returns API base URL

**Throws:**
- `Error` if `NVIDIA_API_KEY` environment variable is not set

### chat(messages, options)
Send a chat completion request.

**Parameters:**
- `messages` (Array): Array of message objects with `role` and `content` fields
  - `role` (string): "user", "assistant", or "system"
  - `content` (string): Message content
- `options` (Object, optional):
  - `temperature` (number): 0-2, controls randomness (default: 0.7)
  - `top_p` (number): 0-1, nucleus sampling (default: 0.8)
  - `max_tokens` (number): Maximum response length (default: 4096)

**Returns:**
- `Promise<Object>` - NVIDIA API response

### chatStream(messages, options)
Send a streaming chat completion request.

**Parameters:**
- Same as `chat()`

**Returns:**
- `Promise<Response>` - Streaming response object

## Security Considerations

✅ **What This Service Does:**
- Stores API key only in Vercel environment variables
- Never exposes API key to frontend or logs
- Validates environment variable on client creation
- Handles API errors securely
- Provides server-side only access

⚠️ **Best Practices:**
- Always use this service from backend API routes only
- Never pass the API key to the frontend
- Never log sensitive information
- Rate limit API calls to prevent abuse
- Validate user input before sending to API
- Handle errors gracefully

## Model & Configuration

- **Model**: `qwen/qwen3-coder-480b-a35b-instruct`
- **Base URL**: `https://integrate.api.nvidia.com/v1`
- **Default Temperature**: 0.7
- **Default Top-P**: 0.8
- **Default Max Tokens**: 4096

For more info: https://docs.nvidia.com/ai-enterprise/cloud-services/
