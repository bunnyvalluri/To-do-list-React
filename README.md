# 🚀 TaskFlow Pro — Premium Frontend To-Do List Application

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.x-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![LocalStorage](https://img.shields.io/badge/LocalStorage-100%25_Offline-10B981?style=for-the-badge&logo=google-chrome&logoColor=white)](#)

> **Master your day, one task at a time.**  
> A commercial-grade, ultra-responsive frontend productivity web application built with **React 18**, **Vite**, **Tailwind CSS v4**, and **Framer Motion**. Zero backend required.

---

## 🌟 Key Features

- ⚡ **Dynamic Subtasks Checklist**: Expand task cards to dynamically add, complete, and manage step-by-step subtask checklists with live ratio tracking (e.g. `2/3 Subtasks`).
- 🎯 **HTML5 Drag & Drop Reordering**: Reorder task priorities in real time by dragging and dropping task cards using intuitive grip handles.
- 📊 **Multi-View Workspace**: Switch effortlessly between **List View 📋**, **Kanban Board 📊** (drag columns), and **Grid Matrix 🔳**.
- 🏷️ **Custom Dynamic Categories**: Create new category tags on the fly (`+ Add Custom Category...`) which automatically generate dedicated filter pills (`#Category`).
- 🌗 **One-Click Light & Dark Theme**: Toggle cleanly between sleek Dark Mode 🌙 and high-contrast Light Mode ☀️.
- 📈 **Productivity Analytics & Streak**: Real-time progress dashboard featuring completion progress bars, productivity scores (0-100), active daily streak counters, and celebratory confetti animations upon finishing tasks.
- 🔍 **Live Search & Term Highlighting**: Real-time search filtering with live text highlighting across task titles, subtasks, and categories.
- ⌨️ **Power User Keyboard Shortcuts**: Quick actions for inline editing (`Enter` / `Esc`), bulk deletion (`Delete`), and keyboard shortcuts guide modal.
- 💾 **Data Persistence & Backups**: 100% client-side data retention via `LocalStorage`. Export and import JSON backups with one click.
- 📱 **100% Fluid Responsive Design**: Tailored layout for mobile viewports (320px–425px), phablets, tablets, laptops, and 4K ultra-wide monitors.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Core Framework** | React 18 (JavaScript) |
| **Build Tool & Server** | Vite 6 |
| **Styling System** | Tailwind CSS v4 & Vanilla CSS Variables |
| **Animations** | Framer Motion 11 |
| **Icon Library** | React Icons (`fi`, `bs`) |
| **Celebration Effects** | Canvas Confetti |
| **Date Utility** | date-fns |
| **Analytics Charts** | Recharts |
| **Data Storage** | Browser `LocalStorage` (No backend required) |

---

## 📂 Folder Structure

```
src/
├── assets/                  # Static assets & SVG icons
├── components/
│   ├── layout/              # Sidebar, Header, Footer
│   ├── dashboard/           # HeroDashboard, PomodoroWidget
│   ├── tasks/               # TaskCard, TaskList, KanbanView, CalendarView, GridView, TaskCreationModal
│   ├── analytics/           # AnalyticsDashboard & Recharts components
│   ├── common/              # CommandPalette, DeleteModal, KeyboardShortcutsModal, ToastSnackbar
│   ├── ui/                  # ViewToggle, StatWidget, Badges
│   ├── Header.jsx           # Single-page header component
│   ├── Statistics.jsx       # Productivity metrics cards
│   ├── SearchBar.jsx        # Live search bar
│   ├── TaskInput.jsx        # Quick task creator
│   ├── FilterTabs.jsx       # Dynamic category & status filter tabs
│   ├── BulkActions.jsx      # Multi-select bulk control bar & View Switcher
│   ├── TaskCard.jsx         # Card view with subtasks & touch toolbar
│   └── Footer.jsx           # Footer with developer portfolio link
├── hooks/
│   ├── useLocalStorage.js   # Persistent storage hook
│   ├── useTheme.js          # Light/Dark mode state
│   ├── useTasks.js          # Central task CRUD & streak math
│   ├── usePomodoro.js       # Focus timer hook
│   └── useCommandPalette.js # Ctrl+K shortcut hook
├── utils/
│   ├── helpers.js           # Date math, confetti, JSON export/import
│   └── validation.js        # Input validation rules
├── App.jsx                  # Main application shell
└── main.jsx                 # Vite React entry point
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v16.0 or higher) and **npm** installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bunnyvalluri/To-do-list-React.git
   cd To-do-list-React
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your web browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| **`Enter` ↵** | Add new task / Save task edit |
| **`Ctrl + Enter`** | Save inline edit |
| **`Escape`** | Cancel inline edit |
| **`Delete`** | Delete all currently selected tasks |
| **`Shift + Drag`** | Drag grip handle to reorder task list |

---

## 👤 Author & Credits

Designed and developed with ❤️ by **VALLURI RAHUL**.

- **Portfolio**: [https://valluri-rahul-portfolio.vercel.app/](https://valluri-rahul-portfolio.vercel.app/)
- **GitHub Repository**: [https://github.com/bunnyvalluri/To-do-list-React.git](https://github.com/bunnyvalluri/To-do-list-React.git)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
