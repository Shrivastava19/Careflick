# Careflick – Care Management Dashboard

A full-featured **React + TypeScript** Care Management Dashboard built as part of the Careflick Frontend Internship Assignment.

---

## 🚀 Live Demo

https://jocular-souffle-2ea272.netlify.app/

---

## 📦 Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type safety across the entire codebase |
| **React Hook Form** | Form state management & validation |
| **React Hot Toast** | Toast notification system |
| **Context API** | Global application state |
| **Custom CSS** | Fully responsive, handcrafted design |
| **JSONPlaceholder API** | Mock REST API for users |
| **Google Fonts (Inter + Plus Jakarta Sans)** | Typography |

---

## ✅ Features Implemented

### Users Tab
- ✅ Fetch users from `https://jsonplaceholder.typicode.com/users`
- ✅ Responsive card grid layout (adapts for mobile/desktop)
- ✅ Each card shows Name, Email, Phone
- ✅ **Debounced search** by Name or Email (300ms delay)
- ✅ **User Detail Modal** with full info: name, email, phone, address, company
- ✅ **Add User** form with validation
- ✅ **Edit User** form pre-populated with existing data
- ✅ **Delete User** with confirmation (removes linked forms too)
- ✅ "Submitted Care Forms" section inside user modal
- ✅ **Pagination** (6 users per page)
- ✅ Stats bar (total users, forms submitted, search results)
- ✅ Loading spinner and error state with retry

### Care Forms Tab
- ✅ **Comprehensive Health Assessment Form** (from PDF)
  - Vital Signs table (temperature, BP, heart rate, O2, respiratory rate)
  - Symptoms checkboxes
  - Caregiver notes & signature
  - Daily activities (Morning/Afternoon/Evening)
  - Meal tracking with notes
- ✅ **Incident Report Form** (from PDF)
  - Incident types (Fall, Medication Error, Injury, Behavioral Issue, Other)
  - Incident description with minimum-length validation
  - Actions taken checkboxes
  - Follow-up notes
- ✅ User selector on each form
- ✅ Form validation (required fields, email format, phone format)
- ✅ After submission → linked to selected user → appears in their modal

### Bonus Features
- ✅ Debounced search
- ✅ Custom React hooks (`useUsers`, `useDebounce`, `usePagination`)
- ✅ Toast notifications (success/error)
- ✅ Pagination for users
- ✅ Polished UI/UX with hover states, transitions, color-coded badges

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── Users/
│   │   └── UsersTab.tsx          # Users tab with cards, search, pagination
│   ├── CareForms/
│   │   ├── CareFormsTab.tsx      # Form selector & active form switcher
│   │   ├── HealthAssessmentForm.tsx  # Health Assessment PDF → web form
│   │   └── IncidentReportForm.tsx    # Incident Report PDF → web form
│   └── shared/
│       ├── Icons.tsx             # SVG icon components
│       ├── UserDetailModal.tsx   # Full user details + submitted forms
│       └── UserFormModal.tsx     # Add / Edit user modal
├── context/
│   └── AppContext.tsx            # Global state (users, forms, CRUD)
├── hooks/
│   └── index.ts                  # useUsers, useDebounce, usePagination
├── types/
│   └── index.ts                  # TypeScript interfaces & types
├── App.tsx                       # Root component + tab navigation
├── index.tsx                     # React DOM entry point
└── index.css                     # Complete responsive stylesheet
```

---

## ⚙️ Setup & Running Locally

### Prerequisites
- Node.js >= 16
- npm >= 8

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd careflick-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app opens at **http://localhost:3000**.

### Build for Production

```bash
npm run build
```

Outputs to `build/` — ready to deploy.

---


## 🎨 Design Decisions

- **Color palette**: Deep blue (#0f4c81) primary + teal (#0d9488) accent — clinical yet modern
- **Typography**: Plus Jakarta Sans for headings (authoritative), Inter for body (readable)
- **Cards**: Gradient top-border on hover to guide attention
- **State**: Context API chosen for simplicity at this scale — no Redux needed
- **Forms**: React Hook Form for performance (uncontrolled inputs, minimal re-renders)

---

## 📝 Git Commit Convention

```
feat: implement user search with debounce
feat: add health assessment form
feat: add incident report form
feat: implement pagination for users
fix: resolve modal close on overlay click
fix: form reset after successful submission
chore: add vercel.json for SPA routing
```

---

Built with ❤️ for Careflick Frontend Internship Assignment
