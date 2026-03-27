# Brain Capture

A simple personal task system focused on capturing thoughts and turning them into tasks organized by projects.

**The goal is clarity, speed, and visual progress, not complex productivity features.**

This tool is designed primarily for one user and optimized for **mobile-first** usage, so tasks can be captured anywhere.

---

## Core Idea

Brain Capture is a minimal system to manage thoughts and tasks.

The workflow is simple:

1. Create projects
2. Capture tasks/notes
3. Organize tasks under projects
4. Select tasks to work on today
5. Complete them and see progress

**No reminders, no automation, no complexity.**

Just **capture → organize → execute → finish**.

---

## Key Concepts

### Projects

Projects are the main way to organize work.

Each project has:

- **name**
- **color**
- **editable title**
- **list of tasks**

Projects should be visually recognizable by color and easy to reorganize.

### Tasks

Tasks represent thoughts, ideas, or work items.

Each task has:

- **name**
- **optional description**
- **project assignment**
- **completion state**

Tasks can be moved between projects easily to allow flexible organization.

### Today

Tasks from different projects can be scheduled for **Today**.

This creates a simple daily execution list.

**Workflow:**

1. User selects a task
2. Clicks **Play**
3. Task appears in **Today**

When completed, the task is marked as done.

This creates a visible sense of progress.

---

## Design Principles

The application must be:

- ⚡ Fast to capture thoughts
- 🎯 Very simple to understand
- 🔄 Easy to reorganize tasks
- 🎨 Visually clear with project colors
- 📱 Mobile friendly

**No unnecessary complexity.**

---

## Tech Stack

### Frontend

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI**

### Code Quality

- **ESLint**
- **Prettier**
- **Husky**

### Backend / Data

- **Drizzle ORM**
- **PostgreSQL** (local Docker for development)

---

## First Version Scope

The first version should **only** include:

- ✅ Project creation
- ✅ Task creation
- ✅ Assign tasks to projects
- ✅ Move tasks between projects
- ✅ Schedule tasks for Today
- ✅ Mark tasks as done

_Everything else can come later._