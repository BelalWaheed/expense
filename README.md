# ☕ SpendWise — Personal Expense Tracker

A sleek, offline-first expense tracker built with modern web technologies. All data stays on your device — no accounts, no servers, no tracking.

> **[Live Demo →](#)** _(deploy to Vercel and paste your link here)_

---

## ✨ Features

- **📊 Dashboard** — Monthly budget progress bar, category donut chart, daily spending line chart, and a recent expenses feed
- **➕ Add Expense** — Quick form with amount, category (7 types), optional note, and date picker
- **📋 Expense List** — Browse all expenses with filters by category and date range
- **⚙️ Settings** — Set monthly budget limits, export data as JSON, and import backups
- **💾 Persistent Storage** — Zustand + localStorage keeps your data safe across sessions
- **📱 PWA / Offline** — Installable on mobile, works without internet via service worker
- **🌗 Dark Mode** — Coffee-themed UI with warm browns and espresso tones
- **📱 Responsive** — Desktop sidebar + mobile bottom navigation

---

## 🛠️ Tech Stack

| Layer      | Technology                                                           |
| ---------- | -------------------------------------------------------------------- |
| Framework  | **Next.js 16.1** (App Router, Turbopack, TypeScript)                 |
| Styling    | **Tailwind CSS v4**                                                  |
| Components | **shadcn/ui** (Card, Button, Input, Select, Badge, Progress, Dialog) |
| Charts     | **Recharts**                                                         |
| State      | **Zustand 5** with `persist` middleware (localStorage)               |
| Dates      | **date-fns v4**                                                      |
| Icons      | **lucide-react**                                                     |
| PWA        | Manual service worker (network-first caching)                        |

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (dark mode, providers, PWA)
│   ├── page.tsx                # Dashboard
│   ├── expenses/
│   │   ├── page.tsx            # Expense list + filters
│   │   └── new/page.tsx        # Add expense form
│   └── settings/page.tsx       # Budget & data management
├── components/
│   ├── dashboard/              # BudgetProgress, CategoryDonut, DailySpendChart, RecentExpenses, StatsCards
│   ├── expenses/               # ExpenseFilters, ExpenseTable
│   ├── layout/                 # Sidebar, AppShell, StoreProvider, ServiceWorkerRegistration
│   └── ui/                     # shadcn/ui components
├── store/
│   └── expenseStore.ts         # Zustand store with all actions & selectors
├── types/
│   └── index.ts                # Category, Expense, MonthlyBudget types + CATEGORY_CONFIG
└── lib/
    └── utils.ts                # cn(), formatCurrency()
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+

### Install & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📦 Data Types

```ts
type Category =
  | "food"
  | "transport"
  | "housing"
  | "health"
  | "entertainment"
  | "shopping"
  | "other";

type Expense = {
  id: string;
  amount: number;
  category: Category;
  note?: string;
  date: string; // "YYYY-MM-DD"
  createdAt: string; // ISO string
};

type MonthlyBudget = {
  month: string; // "YYYY-MM"
  limit: number;
};
```

---

## 🗄️ Store API

| Method                    | Description                          |
| ------------------------- | ------------------------------------ |
| `addExpense(expense)`     | Add a new expense                    |
| `deleteExpense(id)`       | Remove an expense by ID              |
| `setBudget(month, limit)` | Set/update monthly budget            |
| `exportJSON()`            | Download all data as JSON            |
| `importJSON(jsonString)`  | Import & merge data from JSON backup |
| `getThisMonthExpenses()`  | Get current month's expenses         |
| `getThisMonthTotal()`     | Get current month's total spend      |
| `getThisMonthBudget()`    | Get current month's budget config    |
| `getByCategory(category)` | Filter expenses by category          |

---

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The app works offline after first visit — the service worker caches all routes and assets.

---

## 📄 License

MIT
