import "dotenv/config";
import mongoose from "mongoose";

const BLOGS_MONGODB_URI = process.env.BLOGS_MONGODB_URI;
const MONGODB_URI = process.env.MONGODB_URI;
const UESR_EMAIL = process.env.UESR_EMAIL;

if (!BLOGS_MONGODB_URI || !MONGODB_URI || !UESR_EMAIL) {
  console.error("Missing BLOGS_MONGODB_URI, MONGODB_URI, or UESR_EMAIL in .env");
  process.exit(1);
}

const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    author: mongoose.Schema.Types.ObjectId,
    status: String,
    publishedAt: Date,
    excerpt: String,
    coverImage: String,
    tags: [String],
    body_html: String,
    readingTime: Number,
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
      canonicalUrl: String,
    },
    hasDraft: Boolean,
  },
  { timestamps: true }
);

const BlogPost =
  mongoose.models.blogpost || mongoose.model("blogpost", BlogPostSchema);

const slug = "integrate-openai-api-production-express-nodejs";

const body_html = `
<p>Last year I helped a startup integrate the OpenAI API into their product. It was a chat feature — users could ask questions about their data and get natural language answers. The integration took about a day. Three days after launch, the founder messaged me: "Hey, something's wrong. Our AWS bill just showed an unexpected charge."</p>

<p>It was $340. For three days. They had 60 users.</p>

<p>The issue wasn't a bug — it was that production API usage looks nothing like a tutorial. The tutorial shows you <code>openai.chat.completions.create()</code> and returns a response. The tutorial doesn't show you what happens when users send 500-token messages, when they open 15 browser tabs each maintaining their own chat context, or when one user fires requests 30 times per minute because they think it's broken.</p>

<p>This guide covers what the tutorials skip: rate limiting, token counting, cost guards, streaming, error handling with retries, and model selection. These aren't optional additions — they're what separates a demo from a production feature.</p>

<h2>Why Production Is Different</h2>

<p>Here's the gap between tutorial code and production code, stated plainly:</p>

<table>
<thead>
<tr>
<th>Concern</th>
<th>Tutorial Code</th>
<th>Production Code</th>
</tr>
</thead>
<tbody>
<tr>
<td>Cost control</td>
<td>Not mentioned</td>
<td>Token counting, spending limits, model selection by task</td>
</tr>
<tr>
<td>Rate limiting</td>
<td>Not mentioned</td>
<td>Per-user and per-IP limits to prevent abuse</td>
</tr>
<tr>
<td>Error handling</td>
<td>try/catch that logs to console</td>
<td>Typed errors, retries with backoff, user-facing messages</td>
</tr>
<tr>
<td>Response delivery</td>
<td>Wait for full completion, return at once</td>
<td>Streaming via SSE — response appears as it generates</td>
</tr>
<tr>
<td>Context management</td>
<td>Each request is independent</td>
<td>Conversation history managed, truncated at token limit</td>
</tr>
<tr>
<td>Secrets management</td>
<td>API key hardcoded or in <code>.env</code> (no rotation)</td>
<td>Rotation strategy, usage monitoring, per-feature keys</td>
</tr>
</tbody>
</table>

<p>Let's build a production-grade Express API that addresses all of this. We'll go layer by layer.</p>

<h2>The Architecture</h2>

<pre>
┌─────────────────────────────────────────────────────────┐
│                  CLIENT (Browser / Mobile)               │
│          POST /api/chat  { messages: [...] }             │
│          GET  /api/chat/stream (SSE)                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   EXPRESS MIDDLEWARE STACK               │
│                                                          │
│  1. express-rate-limit  (10 req/min per IP)             │
│  2. tokenGuard()        (reject if > 4,000 tokens)      │
│  3. auth middleware     (verify user session)            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   ROUTE HANDLER                          │
│                                                          │
│  Select model by task type                               │
│  Build messages array from context                       │
│  Call openai.chat.completions.create()                   │
│  Stream or return response                               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   OPENAI API                             │
│  Model: gpt-4o-mini (default) / gpt-4o (complex tasks)  │
└─────────────────────────────────────────────────────────┘
</pre>

<h2>Project Setup</h2>

<pre><code class="language-bash">mkdir express-openai && cd express-openai
npm init -y
npm install express openai express-rate-limit tiktoken dotenv
npm install --save-dev nodemon
</code></pre>

<pre><code class="language-bash"># .env
OPENAI_API_KEY=sk-proj-your-key-here
PORT=3001
</code></pre>

<h2>Step 1: The OpenAI Client (Configured for Production)</h2>

<p>Don't instantiate the OpenAI client inside route handlers. Create it once, configure it for production, and export it:</p>

<pre><code class="language-javascript">// src/openaiClient.js
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,     // retry on transient failures (rate limits, timeouts)
  timeout: 30_000,   // 30 second timeout — don't hang forever
});

// Model selection by task complexity
export const MODELS = {
  fast: "gpt-4o-mini",   // classification, simple Q&A, summarization
  smart: "gpt-4o",        // complex reasoning, code generation, analysis
};
</code></pre>

<p>The <code>maxRetries: 3</code> and <code>timeout</code> settings are critical. Without a timeout, a hung OpenAI request will keep your Express server's response object open indefinitely — and if you're running on a serverless function, you'll pay for that idle time.</p>

<h2>Step 2: Token Counting and Cost Guard</h2>

<p>The <code>tiktoken</code> library is OpenAI's own tokenizer — it counts tokens the exact same way the API does. Use it to reject requests before they hit the API:</p>

<pre><code class="language-javascript">// src/tokenCounter.js
import { encoding_for_model } from "tiktoken";

export function countMessageTokens(messages, model = "gpt-4o-mini") {
  const enc = encoding_for_model(model);
  let totalTokens = 0;

  for (const message of messages) {
    totalTokens += 4; // every message has ~4 tokens of overhead
    if (message.role) totalTokens += enc.encode(message.role).length;
    if (message.content) totalTokens += enc.encode(message.content).length;
    totalTokens += 1; // reply primer
  }

  enc.free(); // tiktoken requires explicit cleanup
  return totalTokens + 3; // overall reply overhead
}

// Express middleware — rejects requests over the token limit
export function tokenGuard(maxInputTokens = 4_000) {
  return (req, res, next) => {
    const messages = req.body?.messages;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const tokenCount = countMessageTokens(messages);

    if (tokenCount > maxInputTokens) {
      return res.status(400).json({
        error: \`Message too long: \${tokenCount} tokens (limit: \${maxInputTokens}). Shorten your message or clear the conversation.\`,
        tokenCount,
        limit: maxInputTokens,
      });
    }

    req.tokenCount = tokenCount; // pass downstream for logging
    next();
  };
}
</code></pre>

<p>A note on the limit: GPT-4o-mini's context window is 128K tokens, so 4,000 is conservative. But conservative is good here — a user who sends 30,000 tokens in one request is either doing something unusual or has a bug in their client. Reject it, log it, and let them know to clear their context.</p>

<h2>Step 3: Rate Limiting</h2>

<p>One user shouldn't be able to drain your API budget or trigger OpenAI rate limits for everyone else. Add rate limiting before the AI routes:</p>

<pre><code class="language-javascript">// src/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1-minute window
  max: 15,               // 15 requests per minute per IP
  standardHeaders: true, // return RateLimit headers
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait a moment before trying again.",
    retryAfter: 60,
  },
  keyGenerator: (req) => {
    // Use authenticated user ID if available, otherwise fall back to IP
    return req.user?.id || req.ip;
  },
});

// Stricter limit for expensive models
export const smartModelLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Too many complex requests. Rate limited for 60 seconds." },
});
</code></pre>

<h2>Step 4: Error Handling with Typed OpenAI Errors</h2>

<p>The OpenAI Node SDK throws typed errors. Use them — don't just check <code>err.message</code>:</p>

<pre><code class="language-javascript">// src/middleware/openaiErrorHandler.js
import OpenAI from "openai";

export function handleOpenAIError(err, req, res, next) {
  if (err instanceof OpenAI.APIError) {
    console.error(\`OpenAI API error: \${err.status} \${err.name}\`, {
      message: err.message,
      requestId: err.headers?.["x-request-id"],
    });

    if (err.status === 429) {
      return res.status(429).json({
        error: "AI service is busy. Please try again in a moment.",
        retryAfter: parseInt(err.headers?.["retry-after"] || "5"),
      });
    }

    if (err.status === 400) {
      return res.status(400).json({
        error: "Invalid request to AI service. Check your message format.",
      });
    }

    if (err.status === 401) {
      console.error("OpenAI authentication failed — check OPENAI_API_KEY");
      return res.status(503).json({ error: "AI service unavailable." });
    }
  }

  // Not an OpenAI error — pass to your generic error handler
  next(err);
}
</code></pre>

<h2>Step 5: The Chat Endpoint (Non-Streaming)</h2>

<p>Let's wire everything together for a standard, non-streaming response first:</p>

<pre><code class="language-javascript">// src/routes/chat.js
import express from "express";
import { openai, MODELS } from "../openaiClient.js";
import { tokenGuard } from "../tokenCounter.js";
import { aiRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post(
  "/",
  aiRateLimiter,
  tokenGuard(4_000),
  async (req, res, next) => {
    const { messages, useSmartModel = false } = req.body;
    const model = useSmartModel ? MODELS.smart : MODELS.fast;

    try {
      const completion = await openai.chat.completions.create({
        model,
        messages,
        max_tokens: 1_000, // cap output tokens to control cost
        temperature: 0.7,
      });

      const reply = completion.choices[0].message;
      const usage = completion.usage;

      res.json({
        message: reply,
        usage: {
          inputTokens: usage.prompt_tokens,
          outputTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
          estimatedCostUsd: estimateCost(usage, model),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

function estimateCost(usage, model) {
  // Prices per million tokens (as of mid-2025)
  const pricing = {
    "gpt-4o-mini": { input: 0.15, output: 0.60 },
    "gpt-4o": { input: 5.00, output: 15.00 },
  };
  const p = pricing[model] || pricing["gpt-4o-mini"];
  const inputCost = (usage.prompt_tokens / 1_000_000) * p.input;
  const outputCost = (usage.completion_tokens / 1_000_000) * p.output;
  return Number((inputCost + outputCost).toFixed(6));
}

export default router;
</code></pre>

<p>Notice <code>max_tokens: 1_000</code>. Without this, GPT-4o can produce 4,096 output tokens per request. If a user asks it to "write me a book," it will try. The <code>max_tokens</code> cap is your backstop.</p>

<h2>Step 6: Streaming Responses with Server-Sent Events</h2>

<p>Streaming makes AI features feel responsive. Instead of a blank screen for 3–8 seconds, the user sees text appear word by word. It's the difference between "this feels AI-powered" and "this is broken."</p>

<pre><code class="language-javascript">// src/routes/chat-stream.js
import express from "express";
import { openai, MODELS } from "../openaiClient.js";
import { tokenGuard } from "../tokenCounter.js";
import { aiRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post(
  "/stream",
  aiRateLimiter,
  tokenGuard(4_000),
  async (req, res, next) => {
    const { messages } = req.body;

    // Establish SSE connection
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders(); // send headers immediately

    try {
      const stream = await openai.chat.completions.create({
        model: MODELS.fast,
        messages,
        max_tokens: 1_000,
        stream: true,
      });

      let totalOutputTokens = 0;

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          totalOutputTokens += 1; // approximate; tiktoken is more accurate
          res.write(\`data: \${JSON.stringify({ type: "delta", content: delta })}\n\n\`);
        }

        // Check for stop reason
        if (chunk.choices[0]?.finish_reason === "length") {
          res.write(\`data: \${JSON.stringify({ type: "warning", message: "Response truncated at token limit" })}\n\n\`);
        }
      }

      res.write(\`data: \${JSON.stringify({ type: "done" })}\n\n\`);
      res.end();
    } catch (err) {
      // Send error over SSE before closing
      res.write(\`data: \${JSON.stringify({ type: "error", message: "Generation failed. Please try again." })}\n\n\`);
      res.end();
      // Also pass to error handler for logging
      console.error("Streaming error:", err.message);
    }
  }
);

export default router;
</code></pre>

<h2>Watch: OpenAI API with Node.js + Express</h2>

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:2rem 0"><iframe src="https://www.youtube.com/embed/Ygy9vDHj5xc" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allowfullscreen></iframe></div>

<h2>Streaming vs. Non-Streaming — When to Use Which</h2>

<table>
<thead>
<tr>
<th>Factor</th>
<th>Non-Streaming</th>
<th>Streaming (SSE)</th>
</tr>
</thead>
<tbody>
<tr>
<td>User experience</td>
<td>Blank screen until done (3–8s)</td>
<td>Text appears word by word — feels instant</td>
</tr>
<tr>
<td>Complexity</td>
<td>Standard REST response</td>
<td>SSE connection, chunked parsing on frontend</td>
</tr>
<tr>
<td>Usage logging</td>
<td>Easy — <code>completion.usage</code> has exact token counts</td>
<td>Harder — token counts only available via the final chunk</td>
</tr>
<tr>
<td>Caching</td>
<td>Can cache the full response</td>
<td>Can't cache a stream</td>
</tr>
<tr>
<td>Best for</td>
<td>API-to-API calls, short responses, classification tasks</td>
<td>User-facing chat, long completions, code generation</td>
</tr>
<tr>
<td>Serverless functions</td>
<td>Works everywhere</td>
<td>Needs long-running connection — use Vercel Edge Functions or a real server</td>
</tr>
</tbody>
</table>

<h2>Testing Your OpenAI Integration</h2>

<p>Mocking the OpenAI API in tests is a trap. The mock will pass but the real integration will fail in ways you didn't anticipate — different error formats, unexpected token usage, streaming chunk structure variations.</p>

<p>Instead:</p>

<ul>
<li><strong>Unit test everything except the API call.</strong> Test your token counting, your error handler, your response formatter — all without touching OpenAI. These functions should be pure and deterministic.</li>
<li><strong>Use a cheap model for integration tests.</strong> <code>gpt-4o-mini</code> is $0.15 per million input tokens. Your integration test suite probably costs fractions of a cent to run. Run it.</li>
<li><strong>Record and replay for expensive tests.</strong> Libraries like <code>nock</code> or VCR-style recording let you record real API responses and replay them in future test runs without hitting the API.</li>
</ul>

<pre><code class="language-javascript">// Example: testing the token guard middleware in isolation
import { tokenGuard } from "../src/tokenCounter.js";
import { createMockMiddlewareContext } from "./helpers.js";

test("tokenGuard rejects messages over the limit", async () => {
  const guard = tokenGuard(10); // tiny limit for test
  const { req, res, next } = createMockMiddlewareContext({
    body: {
      messages: [{ role: "user", content: "a".repeat(500) }],
    },
  });

  await guard(req, res, next);

  expect(res.statusCode).toBe(400);
  expect(res.body.error).toContain("too long");
  expect(next).not.toHaveBeenCalled();
});
</code></pre>

<h2>TL;DR</h2>

<ul>
<li><strong>Initialize the OpenAI client once</strong> with <code>maxRetries</code> and <code>timeout</code> set. Don't instantiate it in route handlers or you'll get a new client per request with no retry or timeout configuration.</li>
<li><strong>Count tokens before you call the API.</strong> Use <code>tiktoken</code> to measure input size and reject oversized requests before they cost you money. Set a <code>max_tokens</code> cap on output for the same reason.</li>
<li><strong>Rate limit by user ID, not just IP.</strong> Authenticated users with the same IP (corporate NAT, mobile networks) would all share a single IP limit — use their user ID as the rate limit key.</li>
<li><strong>Use typed error handling</strong> — <code>instanceof OpenAI.APIError</code> gives you the status code, request ID, and message. Turn 429s into user-friendly retry prompts, not 500 errors.</li>
<li><strong>Stream for user-facing features, skip it for internal calls.</strong> SSE streaming transforms the UX for chat interfaces. For batch processing or API-to-API calls, non-streaming is simpler to implement and log.</li>
<li><strong>Test everything except the API call.</strong> Token counting, error handling, and response formatting are all pure functions you can test cheaply. For integration tests, use <code>gpt-4o-mini</code> — it's cheap enough to run in CI.</li>
</ul>
`;

const bodyText = body_html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const wordCount = bodyText.split(" ").filter((w) => w.length > 0).length;
const readingTime = Math.ceil(wordCount / 200);

// Look up portfolio owner's ObjectId from main DB
const mainConn = await mongoose.createConnection(MONGODB_URI).asPromise();
const UserSchema = new mongoose.Schema({ name: String, email: String });
const User = mainConn.model("user", UserSchema);
const ownerUser = await User.findOne({ email: UESR_EMAIL }).select("_id");
if (!ownerUser) {
  console.error(`User not found for email: ${UESR_EMAIL}`);
  await mainConn.close();
  process.exit(1);
}
const authorId = ownerUser._id;
await mainConn.close();

await mongoose.connect(BLOGS_MONGODB_URI);

const existing = await BlogPost.findOne({ slug });
if (existing) {
  console.log(`⚠️  Article already exists (slug: ${slug}). Skipping.`);
  await mongoose.disconnect();
  process.exit(0);
}

const post = await BlogPost.create({
  title: "How to Integrate the OpenAI API into a Production Express App",
  slug,
  author: authorId,
  status: "published",
  publishedAt: new Date(),
  excerpt:
    "Build a production-grade Express.js API with OpenAI integration — including streaming, error handling, rate limiting, and cost control. Real code, no fluff.",
  coverImage:
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop&auto=format",
  tags: ["OpenAI", "Express", "Node.js", "AI", "API"],
  body_html,
  readingTime,
  seo: {
    metaTitle:
      "How to Integrate the OpenAI API into a Production Express App (2025)",
    metaDescription:
      "Build a production-grade Express.js API with OpenAI integration — including streaming, error handling, rate limiting, and cost control. Real code, no fluff.",
    canonicalUrl: `https://theharshdeepsingh.com/blog/${slug}`,
  },
  hasDraft: false,
});

console.log(`✅ Published: "${post.title}"`);
console.log(`   Slug:      ${post.slug}`);
console.log(`   Words:     ~${wordCount} words (~${readingTime} min read)`);
console.log(`   URL:       https://theharshdeepsingh.com/blog/${post.slug}`);

await mongoose.disconnect();
