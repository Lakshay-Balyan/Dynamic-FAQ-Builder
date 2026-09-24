# Developer Guide

Welcome to the Code Harmony team. This guide explains the project's architecture, local setup, and development standards.

## 1. Architecture

This is a **monorepo** containing two distinct applications:

* **`backend/`**: A Node.js and Express server that acts as a REST API.
    * **`src/controllers`**: Contains all business logic (e.g., how to log in a user).
    * **`src/routes`**: Defines the API endpoints and connects them to controllers.
    * **`src/middleware`**: Handles authentication (`verifyToken`).
    * **`src/models`**: Contains the database connection (`db.js`).
    * **`src/tests`**: Contains all Jest tests (unit, integration, system).
* **`frontend/`**: A React application built with Vite.
    * **`src/components`**: Contains all React components (e.g., `AdminDashboard.jsx`).
    * **`src/context`**: Contains the global `AuthContext.jsx` for session management.
    * **`src/api`**: Contains the `axiosConfig.js` for a central API client.
    * **`src/test`**: Contains Vitest setup files.

## 2. Local Setup (Developer)

1.  **Clone the repo and `cd` into it.**
2.  **Install dependencies** for both projects:
    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
    ```
3.  **Set up the database:**
    * Create a Postgres database.
    * Create a `.env` file in the `backend/` folder (use `.env.example` as a template).
    * Fill in your `DATABASE_URL` and `JWT_SECRET`.
    * Run `Database.sql` (in the root) on your new database.

4.  **Run the project:**
    * In one terminal, run the backend: `cd backend && node src/server.js`
    * In a second terminal, run the frontend: `cd frontend && npm run dev`

## 3. Development Workflow

All work **must** follow our Git workflow to pass CI/CD.

1.  **Create a branch:** From `develop`, create a feature branch.
    * `git checkout develop`
    * `git pull origin develop`
    * `git checkout -b feature/my-new-feature`
2.  **Write code.**
3.  **Write tests:** Your new code **must** be covered by unit or integration tests.
4.  **Run checks locally:** Before pushing, run all local checks to save time.
    * `cd backend && npm test && npm run lint`
    * `cd ../frontend && npm test && npm run lint`
5.  **Commit and Push:**
    * `git add .`
    * `git commit -m "feat: add my new feature"`
    * `git push origin feature/my-new-feature`
6.  **Open a Pull Request:**
    * Go to GitHub and open a PR to merge your branch into `develop`.
    * Fill out the template, assign a reviewer, and link the Jira ticket.
7.  **Merge:**
    * The PR **must** have all green checkmarks (CI tests passed, coverage > 75%) and a teammate's approval before merging.