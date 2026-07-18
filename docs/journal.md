# AI Usage Journal

## Tool Used
Claude (Anthropic) — used throughout the project for guidance,
explanations, and code help.

## How I Used It

I didn't just ask Claude to write the whole project in one go.
I worked through it milestone by milestone — first understanding
what I needed to build, then asking for help with specific parts,
then actually writing the code myself and testing it.

Whenever something broke or I didn't understand why something
worked a certain way, I asked Claude to explain it before moving on.
That helped me actually learn rather than just copy.

---

## Prompts I Used (roughly, in my own words)

1. "Help me plan a task management app — what tables do I need,
   what API routes, what features should I include?"

2. "Explain how JWT authentication works and help me write the
   register and login endpoints with proper validation."

3. "How do I set up SQLite with better-sqlite3 in Node.js?
   What are foreign keys and why do I need them?"

4. "Help me write the task CRUD API — I want filtering by priority,
   search by title, and a stats endpoint for the dashboard."

5. "I want to build the frontend in React with Vite. Explain how
   the proxy setting in vite.config.js works and why I need it."

6. "Help me understand useState and useEffect before I write
   the React components."

7. "Write me a smoke test file that tests my API endpoints —
   explain each assertion so I understand what it's checking."

---

## Where AI Helped Me

**Understanding concepts I hadn't used before**
I hadn't worked with JWT authentication before. Claude explained
it in simple terms — the token is like a signed hall pass, the
server checks the signature on every request instead of storing
sessions. Once I understood that, writing the middleware made sense.

**Explaining why, not just what**
When I wrote the database schema, I didn't just copy the SQL —
I asked Claude why we need `CHECK` constraints, why foreign keys
need to be turned on manually in SQLite, and what indexes actually
do. That made me confident explaining it in my video walkthrough.

**Debugging errors I hadn't seen before**
When I got the `EBUSY` error on Windows during tests, I didn't
know what it meant. Claude explained that Windows locks files
differently from Linux/Mac and showed me how to fix it with a
small delay and try/catch. I understood the fix before applying it.

**Saving time on boilerplate**
Setting up Vite config, package.json, folder structure — these
are things that would have taken me hours of googling. Claude
helped me get the scaffold right quickly so I could focus on
the actual logic.

---

## Where I Had to Intervene Myself

**Actually running and testing everything**
Claude can write code but it can't run my server or test my
API. I had to do all of that myself — starting the backend,
opening Thunder Client, sending real requests, checking the
responses. That's where I caught most of the issues.

**The Windows file lock bug**
The test cleanup code Claude originally wrote worked fine on
Linux but crashed on Windows with an EBUSY error. I caught
this when I ran the tests myself, reported it, and we fixed
it together. That became its own commit.

**Understanding before moving on**
A few times Claude gave me code and I didn't fully understand
a part of it. I made myself stop and ask "explain this specific
line to me" before committing anything. I didn't want to submit
code I couldn't explain in a walkthrough.

**Deciding what not to build**
Claude kept suggesting extra features — drag and drop, team
sharing, email notifications. I had to make the call to cut
those and keep the scope manageable. That decision was mine.

---

## What I Learned About Working With AI

The biggest thing I learned is that AI is genuinely useful but
it doesn't replace understanding. A few times I tried to move
fast and just apply what Claude gave me without reading it
properly — and those were the times things broke and I had
no idea why.

The workflow that actually worked for me:
1. Read what Claude gives me fully before running it
2. Ask "why" questions about anything I don't understand
3. Test every single endpoint or component myself
4. Only commit after I can explain what the code does

AI made me faster. It didn't make me a developer who doesn't
need to understand their own code.

---

## Challenges I Faced

**Running two servers at the same time**
I didn't realise at first that the frontend (port 5173) and
backend (port 4000) are completely separate processes. I kept
opening localhost:4000 and seeing nothing, thinking something
was broken. Once I understood that the backend only responds
to /api/ routes and the frontend is what you actually open
in the browser, everything clicked.

**The blank page issue**
Early on my backend server.js had static file serving code
pointing at frontend/dist which didn't exist yet. This caused
a crash that showed as a blank page in the browser. Took me
a while to connect the error message in the terminal to the
blank page in the browser. Lesson: always read the terminal
errors first.

**Understanding React state flow**
Coming from a non-React background, props and state felt
confusing at first. Specifically why state lives in App.jsx
and gets passed down instead of each component managing its
own API calls. Claude explained it as "one source of truth" —
if two components both fetch tasks independently they can get
out of sync. Having one parent fetch and pass data down keeps
everything consistent.