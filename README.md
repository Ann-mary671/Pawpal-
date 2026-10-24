# 🐾 PawPals - Pet Adoption System

A full-stack **Pet Adoption Management System** built with **React**, **Redux Toolkit**, **Express**, and an **ANSI SQL RDBMS** (SQLite / MySQL / PostgreSQL compatible).

This project has been implemented directly aligned with your curriculum modules:

---

## 📚 Curriculum Alignment & Features

### **Module 1: UI Basics & Design Environments**
- **HTML5 & CSS3 Styling**: Semantic HTML elements and modern CSS variables.
- **Responsive Layout**: Designed with **Flexbox** and **CSS Grid** (`.grid-pets`, `.flex`, `.container`).
- **Style Guide & Color Palette**: Dedicated design tokens (`--primary`: Warm Orange `#f97316`, `--secondary`: Calm Teal `#0d9488`, neutral surface cards, and responsive viewports).
- **Mockup Design**: Clean hero showcase, filter badges, and responsive pet card components.

### **Module 2: Introduction to React & Core Fundamentals**
- **Environment**: Modern React build configured with Vite.
- **Components & JSX**: Modular tree of functional components (`Navbar`, `PetCard`, `Home`, etc.).
- **Functional vs Class Components**: Includes both!
  - Functional components with modern patterns.
  - Class component (`LiveAdoptionCounter.jsx`) featuring state initialization, `componentDidMount`, and `componentWillUnmount` timer cleanup.
- **Props**: Dynamic passing of pet data, callbacks, and configuration properties.

### **Module 3: Modern React Concepts & User Interaction**
- **Hooks**:
  - `useState`: Form fields, filter selections, and UI state.
  - `useEffect`: Asynchronous data fetching and route updates.
  - `useContext`: Global application context (`AppContext.jsx`) managing live favorites and notifications.
- **Event Handling**: Click handlers, favorite toggles, input change listeners.
- **Forms & Validation**: Fully controlled components (`AdoptForm.jsx`) with live validation for name, email format, phone digits, housing selection, and reason length.
- **Conditional Rendering**: Implements `if`, ternary operators (`? :`), and logical `&&` for loading indicators, empty search results, and status badges.

### **Module 4: Rendering, Styling & Navigation**
- **Lists and Keys**: Proper key assignment (`pet.id`, `app.id`) across cards and application lists to ensure optimal virtual DOM reconciliation.
- **Styling Architecture**: Global tokens, component-level layouts, and CSS transitions.
- **React Router (v7/v6)**:
  - `BrowserRouter`, `Routes`, and `Route` configuration in `App.jsx`.
  - Dynamic route parameters (`/pets/:id`, `/adopt/:id`).
  - Navigation via `<Link>` and programmatic redirection via `useNavigate()`.

### **Module 5: State Management, API Handling & Deployment**
- **Redux Toolkit**: Central store configured with `configureStore` and `createSlice` (`frontend/src/redux/store.js`).
- **Async Handling & Fetch API**: Async thunks (`fetchPets`) utilizing `async/await` and Promises to retrieve data from the backend.
- **Error Handling & Debugging**: Loading skeletons, friendly error alerts, and resilient fallback UI.
- **Deployment Ready**:
  - **Netlify / Vercel**: `npm run build` generates optimized static assets in `dist/`.
  - **Backend API**: Can be deployed to Render, Railway, or AWS EC2 / App Runner.

---

## 🗄️ Database Schema (SQL / RDBMS)

The database uses ANSI SQL standard syntax located in `backend/schema.sql`:
- **`categories`**: `id`, `name`, `description`
- **`pets`**: `id`, `name`, `category_id`, `breed`, `age`, `gender`, `size`, `description`, `image_url`, `health_status`, `adoption_fee`, `status`
- **`adoption_applications`**: `id`, `pet_id`, `applicant_name`, `applicant_email`, `applicant_phone`, `housing_type`, `has_yard`, `has_other_pets`, `reason_for_adoption`, `status`, `applied_at`

---

## 🚀 Getting Started

### 1. Start the Backend API & Database
```bash
cd backend
npm install
node server.js
```
The server will run at `http://localhost:5000`.

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the URL shown in your terminal (usually `http://localhost:5173`).

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck endpoint |
| `GET` | `/api/categories` | Retrieve all pet categories |
| `GET` | `/api/pets` | List all pets (supports `?category=...&search=...`) |
| `GET` | `/api/pets/:id` | Get individual pet profile |
| `POST` | `/api/adoptions` | Submit new adoption application |
| `GET` | `/api/adoptions` | List all submitted applications |
