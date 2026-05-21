/**
 * NVIDIA AI Client Service
 * 
 * Secure backend-only client for NVIDIA API with Qwen3-Coder-480B model.
 * API key is retrieved from process.env.NVIDIA_API_KEY and never exposed to frontend.
 * 
 * Usage:
 *   import { createNvidiaAIClient } from './lib/nvidia-ai-client.js';
 *   const client = createNvidiaAIClient();
 *   const response = await client.chat(messages);
 */

const NVIDIA_API_BASE_URL = "https://integrate.api.nvidia.com/v1";
const NVIDIA_MODEL = "qwen/qwen3-coder-480b-a35b-instruct";

/**
 * Create a secure NVIDIA AI client
 * @returns {Object} Client object with chat method
 * @throws {Error} If NVIDIA_API_KEY environment variable is not set
 */
export function createNvidiaAIClient() {
  const apiKey = process.env.NVIDIA_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      "NVIDIA_API_KEY environment variable not configured. " +
      "Please set it in your Vercel project environment variables."
    );
  }

  /**
   * Send a chat completion request to NVIDIA API
   * @param {Array} messages - Array of message objects with 'role' and 'content' fields
   * @param {Object} options - Optional configuration (temperature, top_p, max_tokens, stream)
   * @returns {Promise<Object>} API response
   */
  async function chat(messages, options = {}) {
    const {
      temperature = 0.7,
      top_p = 0.8,
      max_tokens = 4096,
      stream = false
    } = options;

    try {
      const response = await fetch(
        `${NVIDIA_API_BASE_URL}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: NVIDIA_MODEL,
            messages: messages,
            temperature: temperature,
            top_p: top_p,
            max_tokens: max_tokens,
            stream: stream
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `NVIDIA API error (${response.status}): ` +
          (error.error?.message || error.message || "Unknown error")
        );
      }

      return await response.json();
    } catch (error) {
      console.error("NVIDIA AI Client error:", error);
      throw error;
    }
  }

  /**
   * Send a streaming chat completion request to NVIDIA API
   * @param {Array} messages - Array of message objects with 'role' and 'content' fields
   * @param {Object} options - Optional configuration (temperature, top_p, max_tokens)
   * @returns {Promise<ReadableStream>} Streaming response
   */
  async function chatStream(messages, options = {}) {
    const {
      temperature = 0.7,
      top_p = 0.8,
      max_tokens = 4096
    } = options;

    try {
      const response = await fetch(
        `${NVIDIA_API_BASE_URL}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: NVIDIA_MODEL,
            messages: messages,
            temperature: temperature,
            top_p: top_p,
            max_tokens: max_tokens,
            stream: true
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `NVIDIA API error (${response.status}): ` +
          (error.error?.message || error.message || "Unknown error")
        );
      }

      return response;
    } catch (error) {
      console.error("NVIDIA AI Client streaming error:", error);
      throw error;
    }
  }

  return {
    chat,
    chatStream,
    getModel: () => NVIDIA_MODEL,
    getBaseUrl: () => NVIDIA_API_BASE_URL
  };
}

export default createNvidiaAIClient;
