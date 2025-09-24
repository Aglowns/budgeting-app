# UNCP Student Budgeting Web App

A modern, responsive budgeting application designed for UNCP students to manage their finances effectively.

## 🎯 Features

- **Authentication**: Secure login/signup with UNCP email validation
- **Account Linking**: 4-step wizard to connect financial accounts (demo mode)
- **Dashboard**: Comprehensive financial overview with charts and statistics
- **Transaction Management**: Track, filter, and categorize all financial activity
- **Notes System**: Keep track of spending thoughts and financial reminders
- **Savings Goals**: Set and track progress towards financial targets
- **Settings**: Customize budgets, security preferences, and account settings

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom UNCP theme
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand with localStorage persistence
- **Routing**: React Router v6+
- **Forms**: React Hook Form with Zod validation
- **Mock Backend**: MSW (Mock Service Worker)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## 🎨 Design

- **Colors**: UNCP Braves theme (Maroon #990000, Gold #FFCC00)
- **Responsive**: Mobile-first design with desktop enhancements
- **Accessibility**: WCAG AA compliant
- **Modern**: Clean, professional interface with smooth animations

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## 📱 Usage

1. **Sign up** with a UNCP email address (@bravemail.uncp.edu)
2. **Complete the linking wizard** to set up demo accounts
3. **Explore the dashboard** to see your financial overview
4. **Manage transactions** and track spending by category
5. **Set savings goals** and monitor your progress
6. **Take notes** about your spending habits
7. **Adjust settings** to customize your experience

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

## 🔧 Development

**Linting**:
```bash
npm run lint
npm run lint:fix
```

**Formatting**:
```bash
npm run format
npm run format:check
```

**Build for production**:
```bash
npm run build
```

## 📊 Demo Data

The app includes realistic demo data:
- **Accounts**: Checking, Savings, and Credit Card
- **Transactions**: 12 weeks of sample financial activity
- **Categories**: Rent, Groceries, Dining, Transport, School/Books, etc.
- **Savings Goals**: Emergency Fund, Spring Break Trip, New Laptop
- **Notes**: Budget reminders and spending tips

## 🔒 Privacy & Security

- **Demo Mode**: All data is simulated for educational purposes
- **No Real Banking**: No actual financial institutions are connected
- **Local Storage**: Data persists locally in your browser
- **Privacy First**: No personal financial information is collected

## 🎓 Educational Purpose

This application is designed as a learning tool for UNCP students to:
- Practice budgeting skills
- Understand financial tracking
- Learn about savings goals
- Develop healthy spending habits

## 📝 License

This project is for educational use at UNC Pembroke.

---

**Go Braves! 🏹**