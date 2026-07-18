# Final Reflection

## What Went Well

**Breaking the project into small pieces**
Following the milestone structure from the planning doc made
the whole thing feel manageable. Instead of staring at a blank
folder thinking "I have to build a full app," I just focused
on one thing at a time — today I build the schema, tomorrow
I build auth. Each commit felt like a real step forward.

**Testing as I went**
After every major piece I tested it properly before moving on.
Register endpoint? I opened Thunder Client and actually sent
requests with valid and invalid data. React component? I ran
it in the browser and clicked every button. This caught several
issues early when they were easy to fix rather than later when
everything is connected and much harder to debug.

**Understanding before committing**
Early on I had a habit of applying code without fully reading
it. I changed that after getting stuck a few times on errors
I couldn't explain. After that I made a rule for myself —
if I can't explain what a piece of code does, I don't commit
it yet. That slowed me down a little but made me much more
confident during the walkthrough.

**The commit history**
Looking back at the git log, it actually tells the story of
how the project was built. Each commit is a real step, not
just "added stuff." That felt good to see come together.

---

## What Didn't Go Well

**The blank page issue at the start**
Early on I spent more time than I'd like to admit staring at
a blank browser page with no idea what was wrong. The error
was in the terminal the whole time — my server.js was pointing
at a frontend/dist folder that didn't exist yet. I learned to
always check the terminal first before panicking about what
I see (or don't see) in the browser.

**Running two servers confused me at first**
I didn't realise the frontend and backend are completely
separate processes running on different ports. I kept opening
localhost:4000 expecting to see the app and seeing nothing.
Once I understood that the backend only handles API requests
and the frontend is what you open in the browser, everything
made more sense. But it took a while to click.

**Windows file locking in tests**
When I ran the test suite I got an EBUSY error at the end —
Windows locks database files differently from Linux and the
cleanup code was trying to delete the test database before
SQLite had finished with it. The tests all passed but it
looked scary. Fixed it by adding a small delay and wrapping
the cleanup in try/catch blocks. Small thing but it reminded
me that development environments matter.

**Scope creep temptation**
A few times I got tempted to add extra features — drag and
drop on the board, email notifications, user profile editing.
I had to keep reminding myself that the assessment isn't
about the most feature-rich app. It's about clean process,
good commits, and understanding what you built. Cutting scope
deliberately is its own skill.

---

## How AI Influenced My Development

Using Claude changed how I work in a way I didn't expect.
I thought it would just be faster — type less, get more done.
And it is faster. But the bigger change was how it affected
my learning.

Before this project, when I got stuck I would google for
answers and usually find a Stack Overflow answer I'd copy
without fully understanding. With Claude I could ask "why
does this work this way" and get an actual explanation
tailored to what I was building. That's different.

The times AI helped most weren't when I asked it to write
code. They were when I asked it to explain something I
didn't understand — like why JWT is stateless, or what
`stopPropagation` does in a React event handler, or why
the Vite proxy is needed in development but not production.
Those explanations stuck because they were connected to
something I was actually building.

The times AI helped least were when I tried to move fast
and skipped understanding. I'd apply something, it would
break, and I had no idea why because I hadn't really read
what I was applying. The fix was always to slow down.

The honest summary: AI made me faster AND helped me learn
more, but only when I used it as a teacher, not just a
code generator.

---

## What I Would Improve With More Time

**Drag and drop on the Kanban board**
The current status buttons work fine but drag and drop
would feel more natural. The backend already supports it —
the PUT endpoint handles status changes — so it would only
be a frontend change.

**Better error handling on the frontend**
Right now if your token expires mid-session, the app just
stops working until you refresh. A proper solution would
detect the 401 response and automatically redirect to the
login screen.

**Deploy it properly**
I tested everything locally but didn't get to deploy to
a live URL. Next time I'd set up deployment from the start
so there's a real URL to show in the video walkthrough.

**Postgres instead of SQLite for production**
SQLite is perfect for this project size and was the right
choice for an assessment. But a real production app with
multiple users needs a proper database server. I'd use
Postgres with a migration tool like node-pg-migrate.

**Rate limiting on login**
Right now someone could try thousands of passwords on the
login endpoint with no limit. Adding rate limiting
(e.g. max 10 attempts per IP per minute) would be an
important security improvement.

---

## Key Learnings

**Read the terminal before anything else**
Every blank page, every unexpected behaviour — the reason
is almost always printed in the terminal. Check there first.

**Test every path, not just the happy path**
I got into the habit of testing what happens when things
go wrong — wrong password, empty title, someone else's
task ID. That's where the real bugs hide.

**Small commits beat large ones**
When something breaks and you have 50 changed files in
one commit, you have no idea what caused it. Small focused
commits make bugs easy to find and revert.

**Understanding beats speed**
The fastest I moved was when I fully understood what I was
building. The slowest I moved was when I tried to go fast
by skipping understanding. Every time.