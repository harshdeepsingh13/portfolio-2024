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

// ---------------------------------------------------------------------------
// Article body HTML
// ---------------------------------------------------------------------------

const body_html = `
<p>You open a new React project, add TypeScript, and immediately hit Stack Overflow for how to type your first prop. The first answer says use <code>interface</code>. The second says <code>type</code>. The third is a six-paragraph thread about why one is semantically superior to the other. You close the tab and just write <code>any</code> to get on with your life.</p>

<p>Sound familiar? TypeScript in React has a reputation problem. Not because it's hard — it's genuinely great once it clicks — but because the community has generated a staggering volume of contradictory, context-free advice. Every dev tool tutorial starts with TypeScript. Every linting config bans <code>any</code>. Every PR reviewer has a hot take on generics.</p>

<p>This guide cuts through that. I'm not going to cover every TypeScript feature or every React pattern. What I'm going to do is share the specific conventions I use in production React + TypeScript apps in 2025 — the things that have made codebases genuinely easier to work in, not just theoretically safer.</p>

<h2>What this guide is NOT</h2>

<p>Before we get into it, let me set expectations clearly:</p>

<ul>
  <li><strong>Not a TypeScript basics tutorial.</strong> I'm assuming you know what a type is, what an interface is, and that <code>string !== String</code>.</li>
  <li><strong>Not exhaustive.</strong> TypeScript has dozens of utility types, conditional types, template literal types, and more. I'm not covering all of them — just the ones I reach for constantly.</li>
  <li><strong>Not framework-neutral.</strong> This is specifically about TypeScript in React apps. Some of these patterns won't apply to a Node.js CLI or a library.</li>
  <li><strong>Not about configuration.</strong> Strict mode settings, tsconfig targets, module resolution — another article for another day.</li>
</ul>

<p>What this guide IS is opinionated. I'm going to tell you what I think the right call is in most situations, and why. You'll disagree with some of it. That's fine.</p>

<h2>Typing Props the Right Way</h2>

<p>Let's start here because it's where every React + TypeScript journey begins, and where a lot of the confusion lives.</p>

<h3>Interface vs. Type Alias</h3>

<p>Here's my rule: <strong>use <code>interface</code> for component props, <code>type</code> for everything else</strong>.</p>

<p>Why? Interfaces have declaration merging, which can occasionally bite you in unexpected ways, but they also produce cleaner error messages and feel more natural for describing object shapes. They're also what the React community defaults to, so your code will look familiar to anyone joining your team.</p>

<pre><code class="language-typescript">// Good — interface for component props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}

// Good — type alias for unions and computed shapes
type ButtonVariant = "primary" | "secondary" | "ghost";
type Theme = "light" | "dark";
</code></pre>

<p>You'll see guides that say "always use <code>type</code>" or "always use <code>interface</code>." Honestly? Consistency matters more than which one you pick. Pick a rule and stick to it across your codebase.</p>

<h3>Required vs. Optional Props</h3>

<p>Default to required. Make something optional only when it genuinely has a sensible default or when it's truly not needed in many use cases.</p>

<p>This is the inverse of what a lot of developers do. They add <code>?</code> to everything to make TypeScript stop complaining, and then their components have fifteen optional props where most of them are actually always passed. That erases the value of having types at all.</p>

<pre><code class="language-typescript">// Bad — over-optionalized
interface CardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  href?: string;
}

// Good — be explicit about what's truly optional
interface CardProps {
  title: string;
  description: string;
  imageUrl?: string; // genuinely optional — card can work without an image
  href?: string;    // optional — sometimes cards aren't clickable
}
</code></pre>

<h3>Extending HTML Element Props</h3>

<p>This is one of the most useful patterns in React + TypeScript, and it's underused. When you're building a component that wraps an HTML element, extend that element's props so your component accepts all the native attributes automatically.</p>

<pre><code class="language-typescript">// Without this pattern — you have to manually add every HTML attribute
interface ButtonProps {
  label: string;
  onClick: () => void;
  // what about type="submit"? aria-label? data-testid? className?
  // you'll spend forever adding these one by one
}

// With this pattern — extend React's built-in types
interface ButtonProps extends React.ButtonHTMLAttributes&lt;HTMLButtonElement&gt; {
  label: string;
  variant?: "primary" | "secondary";
  // ...and you automatically get onClick, type, aria-*, data-*, className, etc.
}

const Button = ({ label, variant = "primary", ...rest }: ButtonProps) =&gt; {
  return (
    &lt;button className={\`btn btn-${variant}\`} {...rest}&gt;
      {label}
    &lt;/button&gt;
  );
};
</code></pre>

<p>The <code>...rest</code> spread pattern combined with extended HTML props is one of those things that once you start using, you can't go back. Your components become instantly more composable and you stop maintaining a manual list of passthrough props.</p>

<h2>Custom Hooks with TypeScript</h2>

<p>Custom hooks are where TypeScript really earns its keep, because hooks often manage complex state and return multiple values. If your hook's return type is just inferred as <code>any[]</code>, you've lost all the benefit.</p>

<h3>Typing Return Values Explicitly</h3>

<p>Always define the return type of custom hooks explicitly. Don't rely on inference here — it breaks down the moment your hook has multiple return paths or conditional logic.</p>

<pre><code class="language-typescript">// Bad — inferred return type is unreliable
function useUser(id: string) {
  const [user, setUser] = useState(null); // typed as null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ...fetch logic

  return { user, loading, error }; // TypeScript infers this poorly
}

// Good — define the return interface explicitly
interface User {
  id: string;
  name: string;
  email: string;
}

interface UseUserResult {
  user: User | null;
  loading: boolean;
  error: string | null;
}

function useUser(id: string): UseUserResult {
  const [user, setUser] = useState&lt;User | null&gt;(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState&lt;string | null&gt;(null);

  // ...fetch logic

  return { user, loading, error };
}
</code></pre>

<p>Now when you destructure this hook in a component, every field is typed correctly, and you get autocomplete without having to remember what the hook returns.</p>

<h3>Generics for Reusable Hooks</h3>

<p>Okay so here's where hooks get really powerful. If you're building a reusable data-fetching hook, generics let you make it work with any shape of data without losing type safety.</p>

<pre><code class="language-typescript">interface FetchResult&lt;T&gt; {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch&lt;T&gt;(url: string): FetchResult&lt;T&gt; {
  const [data, setData] = useState&lt;T | null&gt;(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState&lt;string | null&gt;(null);

  useEffect(() =&gt; {
    let cancelled = false;

    fetch(url)
      .then((res) =&gt; {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json() as Promise&lt;T&gt;;
      })
      .then((d) =&gt; {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((err: Error) =&gt; {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () =&gt; { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage — TypeScript knows exactly what data is
const { data, loading, error } = useFetch&lt;User&gt;("/api/user/123");
// data is typed as User | null — not unknown, not any
</code></pre>

<p>The <code>T</code> propagates through the entire hook. That's the magic. You call <code>useFetch&lt;User&gt;</code> once at the call site, and TypeScript figures out the rest.</p>

<h2>Generic Components</h2>

<p>Generics in components are the thing that trips up most mid-level React developers. They look intimidating. They have funny angle-bracket syntax. But once you understand when to reach for them, they save you from maintaining three slightly-different versions of the same component.</p>

<h3>When to Use Generic Components</h3>

<p>Reach for generics when your component works with data of a variable shape, but still needs to be type-safe. A list component, a select dropdown, a data table — these are classic candidates.</p>

<pre><code class="language-typescript">// Without generics — you end up with separate UserList, ProjectList, etc.
// or you use any[] and lose type safety

// With generics — one component that works for any data shape
interface ListProps&lt;T&gt; {
  items: T[];
  renderItem: (item: T, index: number) =&gt; React.ReactNode;
  keyExtractor: (item: T) =&gt; string;
  emptyMessage?: string;
}

function List&lt;T&gt;({ items, renderItem, keyExtractor, emptyMessage = "No items" }: ListProps&lt;T&gt;) {
  if (items.length === 0) {
    return &lt;p className="empty-state"&gt;{emptyMessage}&lt;/p&gt;;
  }

  return (
    &lt;ul&gt;
      {items.map((item, index) =&gt; (
        &lt;li key={keyExtractor(item)}&gt;
          {renderItem(item, index)}
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}

// Usage — TypeScript infers T from the items array
&lt;List
  items={users}
  keyExtractor={(u) =&gt; u.id}  // TypeScript knows u is a User
  renderItem={(u) =&gt; &lt;UserCard user={u} /&gt;}
/&gt;
</code></pre>

<p>Notice that you don't even need to write <code>&lt;List&lt;User&gt;&gt;</code> at the call site — TypeScript infers <code>T = User</code> from the <code>items</code> prop. That's inference doing its job.</p>

<p>One thing to watch: in <code>.tsx</code> files, the compiler can confuse <code>&lt;T&gt;</code> with a JSX tag. If you get a parse error, either add a constraint (<code>&lt;T extends object&gt;</code>) or use a comma (<code>&lt;T,&gt;</code>) to disambiguate.</p>

<h2>Discriminated Unions for State</h2>

<p>Here's the thing that's changed how I think about React state more than anything else: replacing boolean flags with discriminated union types. This single pattern eliminates entire categories of bugs.</p>

<h3>The Boolean Flag Problem</h3>

<p>You've seen this component. You've written this component.</p>

<pre><code class="language-typescript">// The boolean flag trap
interface FormState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
  data?: SubmitResult;
}

// Nothing stops you from setting isLoading: true AND isSuccess: true simultaneously
// That's an impossible state — but TypeScript can't catch it
const state: FormState = {
  isLoading: true,
  isSuccess: true, // ← this should be impossible
  isError: false,
};
</code></pre>

<p>When you have three booleans representing what should be a single sequential state, you have 2³ = 8 possible combinations, but only 4 of them are actually valid. TypeScript can't protect you from the invalid ones.</p>

<h3>The Discriminated Union Fix</h3>

<pre><code class="language-typescript">// Model the actual states that can exist
type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: SubmitResult }
  | { status: "error"; errorMessage: string };

// Now the impossible states are literally unrepresentable
const state: FormState = { status: "idle" };

// And in your component, TypeScript narrows types automatically
function FormFeedback({ state }: { state: FormState }) {
  if (state.status === "loading") {
    return &lt;Spinner /&gt;;
  }

  if (state.status === "error") {
    // TypeScript knows state.errorMessage exists here
    return &lt;ErrorBanner message={state.errorMessage} /&gt;;
  }

  if (state.status === "success") {
    // TypeScript knows state.data exists here
    return &lt;SuccessBanner data={state.data} /&gt;;
  }

  return null; // idle
}
</code></pre>

<p>The key is the <code>status</code> discriminant property. When you narrow on <code>state.status === "error"</code>, TypeScript automatically knows which variant of the union you're in, and which other fields are available.</p>

<p>This pattern is especially powerful in data-fetching scenarios, form submission flows, and anywhere you have a multi-step process. Start reaching for it instead of <code>isLoading / isError / isSuccess</code> and your state management will become dramatically cleaner.</p>

<h2>Taming <code>any</code></h2>

<p>Let me be direct: <code>any</code> is a code smell, but it's not always your fault. Sometimes you're working with a library that has poor types, an API that returns unpredictable shapes, or legacy code you don't own. The goal isn't to never use <code>any</code> — it's to reach for better tools first.</p>

<h3>Use <code>unknown</code> Instead of <code>any</code> for External Data</h3>

<p><code>unknown</code> is the type-safe cousin of <code>any</code>. It says "I don't know what this is yet" instead of "pretend this is whatever I need it to be." You can't do anything with an <code>unknown</code> value without first narrowing it with a type guard.</p>

<pre><code class="language-typescript">// Bad — any lets you do anything, including wrong things
async function fetchData(url: string): Promise&lt;any&gt; {
  const res = await fetch(url);
  return res.json();
}

const data = await fetchData("/api/user");
data.doesNotExist.boom; // TypeScript is fine with this. Your app is not.

// Good — unknown forces you to validate before using
async function fetchData(url: string): Promise&lt;unknown&gt; {
  const res = await fetch(url);
  return res.json();
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    typeof (value as User).id === "string"
  );
}

const data = await fetchData("/api/user");
if (isUser(data)) {
  // TypeScript now knows data is User
  console.log(data.name);
}
</code></pre>

<h3>Type Guards Are Your Friends</h3>

<p>The <code>value is User</code> return type in the example above is a <strong>type guard</strong>. It's a function that tells TypeScript "if this returns true, the value is of type T in the branches that follow." This is how you move from <code>unknown</code> territory into properly typed territory without resorting to <code>any</code>.</p>

<pre><code class="language-typescript">// Reusable type guard pattern
function isNonNull&lt;T&gt;(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const items: (User | null)[] = [user1, null, user2, null];
const validUsers = items.filter(isNonNull); // typed as User[], not (User | null)[]
</code></pre>

<h3>When <code>never</code> Is the Right Answer</h3>

<p><code>never</code> is the type that can't exist. It's useful for exhaustiveness checks — making sure you've handled every case in a union.</p>

<pre><code class="language-typescript">type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape, size: number): number {
  switch (shape) {
    case "circle":
      return Math.PI * size * size;
    case "square":
      return size * size;
    case "triangle":
      return (size * size) / 2;
    default:
      // If you add "hexagon" to the Shape union and forget to handle it here,
      // TypeScript will throw a compile error on this line
      const _exhaustiveCheck: never = shape;
      throw new Error(\`Unhandled shape: \${_exhaustiveCheck}\`);
  }
}
</code></pre>

<p>This pattern scales beautifully with discriminated unions. Add a new status to your state type, and every switch statement that wasn't updated will fail at compile time. That's exactly the kind of safety net TypeScript is supposed to provide.</p>

<hr>

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:2rem 0"><iframe src="https://www.youtube.com/embed/TPACABQTHvM" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allowfullscreen></iframe></div>

<hr>

<h2>Before vs. After: TypeScript Patterns</h2>

<p>Here's a quick-reference table of the common before/after shifts. These are the six patterns I most often see in code review that a bit of TypeScript discipline cleans up immediately.</p>

<table>
  <thead>
    <tr>
      <th>Pattern</th>
      <th>Without TypeScript Discipline</th>
      <th>With TypeScript Discipline</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Prop typing</strong></td>
      <td><code>props: any</code> or no types at all</td>
      <td><code>interface ButtonProps extends React.ButtonHTMLAttributes&lt;HTMLButtonElement&gt;</code></td>
    </tr>
    <tr>
      <td><strong>Optional props</strong></td>
      <td>Everything is <code>?</code> to avoid errors</td>
      <td>Only truly optional fields are optional; defaults handled by destructuring</td>
    </tr>
    <tr>
      <td><strong>Loading/error state</strong></td>
      <td><code>isLoading: boolean, isError: boolean, isSuccess: boolean</code></td>
      <td>Discriminated union: <code>{ status: "idle" | "loading" | "success" | "error" }</code></td>
    </tr>
    <tr>
      <td><strong>External API data</strong></td>
      <td><code>const data: any = await fetch(...).then(r =&gt; r.json())</code></td>
      <td><code>const data: unknown</code> + type guard before use</td>
    </tr>
    <tr>
      <td><strong>Reusable list</strong></td>
      <td>Separate <code>UserList</code>, <code>ProjectList</code> components with duplicated logic</td>
      <td>One generic <code>List&lt;T&gt;</code> component with typed <code>renderItem</code> and <code>keyExtractor</code></td>
    </tr>
    <tr>
      <td><strong>Hook return type</strong></td>
      <td>Inferred — breaks on multiple return paths, confusing autocomplete</td>
      <td>Explicit <code>interface UseXxxResult { ... }</code> as the return type annotation</td>
    </tr>
  </tbody>
</table>

<h2>Module Structure for a TypeScript React Project</h2>

<p>Okay, one more thing worth getting right from the start: where files live. A consistent folder structure does more for long-term maintainability than almost any TypeScript pattern. Here's the structure I use and recommend for mid-to-large React + TypeScript apps in 2025.</p>

<pre>
src/
├── app/                    # Next.js App Router pages (or pages/ for older setup)
│   ├── layout.tsx
│   ├── page.tsx
│   └── blog/
│       └── [slug]/
│           └── page.tsx
│
├── components/             # Shared UI components
│   ├── Button/
│   │   ├── Button.tsx      # Component
│   │   ├── Button.types.ts # Interface / type exports
│   │   ├── Button.styles.ts# Styled components or CSS module
│   │   └── index.ts        # Re-export for clean imports
│   └── List/
│       └── ...
│
├── hooks/                  # Custom hooks
│   ├── useFetch.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
│
├── lib/                    # Utilities, helpers, non-UI logic
│   ├── api.ts              # Fetch wrappers
│   ├── formatters.ts       # Date, currency, string helpers
│   └── validators.ts       # Type guards and runtime validation
│
├── types/                  # Shared TypeScript types
│   ├── api.ts              # API response shapes
│   ├── models.ts           # Domain model interfaces (User, Post, etc.)
│   └── index.ts            # Re-exports
│
├── context/                # React context providers
│   └── ThemeContext.tsx
│
└── styles/                 # Global styles, theme tokens
    └── globals.css
</pre>

<p>A few rules I enforce in this structure:</p>

<ul>
  <li><strong>Co-locate component types.</strong> Each component folder has its own <code>.types.ts</code> file. Don't dump all types into a single global <code>types.ts</code> — that file becomes a graveyard.</li>
  <li><strong>The <code>types/</code> directory is for shared domain types only.</strong> API response shapes, database models, shared interfaces that more than one component needs. Not component-specific props.</li>
  <li><strong>Barrel files are useful but dangerous.</strong> An <code>index.ts</code> in each component folder is fine. A single barrel for your entire <code>components/</code> directory will cause circular dependency nightmares in larger apps.</li>
  <li><strong>Hooks go in <code>hooks/</code>, not co-located with components.</strong> This is a deliberate choice against the "co-locate everything" philosophy. In my experience, hooks get reused across features, and burying them inside a component folder makes them harder to find and share.</li>
</ul>

<h2>TL;DR</h2>

<ul>
  <li><strong>Use <code>interface</code> for component props, <code>type</code> for everything else</strong> — pick a rule and apply it consistently. Default to required props; only mark things optional when they genuinely are.</li>
  <li><strong>Extend HTML element props</strong> using <code>React.ButtonHTMLAttributes&lt;HTMLButtonElement&gt;</code> and friends — this gets you all native attributes for free and makes components composable with <code>...rest</code>.</li>
  <li><strong>Always annotate custom hook return types explicitly</strong> — define a <code>UseXxxResult</code> interface and return it. Don't trust inference when there's conditional logic involved.</li>
  <li><strong>Use discriminated unions instead of boolean flags</strong> for anything with multiple states — <code>{ status: "idle" | "loading" | "success" | "error" }</code> is safer, clearer, and catches impossible states at compile time.</li>
  <li><strong>Replace <code>any</code> with <code>unknown</code> at API boundaries</strong> — then validate with type guards before use. Save <code>never</code> for exhaustiveness checks in switch statements.</li>
  <li><strong>Structure your modules intentionally</strong> — co-locate component types, put shared domain types in <code>types/</code>, hooks in <code>hooks/</code>, and use barrel files per component folder (not globally).</li>
</ul>
`;

const slug = "react-typescript-best-practices-2025";

const cookie = await authenticate(BASE_URL, EMAIL, PASSWORD);

const result = await createPost(BASE_URL, cookie, {
  title: "React + TypeScript Best Practices in 2025: What Actually Matters",
  slug,
  excerpt:
    "The React + TypeScript patterns that actually improve your codebase in 2025. Skip the theory — these are the conventions I use in every production app.",
  coverImage:
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop&auto=format",
  tags: ["React", "TypeScript", "Frontend", "Best Practices"],
  body_html,
  status: "published",
  seo: {
    metaTitle: "React + TypeScript Best Practices in 2025 (What Actually Matters)",
    metaDescription:
      "The React + TypeScript patterns that actually improve your codebase in 2025. Skip the theory — these are the conventions I use in every production app.",
    ogImage:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop&auto=format",
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
