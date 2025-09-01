# ABN Finder

ABN Finder is a web application that allows users to search and filter through a database of Australian Business Numbers (ABNs). It provides a user-friendly interface to quickly find information about Australian companies.

## DEMO Link

- [Demo Link](https://abn-finder.vercel.app/)(Vercel Deployment)

## Features

- **Search:** Search for companies by name or ABN.
- **Filtering:** Filter companies by:
  - State
  - ABN Status (e.g., Active, Cancelled)
  - Company Type
  - GST Status
- **Sorting:** Sort the list of companies by various criteria.
- **Pagination:** Navigate through the list of companies with ease.
- **Theme Toggle:** Switch between light and dark mode for better readability.

## Tech Stack

- **Frontend:**
  - [Next.js](https://nextjs.org/) (React framework)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [shadcn/ui](https://ui.shadcn.com/) for UI components
  - [Zustand](https://github.com/pmndrs/zustand) for state management
  - [SWR](https://swr.vercel.app/) for data fetching
- **Backend:**
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
  - [Supabase](https://supabase.io/) for the database

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v20 or later)
- [npm](https://www.npmjs.com/get-npm)
- A [Supabase](https://supabase.io/) account and project

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/abn-finder.git
    cd abn-finder
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add your Supabase project URL and anon key:

    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

4.  **Set up the database:**

    You will need to create a table in your Supabase database named `australian_business_register` with the following columns:

    - `abn` (number, primary key)
    - `abn_status` (text)
    - `company_type` (text)
    - `company_name` (text)
    - `gst_status` (text)
    - `state` (text)
    - `postcode` (text)

### Usage

1.  **Run the development server:**

    ```bash
    npm run dev
    ```

2.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## ABN Data Extraction

The application includes a page at `/extract-abn` that allows you to extract ABN data from an XML file and save it to the Supabase database.

### How it works

The page provides an interface to upload an XML file. The application then parses the XML file, extracts the relevant information for each ABR record, and displays it in a table. You can then click the "Upload" button to save the data to the Supabase database.

### Usage

1.  Navigate to the `/extract-abn` page in the application.
2.  Upload your XML data file.
3.  Click the "Extract" button to see the extracted data.
4.  Click the "Upload" button to save the data to the Supabase database.
