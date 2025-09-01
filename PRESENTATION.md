# ABN Finder

---

## Application Architecture

---

### Overview

ABN Finder is a web application that allows users to search and filter through a database of Australian Business Numbers (ABNs). It provides a user-friendly interface to quickly find information about Australian companies.

---

### Tech Stack

- **Frontend:**
  - Next.js (React framework)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Zustand
  - SWR
- **Backend:**
  - Next.js API Routes
  - Supabase
- **Data Extraction:**
  - Node.js

---

### Frontend Architecture

```
+-----------------+      +-----------------+      +-----------------+
|   React (UI)    |----->| Zustand (State) |----->|   SWR (Data)    |
+-----------------+      +-----------------+      +-----------------+
        ^                      ^
        |                      |
+-----------------+      +-----------------+
| Next.js (Router)|      |  shadcn/ui (UI) |
+-----------------+      +-----------------+
```

- **Next.js:** Provides server-side rendering, routing, and the overall application structure.
- **React:** Used to build the user interface components.
- **Zustand:** A lightweight state management library used to manage the application's filter state.
- **SWR:** A data fetching library used to fetch data from the backend API.
- **shadcn/ui:** A collection of UI components used to build the user interface.

---

### Backend Architecture

```
+-----------------+      +-----------------+
| Next.js API     |----->| Supabase (DB)   |
+-----------------+      +-----------------+
```

- **Next.js API Route:** A single API endpoint (`/api/companies`) that handles all database queries.
- **Supabase:** A backend-as-a-service platform that provides a PostgreSQL database, authentication, and other backend features.

---

### Data Flow

```
+-----------+     +-------------+     +-----------------+     +-----------------+
| User (UI) |---->| Zustand     |---->| SWR             |---->| Next.js API     |----->| Supabase (DB) |
+-----------+     +-------------+     +-----------------+     +-----------------+
```

1. The user interacts with the UI (e.g., types in a search query, selects a filter).
2. The UI updates the filter state in the Zustand store.
3. The SWR hook, which is subscribed to changes in the Zustand store, automatically re-fetches the data from the Next.js API route with the updated filter parameters.
4. The Next.js API route queries the Supabase database with the provided parameters.
5. The API route returns the data to the SWR hook, which updates the UI.

---

### Data Extraction

- The application includes a page at `/extract-abn` that allows you to extract ABN data from an XML file and save it to the Supabase database.
- The page provides an interface to upload an XML file, which is then parsed to extract the data.
- The extracted data is displayed in a table and can be uploaded to the Supabase database with the click of a button.


