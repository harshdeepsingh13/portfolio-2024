import "dotenv/config";
import mongoose from "mongoose";

const BLOGS_MONGODB_URI = process.env.BLOGS_MONGODB_URI;
const UESR_EMAIL = process.env.UESR_EMAIL;

if (!BLOGS_MONGODB_URI || !UESR_EMAIL) {
  console.error("Missing BLOGS_MONGODB_URI or UESR_EMAIL in .env");
  process.exit(1);
}

const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    author: String,
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

const slug = "full-stack-developer-portfolio-lessons";

const body_html = `
<p>I applied for a role at a mid-sized SaaS company about two years into my career. Strong company, interesting problem, good pay. I sent my application, got a recruiter callback, and then nothing for two weeks. When the feedback finally came: "We went with candidates with a stronger portfolio presence."</p>

<p>I had 23 GitHub repositories. I had a portfolio site. I had projects. What I didn't have — and what I didn't understand for another six months — was a portfolio that told a story. I had code. Not evidence of thinking, decision-making, or the ability to ship something real.</p>

<p>I've since built, rebuilt, and advised on a lot of developer portfolios. I've seen what gets people calls and what gets them ghosted. This isn't a guide about which framework to use or how to pick colors. It's about what actually moves the needle — the things I wish someone had told me in year one.</p>

<h2>Lesson 1: Two Great Projects Beat Twenty Mediocre Ones</h2>

<p>The instinct is to fill the portfolio. More projects = more evidence of experience. This is wrong.</p>

<p>A hiring manager or engineering lead looking at your portfolio has about three minutes. They're going to look at your two or three most prominent projects, click one or two live demo links, and form an opinion. If they see twenty repositories and most of them are "Todo App v2," "Weather App," "Netflix Clone," "Portfolio v1 through v6" — they've already categorized you as someone who builds tutorials, not someone who builds things.</p>

<p>The better approach: three to five projects, each with:</p>

<ul>
<li>A real problem it solves (not "I wanted to learn React")</li>
<li>A live deployment that actually works</li>
<li>A README that explains why you made the decisions you made</li>
<li>Enough complexity to have generated at least one interesting engineering problem</li>
</ul>

<p>Projects that tend to work: tools you built because you were frustrated with an existing tool, apps solving problems you personally had, projects where you integrated with a real API or real data source, anything with a live user base (even 10 users counts).</p>

<p>Projects that tend not to work: tutorial clones (unless heavily modified), apps that only run locally, projects that stop at the MVP and never got deployed, apps with the same name as thousands of other developer portfolios ("My Todo App," "My Weather App").</p>

<p>If you have 20 repos, that's fine. Pin your three best to your GitHub profile. Don't make people wade through everything — curate it.</p>

<h2>Lesson 2: Case Studies Beat Code Screenshots</h2>

<p>Here's the thing about showing a screenshot of your app: everyone can make an app look good in a screenshot. Filters, cropping, ideal state data. A screenshot shows what you built. It tells me nothing about how you think.</p>

<p>A case study shows how you think. And how you think is what you're being hired for.</p>

<p>A case study doesn't have to be a five-page document. Two or three paragraphs on each project covering:</p>

<ol>
<li><strong>The problem.</strong> What did you set out to solve? Be specific. Not "I wanted to learn Next.js" — that's not a problem. "Resume submissions were getting lost in email threads, so I built a tool that…" — that's a problem.</li>
<li><strong>Your approach and the tradeoffs you considered.</strong> What did you think about? What did you try first? What didn't work? This is where you demonstrate that you can make technical decisions, not just execute instructions.</li>
<li><strong>What you shipped.</strong> Not every feature you imagined — what you actually built and deployed.</li>
<li><strong>What you'd do differently.</strong> This one is disarming in the best way. It shows self-awareness, reflection, and the ability to evaluate your own work critically. Engineers who can't critique their own code can't grow.</li>
</ol>

<p>I've seen portfolios with two projects and a well-written case study for each that outperformed portfolios with fifteen projects and no context. The case study gives an interviewer something to ask about. It shows you've thought deeply about the work. It makes the technical interview easier because you already answered half the questions in writing.</p>

<h2>Lesson 3: If It's Not Deployed, It Doesn't Exist</h2>

<p>This is the blunt version. A project that runs on localhost is a project you're still working on. It is not a portfolio piece.</p>

<p>I've reviewed portfolios where the "live demo" link was a localhost URL. I've seen GitHub repositories where the README says "deployment in progress" with a date from 18 months ago. I've seen apps in screenshots that couldn't actually run because they depended on a local database with no seed data.</p>

<p>Deploying has never been easier or cheaper. There's no excuse for a portfolio project that isn't live.</p>

<ul>
<li><strong>Frontend:</strong> Vercel (free), Netlify (free), Cloudflare Pages (free). Zero configuration for most frameworks.</li>
<li><strong>Backend / API:</strong> Railway (free tier), Render (free tier), Fly.io (free tier). These all support Node.js, Python, Go, whatever you're running.</li>
<li><strong>Database:</strong> MongoDB Atlas free tier (512MB), Supabase free tier (PostgreSQL), PlanetScale free tier (MySQL).</li>
<li><strong>Full stack:</strong> Railway handles full-stack apps well. Render lets you deploy multiple services from one repo. Both have one-click GitHub deploys.</li>
</ul>

<p>Total cost of a deployed side project: $0, with a free domain subdomain. Add a custom domain for $12/year and you have a genuinely professional-looking production deployment.</p>

<p>There's a secondary benefit to deploying: it forces you to actually finish things. There's a long list of problems you don't know about until you deploy — environment variable management, CORS configuration, database connection pooling, static asset serving. Deploying is part of building. A portfolio project that's never been deployed has never been truly finished.</p>

<h2>Lesson 4: The README Is Your First Interview</h2>

<p>When a hiring manager or senior engineer clicks the GitHub link from your portfolio, the first thing they see is the README. If it says "A project I made for learning" or has no description at all, they've already lost interest.</p>

<p>The README is where you make the technical case for yourself before you're in the room. Here's what a good one contains:</p>

<p><strong>First paragraph:</strong> What does this thing do and why does it exist? Not "this is a web app" — tell me the specific problem it solves. One or two sentences.</p>

<p><strong>Tech stack and why:</strong> Not just a logo grid. A sentence about why you chose what you chose. "Used PostgreSQL instead of MongoDB because the data has strong relational structure with lots of joins." "Chose Next.js App Router over CRA because we needed SSR for SEO and a built-in API layer." These sentences prove you made intentional decisions.</p>

<p><strong>Screenshots or a GIF:</strong> A 10-second screen recording of the app working is worth a thousand words. Not staged, not filtered — just the actual app.</p>

<p><strong>How to run it:</strong> Clear, complete instructions. If I clone it and follow your README and it doesn't work, that's a flag. If it works first try, that's a positive signal — it means you document carefully and you care about the developer experience of your code.</p>

<p><strong>Known limitations / what you'd do differently:</strong> One paragraph. Shows maturity. "If I built this again, I'd use a message queue for the email sending instead of doing it synchronously in the request lifecycle — it caused timeouts under load."</p>

<p>This README takes maybe 45 minutes to write. It dramatically changes how your project is perceived.</p>

<h2>Lesson 5: Get Your Own Domain</h2>

<p>This one is simple and often skipped. Your portfolio should live at <code>yourname.com</code> or <code>yourname.dev</code> — not <code>github.io/yourname/portfolio</code> or <code>yourname.netlify.app</code>.</p>

<p>A custom domain does two things: it signals that you take yourself seriously as a professional, and it's a much better URL to put on a resume, LinkedIn, or business card. "theharshdeepsingh.com" looks intentional. "harshdeep-singh-13.github.io/portfolio-2024" looks like a homework assignment.</p>

<p>Domains cost $10–15 per year. That is a rounding error in any budget. Buy yours today. Redirect your GitHub Pages / Vercel / Netlify deployment to it. It takes 30 minutes and it never needs to change — you own it.</p>

<p>A note on choosing the domain: use your name. Not your "developer brand" or a clever handle. Names rank in Google. If someone searches for you, they should find your portfolio at the top. A personal domain with your name is one of the easiest SEO wins available to you.</p>

<h2>Lesson 6: One AI Integration Changes Everything</h2>

<p>Here's the hiring landscape in 2025 from a practical perspective: companies want developers who can work with AI, build on top of AI APIs, and integrate AI capabilities into existing products. This is new enough that not everyone has done it. Old enough that "I'm planning to learn it" isn't a compelling answer.</p>

<p>One project with a real AI integration moves you from the pile to the shortlist. Not because AI is a magic word — but because it demonstrates technical currency. You know what the OpenAI API looks like. You've dealt with token limits and streaming and prompt engineering. You've thought about cost and abuse prevention. These are all non-trivial.</p>

<p>What counts:</p>

<ul>
<li>A feature in an existing project that uses GPT-4o, Claude, or Gemini for a specific, meaningful task (not "ask AI anything" — that's too vague to be impressive)</li>
<li>A RAG (retrieval-augmented generation) pipeline — document upload, embedding, search, answer generation</li>
<li>An agent that takes structured actions based on LLM output (web search, database queries, API calls)</li>
<li>A classification or extraction feature that uses an LLM where a simpler approach wouldn't have worked</li>
</ul>

<p>What doesn't count:</p>

<ul>
<li>"Used ChatGPT to help me write this code" (everyone does this)</li>
<li>A UI wrapper around ChatGPT that just passes prompts through (no engineering decision was made)</li>
<li>A project that uses AI for something that a regex would handle just as well</li>
</ul>

<p>The bar isn't high. Ship one genuinely useful AI feature, document the decisions you made (model selection, prompt design, cost management), and you're ahead of the majority of developers applying for the same roles.</p>

<h2>Watch: Portfolio Reviews — What Actually Works</h2>

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:2rem 0"><iframe src="https://www.youtube.com/embed/sgQAD_pr9dc" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allowfullscreen></iframe></div>

<h2>Weak vs. Strong Portfolio Signals</h2>

<table>
<thead>
<tr>
<th>Signal</th>
<th>Weak</th>
<th>Strong</th>
</tr>
</thead>
<tbody>
<tr>
<td>Project count</td>
<td>20+ repos, half are tutorial clones</td>
<td>3–5 curated projects, each with a clear purpose</td>
</tr>
<tr>
<td>Project quality</td>
<td>Todo apps, weather apps, Netflix/Airbnb clones</td>
<td>Tools solving real problems, deployed with real users</td>
</tr>
<tr>
<td>Live demos</td>
<td>No live link, "works on my machine," localhost screenshots</td>
<td>Deployed URLs that load in under 3 seconds</td>
</tr>
<tr>
<td>Documentation</td>
<td>No README or "this is a project I made"</td>
<td>Problem statement, tech choices explained, known limitations</td>
</tr>
<tr>
<td>Tech recency</td>
<td>Create React App, class components, outdated dependencies</td>
<td>Current stack (Next.js 15, TypeScript, modern APIs)</td>
</tr>
<tr>
<td>AI integration</td>
<td>None, or "used AI to help me code"</td>
<td>One genuine AI feature with documented engineering decisions</td>
</tr>
<tr>
<td>Domain</td>
<td>github.io/username or platform subdomain</td>
<td>yourname.com — personal, memorable, professional</td>
</tr>
<tr>
<td>Case studies</td>
<td>Screenshots in a grid with a "View Project" button</td>
<td>Problem → approach → tradeoffs → outcome — per project</td>
</tr>
</tbody>
</table>

<h2>What I'd Do on Day 1 If I Were Starting Over</h2>

<p>If I were a developer today with no portfolio and a job to find, here's the exact sequence I'd follow:</p>

<p><strong>Day 1:</strong> Register <code>firstnamelastname.com</code>. It costs $12. Do it before you build anything. Having the domain makes the whole thing feel real and gives you a deadline.</p>

<p><strong>Week 1:</strong> Identify one problem I genuinely have — something I do manually that should be automated, something I've searched for that doesn't exist, something at work that annoys me. Build the simplest version of the solution. Not a full product — a working tool. One feature, deployed.</p>

<p><strong>Week 2:</strong> Write the case study. What was the problem? What did I consider? What did I ship? What didn't make the cut? What would I do differently? Two or three paragraphs per question. This is more valuable than the code itself.</p>

<p><strong>Week 3:</strong> Add an AI integration to the project — something that actually makes the tool better, not a bolt-on. Even a single endpoint that uses an LLM for classification or text generation counts, as long as it's doing something a simpler approach couldn't.</p>

<p><strong>Week 4:</strong> Point the domain at the project. Add the URL to LinkedIn's "Featured" section and your resume. Ask one person who is not a developer to try using the tool and tell you what they're confused by. Fix those things.</p>

<p>That's it. One good project, one good case study, one AI integration, a custom domain, a LinkedIn presence. Four weeks. That's a portfolio that gets callbacks. Everything else is refinement.</p>

<h2>TL;DR</h2>

<ul>
<li><strong>Curate, don't accumulate.</strong> Three deployed projects with case studies beat twenty unfinished repos. Pin your best work. Hide the rest.</li>
<li><strong>Write case studies for every project.</strong> Problem → approach → tradeoffs → outcome → what you'd do differently. This is what interviews are about anyway — you're just answering in advance.</li>
<li><strong>Nothing without a live URL.</strong> Free tiers on Vercel, Railway, and Render make deployment trivial. An undeployed project is an unfinished project.</li>
<li><strong>The README is your first impression from GitHub.</strong> Spend 45 minutes on it. Explain the why, not just the what. Include how to run it. List the limitations. That's a professional developer.</li>
<li><strong>Get the domain.</strong> yourname.com, $12, 30 minutes. It signals intent and makes your portfolio findable in Google searches by your own name.</li>
<li><strong>Build one thing with a real AI integration.</strong> Not a ChatGPT wrapper — a feature that uses an LLM to solve a specific problem in your project, with documented decisions about model selection and prompt design.</li>
</ul>
`;

const bodyText = body_html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const wordCount = bodyText.split(" ").filter((w) => w.length > 0).length;
const readingTime = Math.ceil(wordCount / 200);

await mongoose.connect(BLOGS_MONGODB_URI);

const existing = await BlogPost.findOne({ slug });
if (existing) {
  console.log(`⚠️  Article already exists (slug: ${slug}). Skipping.`);
  await mongoose.disconnect();
  process.exit(0);
}

const post = await BlogPost.create({
  title:
    "Full Stack Developer Portfolio Lessons: What I Learned Building 10+ Projects",
  slug,
  author: UESR_EMAIL,
  status: "published",
  publishedAt: new Date(),
  excerpt:
    "Honest lessons from building and shipping 10+ full stack projects — what makes a portfolio stand out, what hiring managers actually look at, and what I'd do differently starting today.",
  coverImage:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=630&fit=crop&auto=format",
  tags: ["Portfolio", "Career", "Full Stack", "Job Search"],
  body_html,
  readingTime,
  seo: {
    metaTitle:
      "Full Stack Developer Portfolio Lessons: What I Learned Building 10+ Projects",
    metaDescription:
      "Honest lessons from building and shipping 10+ full stack projects — what makes a portfolio stand out, what hiring managers actually look at, and what I'd do differently.",
    canonicalUrl: `https://theharshdeepsingh.com/blog/${slug}`,
  },
  hasDraft: false,
});

console.log(`✅ Published: "${post.title}"`);
console.log(`   Slug:      ${post.slug}`);
console.log(`   Words:     ~${wordCount} words (~${readingTime} min read)`);
console.log(`   URL:       https://theharshdeepsingh.com/blog/${post.slug}`);

await mongoose.disconnect();
