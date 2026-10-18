# 🎓 Campus Helpdesk - Student & Staff Support Portal

A modern, responsive, production-ready React web application designed for university campuses to streamline the reporting, tracking, and management of campus-wide issues (IT & Wi-Fi, dormitories, classrooms, laboratories, facilities, tuition, and security).

Built directly within the existing Vite + React project without reinstallation, featuring persistent `localStorage` storage, real-time statistics, an administrative control center, and light/dark theme modes.

---

## 🌟 Key Features

### 1. 📝 Comprehensive Issue Submission Form
- **Student & Staff Information**: Full Name, Student/Employee ID, University Email, and Contact Phone.
- **Classification & Location**: Category picker, Priority level (`Low`, `Medium`, `High`, `Urgent`), Campus Building/Complex, and specific Room/Floor.
- **Detailed Problem Description**: Subject summary and detailed description with real-time field validation.
- **Simulated File Attachment**: Allows students to attach screenshots or error log references.
- **Intelligent Routing**: Automatically assigns incoming tickets to the appropriate campus department (e.g., IT Operations, Facilities, Hostel Office).
- **Instant Receipt & Confirmation**: Generates a unique Ticket ID (e.g., `TKT-2026-1049`) upon submission with one-click direct tracking.

### 2. 🔄 Complete Status Workflow
- **Three Core Statuses**:
  - ⏳ **`Pending`**: Default state upon report submission; awaiting initial review.
  - 🔄 **`In Progress`**: Dispatched to technicians or campus staff actively working on the resolution.
  - ✅ **`Resolved`**: Issue completed with recorded administrative resolution notes.
- **Interactive 3-Step Stepper**: Visual progress tracker inside the ticket details view.
- **Live Status Badges**: Distinct color-coded badges with contextual icons.

### 3. 🔍 Student Tracking & Browse Portal
- **Instant Search**: Look up any ticket by Ticket ID (`TKT-XXXX-XXXX`), keyword, reporter name, or location.
- **Filter Tabs**: Toggle between *All*, *Pending*, *In Progress*, and *Resolved* tickets.
- **Category Filter**: Filter issues by IT, Dormitory, Classrooms, Library, Facilities, etc.
- **Card Grid View**: Responsive card layout displaying critical metadata, timestamps, and quick action to inspect full details.

### 4. 📊 Admin Dashboard & Statistics
- **Real-Time KPI Cards**:
  - Total Tickets Count
  - Pending Review Count (Clickable quick-filter)
  - In Progress Count (Clickable quick-filter)
  - Resolved Count with automatic **Resolution Rate %**
  - Urgent & High Priority alert count
- **Visual Analytics Suite**:
  - **Status Pipeline Bar**: Proportional segmented bar visualizing Pending vs In Progress vs Resolved distributions.
  - **Priority Breakdown**: Visual indicators for Urgent, High, Medium, and Low tickets.
  - **Category Breakdown**: Ranked horizontal distribution of most-reported campus areas.
- **Management Table**:
  - Inline status switcher (`Pending` ➔ `In Progress` ➔ `Resolved`).
  - Department reassignment dropdown.
  - Multi-select checkboxes for **Bulk Actions** (Bulk Status Update, Bulk Deletion).
  - Multi-criteria filtering (Search query, Status, Category, Priority, and Sorting).
  - **CSV Data Export**: One-click download of all filtered records for audit and reporting.

### 5. 💾 LocalStorage Persistence & Demo Seed Reset
- All created, modified, or deleted tickets are persistently stored in browser `localStorage` (`campus_helpdesk_tickets_v1`).
- Pre-populated on first launch with realistic campus sample data (Wi-Fi disconnections, dorm plumbing leaks, portal 504 errors, lecture hall projector repairs).
- **Reset Demo Data**: Easily restore original sample tickets at any time with a single click.

### 6. 📱 Responsive & Accessible UI
- Fully responsive across mobile smartphones (320px+), tablets, laptops, and wide desktop displays.
- Native mobile navigation drawer.
- Built-in **Light & Dark Theme** toggle with stored preferences.
- Accessible contrast ratios, focus rings, and clean typography.

---

## 📁 Project Structure

```text
campus-helpdesk/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Icons and image assets
│   ├── components/             # Reusable modular UI components
│   │   ├── AdminDashboard.jsx  # Admin table, bulk actions, and management
│   │   ├── AnalyticsCharts.jsx # Visual pipeline and category progress bars
│   │   ├── Badges.jsx          # Status and Priority badge components
│   │   ├── Icons.jsx           # Crisp self-contained SVG icon collection
│   │   ├── IssueDetailModal.jsx# Full ticket modal with 3-step progress stepper
│   │   ├── IssueForm.jsx       # Student issue submission form with validation
│   │   ├── IssueTracker.jsx    # Student tracking & card browsing view
│   │   ├── Navbar.jsx          # Header with view switcher, theme toggle & badges
│   │   ├── StatsCards.jsx      # Top metric KPI cards
│   │   └── Toast.jsx           # Floating action feedback notifications
│   ├── constants/
│   │   └── issueData.js        # Categories, priorities, departments & seed data
│   ├── utils/
│   │   └── storage.js          # LocalStorage CRUD and ID generator helpers
│   ├── App.css                 # Comprehensive responsive component styles
│   ├── App.jsx                 # Main state coordinator & view router
│   ├── index.css               # Global CSS variables, reset, light/dark themes
│   └── main.jsx                # React application entry point
├── index.html                  # HTML template with meta tags and Inter font
├── package.json                # Project configuration and dependencies
├── vite.config.js              # Vite bundler configuration
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Running Locally

1. **Start the development server:**
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5173` (or the URL displayed in your terminal).

### Building for Production

Compile and bundle the project for production:
```bash
npm run build
```
The optimized output will be generated inside the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Running the Code Linter

Run ESLint to check for code quality and syntax standards:
```bash
npm run lint
```

---

## 🛠️ Technology Stack
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: Pure Modern CSS with CSS Variables, Flexbox, CSS Grid, and Dark/Light Modes
- **Icons**: Handcrafted lightweight SVG icons (Zero extra dependencies)
- **Data Persistence**: HTML5 `localStorage` API
