Brain Capture APP

PWA (Progressive Web App)
rychla a jednoducha aplikace pro zachycení myšlenek a plánování dne. Cílem je mít jedno místo, kam můžeš rychle zapsat své nápady a úkoly, které pak budou zpracovány AI agentem.

- zadam TASK ten se rozdeli do projektu a ulozi do DB
- rychle a prehledene pomoci 


1. Zachycení myšlenky



2. Jedno tlačítko → zpracování

Ty (1× denně):

otevřeš jednoduchou web appku (tvoje)

klikneš: “Process notes”


Agent 1: Parser
You take raw notes and convert them into structured tasks and projects.

Rules:
- split ideas into tasks
- group by project
- keep tasks small (max 1 hour)


Agent 2: Daily planner
Pick 3 most important tasks for today.
Add 1 learning task.
Keep it realistic.


2. Architektura

Next.js app (web + mobile)
↓
API (Node.js)
↓
SQLite / Postgres
↓
GitHub sync (markdown backup)
↓
OpenAI (AI agent)

8. Tech stack (pro tebe ideální)

Next.js (App Router)

Tailwind (rychlý UI)

Prisma (DB)

SQLite (start)

OpenAI API

GitHub API