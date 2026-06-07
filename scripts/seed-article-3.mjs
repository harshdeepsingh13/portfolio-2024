import "dotenv/config";
import { authenticate, createPost } from "./lib/blogApi.mjs";

// Requires: dev server running at NEXT_PUBLIC_SITE_URL (npm run dev)
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const EMAIL    = process.env.UESR_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!BASE_URL || !EMAIL || !PASSWORD) {
  console.error("Missing NEXT_PUBLIC_SITE_URL, UESR_EMAIL, or ADMIN_PASSWORD in .env");
  console.error("Ensure the dev server is running: npm run dev");
  process.exit(1);
}

const slug = "deploying-nextjs-aws-cicd-pipelines";

const body_html = `
<p>The first time I deployed a Next.js app to production, it took me three days. Not because the app was complicated — it was a straightforward portfolio site. It took three days because I had no idea what I was doing with AWS, I'd never written a GitHub Actions workflow, and every tutorial I found either skipped the hard parts or assumed I already knew them.</p>

<p>By the time I was done, I had a deployment pipeline I was genuinely proud of: push to main, GitHub Actions runs the build, tests pass, the app deploys to an EC2 instance behind CloudFront. Zero manual steps. Zero downtime deploys. Total cost: about $5/month.</p>

<p>This guide is the one I wish had existed. We're going to deploy a Next.js app to AWS from scratch — EC2 for compute, CloudFront for CDN, GitHub Actions for CI/CD — with every step explained so you understand what you're building, not just copying commands.</p>

<h2>Why AWS Instead of Vercel?</h2>

<p>This is a fair question. Vercel is genuinely excellent for Next.js, and for most projects it's the right call. You push, it deploys. Done.</p>

<p>AWS makes sense when:</p>

<ul>
<li>You need to control the infrastructure (compliance, data residency, custom VPC configuration)</li>
<li>You're running other services (databases, queues, lambdas) in AWS and want everything in the same network</li>
<li>You want to learn infrastructure skills that transfer to enterprise environments</li>
<li>Your app has specific performance requirements that benefit from custom CloudFront configuration</li>
<li>You're a freelancer or consultant who wants to bill separately for infrastructure</li>
</ul>

<p>If none of those apply to you, use Vercel. This guide is for when they do.</p>

<h2>The Architecture</h2>

<p>Here's what we're building:</p>

<pre>
┌────────────────────────────────────────────────────────┐
│                   GITHUB ACTIONS CI/CD                  │
│                                                          │
│  Push to main → Build → Test → Deploy to EC2           │
└──────────────────────┬─────────────────────────────────┘
                       │ SSH deploy
                       ▼
┌────────────────────────────────────────────────────────┐
│                    AWS EC2 INSTANCE                      │
│                                                          │
│  Ubuntu 22.04 LTS                                        │
│  Node.js 20 + PM2 (process manager)                     │
│  Next.js app running on port 3000                        │
│  Nginx reverse proxy (port 80/443 → 3000)               │
└──────────────────────┬─────────────────────────────────┘
                       │ Origin
                       ▼
┌────────────────────────────────────────────────────────┐
│                  CLOUDFRONT CDN                          │
│                                                          │
│  Static assets cached at edge (/_next/static/*)         │
│  TTL: 1 year for static, 0 for HTML                    │
│  SSL termination via ACM certificate                     │
│  Custom domain: yourapp.com                             │
└────────────────────────────────────────────────────────┘
</pre>

<p>This isn't the only way to run Next.js on AWS. You could use Elastic Beanstalk, App Runner, ECS, or deploy static exports to S3 + CloudFront. The EC2 + CloudFront approach gives you the most control and transfers the most skills to enterprise environments.</p>

<h2>Prerequisites</h2>

<ul>
<li>An AWS account (free tier works for learning; a t3.micro is enough for small apps)</li>
<li>A domain name (optional but recommended — we'll set up SSL)</li>
<li>A GitHub repository with your Next.js app</li>
<li>Basic familiarity with the AWS console</li>
</ul>

<p>The total setup takes about 90 minutes the first time. After that, every deployment is automatic.</p>

<h2>Step 1: Set Up the EC2 Instance</h2>

<p>In the AWS Console, navigate to EC2 and launch a new instance. The settings that matter:</p>

<ul>
<li><strong>AMI:</strong> Ubuntu Server 22.04 LTS (free tier eligible)</li>
<li><strong>Instance type:</strong> t3.micro (1 vCPU, 1GB RAM) for small apps; t3.small for medium traffic</li>
<li><strong>Key pair:</strong> Create a new one, download it — you'll need this for SSH and GitHub Actions</li>
<li><strong>Security group:</strong> Allow inbound traffic on ports 22 (SSH), 80 (HTTP), and 443 (HTTPS). Add your IP as the only source for port 22 (don't expose SSH to 0.0.0.0/0).</li>
</ul>

<p>Once the instance is running, SSH in and set up the environment:</p>

<pre><code class="language-bash"># Connect to your instance
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally (process manager for Node.js)
sudo npm install -g pm2

# Install Nginx
sudo apt-get install -y nginx

# Verify everything installed correctly
node --version   # v20.x.x
npm --version    # 10.x.x
pm2 --version    # 5.x.x
nginx -v         # nginx/1.24.x
</code></pre>

<h2>Step 2: Configure Nginx as a Reverse Proxy</h2>

<p>Nginx will listen on port 80 and forward requests to your Next.js app on port 3000. This is the standard setup for Node.js apps on Linux servers.</p>

<pre><code class="language-bash">sudo nano /etc/nginx/sites-available/nextjs-app
</code></pre>

<p>Paste this configuration:</p>

<pre><code class="language-bash">server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    # Proxy requests to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache Next.js static assets at Nginx level too
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
</code></pre>

<pre><code class="language-bash"># Enable the site and test the config
sudo ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
sudo nginx -t            # should say "test is successful"
sudo systemctl restart nginx
</code></pre>

<h2>Step 3: The GitHub Actions Workflow</h2>

<p>This is where the CI/CD magic happens. The workflow does four things: checks out code, runs your build, SSHs into the server, and restarts the app. Create this file in your repository:</p>

<pre><code class="language-bash">mkdir -p .github/workflows
</code></pre>

<p>Create <code>.github/workflows/deploy.yml</code>:</p>

<pre><code class="language-yaml">name: Deploy to AWS EC2

on:
  push:
    branches: [main]
  workflow_dispatch:    # also allow manual triggers

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build Next.js app
        run: npm run build
        env:
          # Pass any build-time env vars here
          NEXT_PUBLIC_GA_ID: \${{ secrets.NEXT_PUBLIC_GA_ID }}

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.EC2_HOST }}
          username: ubuntu
          key: \${{ secrets.EC2_PRIVATE_KEY }}
          script: |
            cd /var/www/nextjs-app

            # Pull latest code
            git pull origin main

            # Install dependencies (production only)
            npm ci --omit=dev

            # Build the app on the server
            npm run build

            # Restart with PM2 (zero-downtime reload)
            pm2 reload nextjs-app --update-env

            echo "Deploy complete at $(date)"
</code></pre>

<h2>Step 4: Set Up GitHub Secrets</h2>

<p>In your GitHub repository, go to Settings → Secrets and variables → Actions, and add these three secrets:</p>

<table>
<thead>
<tr>
<th>Secret Name</th>
<th>Value</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>EC2_HOST</code></td>
<td>Your EC2 instance's public IP address or domain</td>
</tr>
<tr>
<td><code>EC2_PRIVATE_KEY</code></td>
<td>The full contents of your <code>.pem</code> file (including the BEGIN/END lines)</td>
</tr>
<tr>
<td><code>NEXT_PUBLIC_GA_ID</code></td>
<td>Your Google Analytics measurement ID (or any other public env vars)</td>
</tr>
</tbody>
</table>

<p>For the private key, open the .pem file in a text editor, copy everything including <code>-----BEGIN RSA PRIVATE KEY-----</code> and <code>-----END RSA PRIVATE KEY-----</code>, and paste it as the secret value.</p>

<h2>Step 5: First Deploy and PM2 Setup</h2>

<p>Before the GitHub Action can work, you need to get the app running on the server for the first time:</p>

<pre><code class="language-bash"># Clone your repo to the server
sudo mkdir -p /var/www/nextjs-app
sudo chown ubuntu:ubuntu /var/www/nextjs-app
cd /var/www/nextjs-app
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .

# Create .env file on the server
nano .env
# Add your production environment variables here

# Install dependencies and build
npm ci
npm run build

# Start with PM2
pm2 start npm --name "nextjs-app" -- start
pm2 save                  # persist across server restarts
pm2 startup               # generate startup script
# PM2 will output a command to run — run it

# Verify the app is running
pm2 status
curl http://localhost:3000  # should return HTML
</code></pre>

<h2>Step 6: CloudFront CDN (Optional but Recommended)</h2>

<p>CloudFront puts your app behind a global CDN, which means static assets load from an edge location near your users instead of your EC2 server. For most apps, this makes a meaningful difference in load times outside your server's region.</p>

<p>In the AWS Console, go to CloudFront and create a new distribution:</p>

<ul>
<li><strong>Origin domain:</strong> Your EC2 public IP or domain (not localhost)</li>
<li><strong>Origin protocol policy:</strong> HTTP only (Nginx handles the connection to EC2)</li>
<li><strong>Viewer protocol policy:</strong> Redirect HTTP to HTTPS</li>
<li><strong>Cache policy for <code>/_next/static/*</code>:</strong> <code>CachingOptimized</code> — these files are content-addressed, so they can be cached for years</li>
<li><strong>Cache policy for <code>/*</code> (HTML pages):</strong> <code>CachingDisabled</code> — Next.js handles its own cache headers; CloudFront should pass them through</li>
</ul>

<p>If you have a domain, attach it to the CloudFront distribution and request an ACM (AWS Certificate Manager) certificate for free SSL. DNS validation takes about 15 minutes.</p>

<h2>Watch: Next.js CI/CD to AWS EC2 with GitHub Actions</h2>

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:2rem 0"><iframe src="https://www.youtube.com/embed/5q9ZyH1OCvI" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allowfullscreen></iframe></div>

<h2>Common Pitfalls</h2>

<h3>1. Building on the server vs. building in CI</h3>

<p>The workflow above builds in the GitHub Action AND on the server. That's redundant — you only need to do it in one place. For small apps, building on the server is fine (simpler). For larger teams, build in CI, upload the artifact, and skip the build step on the server. The tradeoff: artifacts can be large (100MB+), so you need S3 or similar to store them.</p>

<h3>2. Forgetting to set <code>NODE_ENV=production</code></h3>

<p>When you run <code>npm start</code> (which runs <code>next start</code>), Next.js automatically sets <code>NODE_ENV=production</code>. But PM2 doesn't always inherit this. Be explicit in your PM2 config or startup command:</p>

<pre><code class="language-bash">pm2 start npm --name "nextjs-app" -- start -- --NODE_ENV=production
</code></pre>

<h3>3. Not configuring PM2 to restart on crash</h3>

<p>By default PM2 restarts crashed processes, but you want to limit restarts to prevent crash loops. Add <code>--max-restarts 10</code> and <code>--min-uptime 5000</code> to your pm2 start command. Five seconds of uptime before a restart counts is usually enough to catch truly broken deployments.</p>

<h3>4. SSH key permissions</h3>

<p>The most common SSH error you'll hit is <code>UNPROTECTED PRIVATE KEY FILE</code>. GitHub Actions handles this correctly when you use <code>appleboy/ssh-action</code>, but if you're doing raw SSH commands, your .pem file needs <code>chmod 400 your-key.pem</code> — readable only by the owner, nothing else.</p>

<h2>EC2 vs. Vercel vs. AWS Amplify — Which Should You Choose?</h2>

<table>
<thead>
<tr>
<th>Factor</th>
<th>EC2 + CloudFront</th>
<th>Vercel</th>
<th>AWS Amplify</th>
</tr>
</thead>
<tbody>
<tr>
<td>Setup time</td>
<td>90 min (first time)</td>
<td>5 min</td>
<td>20 min</td>
</tr>
<tr>
<td>Next.js feature support</td>
<td>Full (you control the runtime)</td>
<td>Full (built for Next.js)</td>
<td>Most features, some lag</td>
</tr>
<tr>
<td>Cost at low traffic</td>
<td>~$5/month (t3.micro)</td>
<td>Free tier, then $20+/month</td>
<td>Pay per build + hosting</td>
</tr>
<tr>
<td>Cost at high traffic</td>
<td>Predictable (fixed instance)</td>
<td>Can get expensive fast</td>
<td>Moderate</td>
</tr>
<tr>
<td>Infrastructure control</td>
<td>Full — you own everything</td>
<td>None — Vercel manages it</td>
<td>Partial</td>
</tr>
<tr>
<td>Learning value</td>
<td>High — enterprise-transferable</td>
<td>Low (it just works)</td>
<td>Medium</td>
</tr>
<tr>
<td>Best for</td>
<td>Learning, compliance, cost control</td>
<td>Speed, simplicity, teams</td>
<td>Existing AWS customers</td>
</tr>
</tbody>
</table>

<h2>TL;DR</h2>

<ul>
<li><strong>The stack:</strong> EC2 (compute) + Nginx (reverse proxy) + PM2 (process manager) + CloudFront (CDN) + GitHub Actions (CI/CD). Each layer has one job.</li>
<li><strong>GitHub Actions workflow:</strong> trigger on push to main → install → lint → build → SSH into EC2 → <code>git pull</code> → rebuild → <code>pm2 reload</code>. About 25 lines of YAML.</li>
<li><strong>Store secrets properly:</strong> EC2 host, private key, and env vars go in GitHub repository secrets — never hardcoded in workflow files.</li>
<li><strong>PM2 is essential</strong> for production Node.js — it keeps the process alive, restarts on crash, and enables zero-downtime reloads. Run <code>pm2 startup</code> to make it persist across server reboots.</li>
<li><strong>CloudFront is optional but worth it</strong> — static assets cached at the edge make a real difference for users outside your server's region, and the free ACM SSL certificate saves you the hassle of Certbot configuration.</li>
</ul>
`;

const cookie = await authenticate(BASE_URL, EMAIL, PASSWORD);

const result = await createPost(BASE_URL, cookie, {
  title: "Deploying a Next.js App to AWS with CI/CD Pipelines (Step-by-Step)",
  slug,
  excerpt:
    "A complete guide to deploying a Next.js application to AWS using GitHub Actions CI/CD pipelines. Covers EC2, Nginx, PM2, CloudFront, and automated deployments — every step explained.",
  coverImage:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop&auto=format",
  tags: ["Next.js", "AWS", "CI/CD", "DevOps", "Deployment"],
  body_html,
  status: "published",
  seo: {
    metaTitle:
      "Deploying Next.js to AWS with CI/CD Pipelines (Step-by-Step Guide)",
    metaDescription:
      "A complete guide to deploying a Next.js application to AWS using GitHub Actions CI/CD pipelines. Covers EC2, S3, CloudFront, and automated deployments.",
    canonicalUrl: `https://theharshdeepsingh.com/blog/${slug}`,
  },
});

if (result === null) {
  console.log(`⚠️  Already seeded — slug exists (${slug}). Skipping.`);
} else {
  console.log(`✅ Published: "${result.title}"`);
  console.log(`   Slug:      ${result.slug}`);
  console.log(`   URL:       https://theharshdeepsingh.com/blog/${result.slug}`);
}
