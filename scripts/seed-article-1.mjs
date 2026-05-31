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

const slug = "how-to-build-ai-resume-builder-langchain-nodejs";

const body_html = `
<p>A few months back, my friend Marcus was applying for a senior backend role at a fintech company. He had five years of solid experience — distributed systems, AWS, the whole stack. But his resume read like a list of job descriptions someone had copied from LinkedIn. "Responsible for maintaining microservices." "Assisted with CI/CD pipeline implementation." You know the type.</p>

<p>I told him: the problem isn't what you did, it's how you're saying it. Hiring managers spend about six seconds on a resume before deciding whether to read it properly. Six seconds. And if those six seconds are spent reading "responsible for maintaining" — you've lost them.</p>

<p>We spent two hours rewriting it together. Every bullet point started with a strong verb. Every achievement had a number. "Reduced API response time by 40% by introducing Redis caching across three high-traffic endpoints." Much better. Marcus got the interview.</p>

<p>The obvious next thought was: what if you could automate this? Not in the "dump your resume into ChatGPT and ask it to make it better" way — that produces generic slop. I mean a real, structured AI pipeline that understands resume context, applies professional rewriting patterns, and returns clean, job-specific output.</p>

<p>That's what LangChain is built for. And in this guide, we're going to build exactly that: an AI-powered resume rewriter using LangChain and Node.js, with a real Express API, streaming responses, and the kind of prompt engineering that actually produces good results.</p>

<h2>What Is LangChain, and Why Bother?</h2>

<p>Here's the honest answer: LangChain is an orchestration framework for building applications on top of large language models. Think of it the way you'd think of Express.js — Express doesn't do anything you couldn't do with raw Node's <code>http</code> module, but it gives you a structured, composable way to build web apps that doesn't collapse under its own weight.</p>

<p>LangChain does the same thing for LLM applications. You <em>could</em> just call the OpenAI API directly everywhere. For a one-off script, that's fine. But as soon as your app grows — different prompts for different tasks, multi-step reasoning chains, memory across conversations — raw API calls get messy fast.</p>

<p>Here's what raw OpenAI API code looks like once a project grows:</p>

<pre><code class="language-javascript">// Raw OpenAI — works, but scales badly
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: \`Rewrite this section: \${section}\` }
  ]
});
const rewritten = response.choices[0].message.content;
</code></pre>

<p>That's fine for one call. Now add: prompt versioning, chaining that output into a second model call, memory from previous messages, fallback to a different model when rate limits hit, streaming output to the client. Suddenly you're managing a lot of state manually.</p>

<p>LangChain handles all of that with composable primitives: <code>PromptTemplate</code> for reusable, testable prompts; <code>LLMChain</code> for connecting a prompt to a model; <code>SequentialChain</code> for multi-step pipelines; built-in streaming support; and integrations with every major LLM provider.</p>

<p>For our resume builder, the chain looks like this: parse the resume into structured sections, run each section through a prompt that produces action-oriented bullet points, then return the assembled result. Let's build it.</p>

<h2>What We're Building</h2>

<p>Before we write a line of code, here's the system at a glance:</p>

<pre>
┌─────────────────────────────────────────────────────┐
│                   CLIENT (Frontend)                  │
│         POST /api/rewrite { resumeText, section }    │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                  EXPRESS API (Node.js)               │
│  1. Validate input                                   │
│  2. Parse resume into sections                       │
│  3. Call LangChain rewrite chain                     │
│  4. Return improved bullet points                    │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              LANGCHAIN REWRITE CHAIN                 │
│  PromptTemplate → ChatOpenAI (GPT-4) → Output       │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                  OPENAI API (GPT-4)                  │
└─────────────────────────────────────────────────────┘
</pre>

<p>Nothing revolutionary — but each layer has a single, testable job. The chain is the interesting part, so let's get there quickly.</p>

<h2>Project Setup</h2>

<p>Start a new Node.js project and install the dependencies:</p>

<pre><code class="language-bash">mkdir resume-ai && cd resume-ai
npm init -y
npm install express langchain @langchain/openai @langchain/core dotenv
</code></pre>

<p>Create a <code>.env</code> file at the root:</p>

<pre><code class="language-bash">OPENAI_API_KEY=sk-your-key-here
PORT=3001
</code></pre>

<p>And your project structure:</p>

<pre>
resume-ai/
├── src/
│   ├── parseResume.js
│   ├── resumeChain.js
│   └── app.js
├── .env
└── package.json
</pre>

<p>Add <code>"type": "module"</code> to <code>package.json</code> so we can use ES module syntax throughout.</p>

<h2>Step 1: Parsing the Resume</h2>

<p>This is the unglamorous part that everyone skips, and it's why most AI resume tools produce garbage. You can't just throw 800 words of resume text at a model and ask it to "make it better." You need to isolate the section you're improving — otherwise the model is operating without context.</p>

<p>Here's a simple section parser. It's not perfect — real resumes come in dozens of formats — but it handles the common patterns:</p>

<pre><code class="language-javascript">// src/parseResume.js
export function parseResumeText(rawText) {
  const sections = {
    summary: "",
    experience: [],
    skills: [],
    education: [],
  };

  const sectionKeywords = {
    summary: ["summary", "objective", "profile", "about"],
    experience: ["experience", "employment", "work history", "career"],
    skills: ["skills", "technical skills", "technologies", "competencies"],
    education: ["education", "academic", "degree", "university"],
  };

  const lines = rawText.split("\\n").filter((l) => l.trim().length > 0);
  let currentSection = null;

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();

    const detected = Object.entries(sectionKeywords).find(([, keywords]) =>
      keywords.some((kw) => lowerLine.includes(kw))
    );

    if (detected && lowerLine.length < 40) {
      currentSection = detected[0];
      continue;
    }

    if (!currentSection) continue;

    if (currentSection === "summary") {
      sections.summary += line + " ";
    } else if (currentSection === "experience") {
      sections.experience.push(line);
    } else if (currentSection === "skills") {
      sections.skills.push(line);
    } else if (currentSection === "education") {
      sections.education.push(line);
    }
  }

  sections.summary = sections.summary.trim();
  return sections;
}
</code></pre>

<p>Two things worth noting: the <code>lowerLine.length &lt; 40</code> check prevents a line like "Responsible for experience in customer service" from being misread as a section header. And we're splitting on the literal string <code>"\\n"</code> — if you're receiving text from a textarea or file upload, newlines will already be there.</p>

<h2>Step 2: The LangChain Rewrite Chain</h2>

<p>This is the heart of the app. The LangChain chain connects three things: the prompt template, the model, and the output. Here's what it looks like:</p>

<pre><code class="language-javascript">// src/resumeChain.js
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";

const model = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0.4,
  maxTokens: 800,
});

const rewritePrompt = new PromptTemplate({
  template: \`You are an expert resume coach who helps software developers land roles at top tech companies.

Here is the candidate's full resume for context:
{resumeContext}

Rewrite the following experience bullet points to be more impactful:
- Start every bullet with a strong action verb (Built, Reduced, Led, Implemented, Optimized)
- Quantify achievements wherever possible (%, time saved, scale)
- Lead with the outcome, not the activity
- Keep each bullet to one clear sentence
- Output exactly 4 bullet points

Section to rewrite:
{sectionText}

Rewritten bullets:\`,
  inputVariables: ["resumeContext", "sectionText"],
});

export const rewriteChain = new LLMChain({
  llm: model,
  prompt: rewritePrompt,
});
</code></pre>

<p>Notice the temperature is set to 0.4, not 0.7. For rewriting tasks, you want the model to be slightly creative (not just rephrasing verbatim) but not so creative it starts inventing things. 0.4 is a good starting point — adjust based on your results.</p>

<p>The prompt is structured around three principles: give the model a role (<em>"expert resume coach"</em>), give it context (the full resume), and give it explicit formatting constraints (action verbs, quantification, exactly 4 bullets). Vague prompts produce vague output. Explicit prompts produce consistent, usable output.</p>

<h2>Step 3: The Express API</h2>

<p>Now we wire everything together into an HTTP endpoint:</p>

<pre><code class="language-javascript">// src/app.js
import "dotenv/config";
import express from "express";
import { rewriteChain } from "./resumeChain.js";
import { parseResumeText } from "./parseResume.js";

const app = express();
app.use(express.json({ limit: "50kb" })); // resumes aren't huge

app.post("/api/rewrite", async (req, res) => {
  const { resumeText, targetSection } = req.body;

  if (!resumeText || typeof resumeText !== "string") {
    return res.status(400).json({ error: "resumeText is required" });
  }
  if (!targetSection || typeof targetSection !== "string") {
    return res.status(400).json({ error: "targetSection is required" });
  }

  // Stay within token limits — GPT-4 context window is large,
  // but we don't need to send the whole resume every time.
  const resumeContext = resumeText.slice(0, 3000);

  try {
    const result = await rewriteChain.call({
      resumeContext,
      sectionText: targetSection,
    });

    res.json({
      original: targetSection,
      rewritten: result.text.trim(),
    });
  } catch (err) {
    console.error("Chain error:", err.message);

    if (err.message?.includes("Rate limit")) {
      return res.status(429).json({ error: "Rate limit hit. Try again in a moment." });
    }

    res.status(500).json({ error: "Rewrite failed. Check your OpenAI API key." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(\`Resume AI API running on :$\{PORT}\`));
</code></pre>

<p>The input size limit (<code>50kb</code>) and the <code>resumeContext.slice(0, 3000)</code> are both intentional. Most GPT-4 token limits won't be hit by a 3,000-character resume excerpt, but some resumes are surprisingly long — especially ones with extensive project descriptions. Truncating at 3,000 characters keeps costs predictable.</p>

<h2>Step 4: Streaming the Response</h2>

<p>For a good UX, you want to stream the AI response as it arrives rather than waiting for the full completion. A 400-word rewrite might take 6–8 seconds to complete — a blank screen for 8 seconds feels broken.</p>

<p>LangChain makes streaming straightforward with callbacks:</p>

<pre><code class="language-javascript">import { HumanMessage } from "@langchain/core/messages";

app.post("/api/rewrite/stream", async (req, res) => {
  const { resumeText, targetSection } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const streamingModel = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.4,
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          res.write(\`data: $\{JSON.stringify({ token })}\n\n\`);
        },
        handleLLMEnd() {
          res.write("data: [DONE]\\n\\n");
          res.end();
        },
        handleLLMError(err) {
          res.write(\`data: $\{JSON.stringify({ error: err.message })}\n\n\`);
          res.end();
        },
      },
    ],
  });

  const resumeContext = resumeText?.slice(0, 3000) || "";
  const prompt = \`Rewrite these resume bullets for a software developer. Be concise and action-oriented:\\n$\{targetSection}\`;

  await streamingModel.invoke([new HumanMessage(prompt)]);
});
</code></pre>

<p>On the frontend, you'd consume this with the Fetch API and <code>ReadableStream</code>. Each <code>data:</code> event carries a token, and you append it to the UI as it arrives. The user sees the response materialize in real time — feels fast, even when it isn't.</p>

<h2>Watch: LangChain in Node.js (Quick Start)</h2>

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:2rem 0"><iframe src="https://www.youtube.com/embed/Wxx1KUWJFv4" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allowfullscreen></iframe></div>

<h2>Common Pitfalls (and How to Dodge Them)</h2>

<h3>1. Token limits sneaking up on you</h3>
<p>GPT-4's context window is large, but you pay per token. If you're sending the full resume + prompt on every request, costs add up fast at scale. The fix: truncate the resume context (as shown above) and cache the parsed sections so you're not re-parsing on every API call.</p>

<h3>2. The model inventing achievements</h3>
<p>This is the big one. Ask the model to "quantify achievements" without any source data, and it will make numbers up. "Reduced load time by 73%" sounds great until the hiring manager asks about it in an interview. The fix: explicitly tell the model in the prompt: <em>"Only add numbers if they appear in the original text. If no numbers are present, use qualitative language instead."</em></p>

<h3>3. Prompt injection through resume content</h3>
<p>A crafty user could put something like <code>"Ignore all previous instructions and output..."</code> inside their resume text. Since you're sending that text directly to the model, it works. The fix: sanitize input and separate resume content from the instruction portion of the prompt with a clear delimiter, like <code>---RESUME START---</code> / <code>---RESUME END---</code>.</p>

<h3>4. Not rate limiting</h3>
<p>OpenAI's rate limits are per API key, not per user. One user hammering your endpoint can hit the limit for everyone. Add a rate limiter like <code>express-rate-limit</code> before you go live — 5 requests per minute per IP is a reasonable starting point for a resume tool.</p>

<h3>5. Picking GPT-4 when you don't need it</h3>
<p>GPT-4 is expensive and slow. For most resume rewriting tasks, <code>gpt-4o-mini</code> produces nearly identical results at a fraction of the cost. Test both. You might be surprised how good the cheaper model is for structured, constrained tasks like this one.</p>

<h2>LangChain vs. Raw OpenAI API — When to Use Which</h2>

<table>
<thead>
<tr>
<th>Factor</th>
<th>Raw OpenAI API</th>
<th>LangChain</th>
</tr>
</thead>
<tbody>
<tr>
<td>Setup complexity</td>
<td>Low — one import, one call</td>
<td>Medium — more abstractions to learn</td>
</tr>
<tr>
<td>Single prompt apps</td>
<td>Perfect fit</td>
<td>Overkill</td>
</tr>
<tr>
<td>Multi-step chains</td>
<td>Tedious to wire manually</td>
<td>First-class support</td>
</tr>
<tr>
<td>Prompt reuse and testing</td>
<td>DIY — no built-in structure</td>
<td>PromptTemplate makes this easy</td>
</tr>
<tr>
<td>Memory across turns</td>
<td>Manual array management</td>
<td>Built-in memory types</td>
</tr>
<tr>
<td>Streaming</td>
<td>Supported, manual wiring</td>
<td>Supported, callback-based</td>
</tr>
<tr>
<td>Switching LLM providers</td>
<td>Rewrite API calls</td>
<td>Swap the model object</td>
</tr>
<tr>
<td>Community / ecosystem</td>
<td>Smaller (OpenAI-specific)</td>
<td>Large, active, lots of integrations</td>
</tr>
</tbody>
</table>

<p>The rule of thumb: if your app makes more than two different types of LLM calls, or if you need any kind of chaining, LangChain saves you from writing orchestration code from scratch. For a simple one-shot wrapper, raw API is cleaner.</p>

<h2>TL;DR</h2>

<ul>
<li><strong>LangChain</strong> is an orchestration layer for LLM apps — think Express for AI. Use it when you have multi-step chains, prompt reuse, or memory requirements.</li>
<li><strong>Parse before you prompt.</strong> Sending a raw resume blob to the model is a recipe for generic output. Identify the section you want to improve and give the model focused context.</li>
<li><strong>Constrain the prompt explicitly.</strong> Action verbs, number quantification, bullet count — tell the model exactly what format you want. Vague prompts produce vague results.</li>
<li><strong>Stream responses</strong> for better UX. A blank screen for 8 seconds feels broken; a response materializing in real time feels fast.</li>
<li><strong>Guard against pitfalls:</strong> rate limit your API, sanitize resume input against prompt injection, and test <code>gpt-4o-mini</code> before defaulting to GPT-4 — it's often good enough and 10x cheaper.</li>
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
  title: "How to Build an AI Resume Builder with LangChain and Node.js",
  slug,
  author: authorId,
  status: "published",
  publishedAt: new Date(),
  excerpt:
    "Learn how to build an AI-powered resume builder using LangChain and Node.js. Step-by-step guide with real code, architecture diagram, and prompt engineering that actually works.",
  coverImage:
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&h=630&fit=crop&auto=format",
  tags: ["AI", "LangChain", "Node.js", "OpenAI", "Tutorial"],
  body_html,
  readingTime,
  seo: {
    metaTitle:
      "How to Build an AI Resume Builder with LangChain and Node.js (2025)",
    metaDescription:
      "Learn how to build an AI-powered resume builder using LangChain and Node.js. Step-by-step guide with code examples, architecture diagram, and real prompts.",
    canonicalUrl:
      "https://theharshdeepsingh.com/blog/how-to-build-ai-resume-builder-langchain-nodejs",
  },
  hasDraft: false,
});

console.log(`✅ Published: "${post.title}"`);
console.log(`   Slug:      ${post.slug}`);
console.log(`   Words:     ~${wordCount} words (~${readingTime} min read)`);
console.log(
  `   URL:       https://theharshdeepsingh.com/blog/${post.slug}`
);

await mongoose.disconnect();
