You are building the **Student Budgeting Web App (UNCP)** front-end.  
Generate a complete, runnable project with the following requirements.  

## Tech stack
- Build tool: **Vite + React + TypeScript**
- UI: **Tailwind CSS**, **shadcn/ui**, **lucide-react** icons
- Animations: **Framer Motion**
- Charts: **Recharts**
- Dates: **date-fns**
- State: **Zustand** (persist to localStorage)
- Routing: **React Router v6+**
- Form: **react-hook-form + zod** (client validation)
- Mock backend: **MSW** (Mock Service Worker) with seeded demo data (no real banking)
- Testing: **Vitest + React Testing Library**
- Lint/format: **ESLint + Prettier**

## Branding & theme
- App name: **UNCP Student Budgeting**
- Colors inspired by UNCP Braves:  
  - Primary: #990000 (maroon)  
  - Secondary: #FFCC00 (gold)  
  - Neutral: #000000 (black), #111827 (gray-900), white  
- Clean, modern, responsive, accessible (WCAG AA).  

---

## App flow (routes)
1. **/login** – Login page
   - Title: "UNCP Student Budgeting App"
   - Inputs: Email (UNC Pembroke student email) + Password
   - Button: **Login**
   - Link: “Don’t have an account? Create one.”
   - Smooth Framer Motion animations
2. **/signup** – Signup page
   - Inputs: Full Name, UNCP Email, Password, Confirm Password
   - Button: **Create Account**
   - Link: “Already have an account? Log in.”
3. **/link** – Bank & card linking wizard (multi-step form)
   - Step 1: Personal details
   - Step 2: Bank details (routing #, account #, type)
   - Step 3: Card details (card #, expiry, CVC, masked + Luhn check)
   - Step 4: Review & confirm → seeds demo accounts & transactions
4. **/dashboard** – After linking
5. **/transactions**
6. **/notes**
7. **/savings**
8. **/settings**

- Guard routes:  
  - If not authenticated → redirect to **/login**  
  - If authenticated but not linked → redirect to **/link**  

---

## Pages & features

### Login & Signup
- AuthCard layout with Framer Motion slide/opacity animations
- Tailwind + shadcn/ui for inputs/buttons
- Validation with react-hook-form + zod

### Linking wizard (/link)
- 4 steps with progress bar
- Back/Next navigation
- Mock API: `POST /api/link` → returns demo accounts + 12 weeks of transactions
- On success → toast + redirect to **/dashboard**

### Dashboard (/dashboard)
- **Top stat cards**: Weekly Spend, Remaining Weekly Budget, Monthly Spend, Remaining Monthly Budget
- **Chart**: switch between daily/weekly/monthly/yearly spending (Recharts)
- **Category breakdown**: Pie/Bar chart
- **Recent transactions** list (latest 5)
- **Savings snapshot** (balance + goals progress)
- **Quick Notes** section (inline add + list last 3)

### Transactions (/transactions)
- Filter by date, category, account, amount, text search
- Table view + CSV export
- Add/Edit/Delete transaction (drawer/sheet form)
- Categories: Rent, Groceries, Dining, Transport, School/Books, Subscriptions, Health, Entertainment, Other
- Transfer support (checking ↔ savings)

### Notes (/notes)
- CRUD notes (title, content, tags, createdAt)
- Pin & search
- Used to track spending reasons

### Savings (/savings)
- **Savings vault** balance
- Toggle: **Lock Savings**  
  - If ON → any spend that touches savings is declined (toast shown)
- **Goals** list:
  - Fields: Name, targetAmount, currentAmount, deadline?, priority
  - Progress bars + completion %
  - Move money modal (transfer from checking to savings or allocate to goal)
- Monthly savings chart

### Settings (/settings)
- Profile (name, email, avatar)
- Budgets: Weekly & Monthly
- Manage categories
- Toggles: Lock savings, prevent card spends from dipping into savings
- Reset demo data

---

## Data models (TypeScript)
```ts
type ID = string;

type User = {
  id: ID;
  name: string;
  email: string;
  hasLinked: boolean;
  settings: {
    weeklyBudget: number;
    monthlyBudget: number;
    lockSavings: boolean;
    preventSavingsForCard: boolean;
    currency: 'USD';
  };
};

type AccountType = 'checking' | 'savings' | 'credit';
type Account = {
  id: ID;
  name: string;
  type: AccountType;
  last4?: string;
  balance: number;
  creditLimit?: number;
  availableCredit?: number;
};

type TxnType = 'debit' | 'credit' | 'transfer';
type Transaction = {
  id: ID;
  accountId: ID;
  type: TxnType;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
  notes?: string;
  transferToAccountId?: ID;
};

type Note = {
  id: ID;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  pinned?: boolean;
};

type SavingsGoal = {
  id: ID;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
};
