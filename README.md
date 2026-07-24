# 🧭 Voyage — AI Travel Planner

Voyage is a full-stack **MERN** web application that uses **Google Gemini AI**
to generate complete, personalized travel itineraries — day-wise plans,
hotel suggestions, tourist attractions, restaurants, budgets, transportation
guidance, packing checklists, and travel tips — based on a user's
destination, dates, budget, travelers, and interests.

Built as a B.Sc. Computer Science final-year project.

---

## ✨ Features

- **Authentication** — Register, login, logout, JWT-based sessions, bcrypt password hashing, editable profile.
- **Dashboard** — Welcome banner, recent trips grid, create/delete trips.
- **Create Trip Form** — Destination autocomplete (OpenStreetMap Nominatim), date range, budget, travelers, travel type, interest tags.
- **AI Travel Planner** — Google Gemini generates: trip summary, day-wise itinerary, hotels, attractions, restaurants, estimated budget, transportation, packing checklist, travel tips.
- **Maps** — Destination + attraction markers rendered with Leaflet on OpenStreetMap tiles (100% free, no API key required).
- **Trip History** — Every generated trip is saved to MongoDB and can be revisited, regenerated, or deleted.
- **Polished UI** — Tailwind CSS, responsive layout, modern cards, hero section, toast notifications, loading states, 404 page.

---

## 🛠 Tech Stack

| Layer          | Technology                                   |
|----------------|-----------------------------------------------|
| Frontend       | React.js (Vite), Tailwind CSS, React Router   |
| State          | React Context API                             |
| HTTP Client    | Axios                                         |
| Backend        | Node.js, Express.js                           |
| Database       | MongoDB Atlas + Mongoose                      |
| Auth           | JWT + bcrypt.js                               |
| AI             | Google Gemini API (`@google/generative-ai`)   |
| Maps           | OpenStreetMap + Leaflet + Nominatim (geocoding)|
| Notifications  | react-hot-toast                               |

---

## 📁 Project Structure

```
AI-Travel-Planner/
│
├── client/                    # React (Vite) frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/            # Images, static assets
│   │   ├── components/        # Reusable UI components (Navbar, TripCard, MapView...)
│   │   ├── pages/              # Route-level pages (Home, Login, Dashboard...)
│   │   ├── layouts/            # MainLayout (Navbar + Footer wrapper)
│   │   ├── hooks/               # useDebounce, usePlaceAutocomplete
│   │   ├── context/             # AuthContext, TripContext
│   │   ├── services/            # axiosInstance + API service modules
│   │   ├── routes/              # ProtectedRoute
│   │   ├── utils/                # formatters, validators
│   │   ├── constants/            # travelOptions
│   │   ├── styles/               # variables.css (design tokens)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   └── package.json
│
├── server/                    # Node/Express backend
│   ├── config/                 # db.js, gemini.js
│   ├── controllers/            # authController, tripController, aiController
│   ├── middleware/             # authMiddleware, errorMiddleware, validateMiddleware
│   ├── models/                  # User.js, Trip.js
│   ├── routes/                  # authRoutes, tripRoutes, aiRoutes
│   ├── services/                 # geminiService.js
│   ├── prompts/                  # travelPrompt.js
│   ├── utils/                    # generateToken.js, apiResponse.js
│   ├── uploads/                  # (reserved for future file uploads)
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A free [Google Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone & Install

```bash
# Clone the project
git clone <your-repo-url>
cd AI-Travel-Planner

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**server/.env**

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/voyage?retryWrites=true&w=majority

JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

CLIENT_URL=http://localhost:5173
```

**client/.env**

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NOMINATIM_URL=https://nominatim.openstreetmap.org
```

> ⚠️ Never commit real `.env` values. The files above are safe *samples*.

### 3. Run the App

Open two terminals:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd client
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 🔌 API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint                    | Access  | Description                          |
|--------|------------------------------|---------|---------------------------------------|
| POST   | `/auth/register`             | Public  | Create a new account                  |
| POST   | `/auth/login`                 | Public  | Authenticate and receive a JWT        |
| POST   | `/auth/logout`                | Private | Logout (client clears token)          |
| GET    | `/auth/profile`               | Private | Get current user's profile            |
| PUT    | `/auth/profile`               | Private | Update current user's profile         |
| POST   | `/trips/create`               | Private | Create a trip + generate AI itinerary |
| GET    | `/trips`                      | Private | List all trips for the logged-in user |
| GET    | `/trips/:id`                  | Private | Get a single trip                     |
| DELETE | `/trips/:id`                  | Private | Delete a trip                         |
| POST   | `/trips/:id/regenerate`       | Private | Re-run AI generation for a trip       |
| POST   | `/ai/generate`                | Private | Generate a plan preview (not saved)   |

Private routes require an `Authorization: Bearer <token>` header.

---

## 🗄 Database Models

**User**
```
name        String   required
email       String   required, unique
password    String   required, hashed with bcrypt
avatar      String
phone       String
```

**Trip**
```
userId      ObjectId  ref: User
destination String    required
location    { lat, lng }
budget      Number    required
travelers   Number    required
startDate   Date      required
endDate     Date      required
travelType  String    enum: Solo | Couple | Family | Friends | Business
interests   [String]
aiResponse  Mixed     structured Gemini output
status      String    enum: draft | generated | failed
createdAt   Date      (timestamps)
```

---

## 🧠 How AI Generation Works

1. The user submits the Create Trip form.
2. `POST /api/trips/create` saves the trip, then calls
   `services/geminiService.js`.
3. `prompts/travelPrompt.js` builds a strict-JSON prompt describing the
   trip requirements.
4. Gemini's response is parsed and stored in `Trip.aiResponse`.
5. If parsing/generation fails, the trip is saved with `status: "failed"`
   and the user can retry via **Regenerate with AI** on the trip details page.

---

## 🗺 Maps Integration

- Uses **Leaflet** + **OpenStreetMap** tiles — completely free, no API key.
- **Nominatim** (OpenStreetMap's geocoding service) powers the destination
  autocomplete field and best-effort geocoding of AI-suggested attractions
  for map markers.

---

## 🧪 Testing the App

1. Register a new account.
2. From the Dashboard, click **Create New Trip**.
3. Search a destination (e.g. "Goa"), pick it from the autocomplete list.
4. Fill in dates, budget, travelers, travel type, and interests.
5. Submit — Voyage calls Gemini and redirects you to the generated trip.
6. Explore the itinerary, hotels, attractions, restaurants, budget, map,
   packing checklist, and tips.
7. Delete or regenerate the trip from the Trip Details page.

---

## 📌 Notes for Evaluators

- Passwords are never stored in plain text (bcrypt, salt rounds = 10).
- JWT tokens expire after 7 days by default (`JWT_EXPIRES_IN`).
- All private routes are protected via `authMiddleware.protect`.
- Input is validated both client-side (`utils/validators.js`) and
  server-side (`express-validator` + `validateMiddleware`).
- Centralized error handling returns consistent JSON error shapes.

---

## 📄 License

This project was built for academic purposes as part of a B.Sc. Computer
Science final-year submission. Free to use and modify for learning.
