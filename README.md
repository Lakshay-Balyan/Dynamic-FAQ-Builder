# Dynamic FAQ Builder

**Project ID:** P31  
**Course:** UE23CS341A  
**Academic Year:** 2025  
**Semester:** 5th Sem  
**Campus:** EC  
**Branch:** CSE  
**Section:** E  
**Team:** Code Harmony

## 📋 Project Description

[cite_start]An admin interface to create question-answer pairs, with a user search feature that ranks suggested answers by keyword relevance[cite: 1]. The project merges a Node.js backend with C.R.U.D. APIs, a PostgreSQL database with full-text search, and a responsive React front-end.

This repository contains the source code and documentation for the "Dynamic FAQ Builder" project, developed as part of the UE23CS341A course at PES University.

## 🧑‍💻 Development Team (Code Harmony)

- [@PES2UG23CS299](https://github.com/PES2UG23CS299) - Scrum Master
- [@PES2UG23CS282](https://github.com/PES2UG23CS282) - Developer Team
- [@Lakshita301](https://github.com/Lakshita301) - Developer Team
- [@pes2ug23cs270-Kavyasree](https://github.com/pes2ug23cs270-Kavyasree) - Developer Team

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/pestechnology/PESU_EC_CSE_E_P31_Dynamic_FAQ_Builder_Code-Harmony.git](https://github.com/pestechnology/PESU_EC_CSE_E_P31_Dynamic_FAQ_Builder_Code-Harmony.git)
    cd PESU_EC_CSE_E_P31_Dynamic_FAQ_Builder_Code-Harmony
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Database Setup:**
    * Create a new PostgreSQL database (e.g., `faq_db`).
    * In the `backend` folder, copy `.env.example` to a new file named `.env`.
    * Edit the `backend/.env` file with your database credentials and a new `JWT_SECRET`.
    * Run the `Database.sql` file (located in the root folder) against your database to create all tables and indexes.

### Running the Application

You must run both the backend and frontend in separate terminals.

1.  **Run the Backend Server:**
    ```bash
    # From the 'backend' folder
    node src/server.js
    ```
    *The server will run on `http://localhost:5000`.*

2.  **Run the Frontend App:**
    ```bash
    # From the 'frontend' folder
    npm run dev
    ```
    *The application will open on `http://localhost:5173`.*

## 📁 Project Structure

This is a monorepo containing two separate projects:

PESU_EC_CSE_E_P31_Dynamic_FAQ_Builder_Code-Harmony/ ├── .github/ │ └── workflows/ │ └── ci-cd.yml # CI/CD Pipeline configuration ├── backend/ │ ├── src/ # Backend Node.js source code │ ├── tests/ # Backend Jest test files │ ├── .env.example # Environment variable template │ ├── eslint.config.js # ESLint config │ ├── jest.config.js # Jest config │ └── package.json # Backend dependencies ├── frontend/ │ ├── src/ # Frontend React source code │ ├── .eslintrc.cjs # ESLint config │ ├── vitest.config.js # Vitest config │ └── package.json # Frontend dependencies ├── docs/ │ ├── api.md │ ├── user-guide.md │ └── developer-guide.md ├── Database.sql # Main PostgreSQL schema ├── requirements.txt # List of all project dependencies └── README.md # This file

## 🛠️ Development Guidelines

### Branching Strategy
- `main`: Production-ready code.
- `develop`: Development branch for merging features.
- `feature/*`: Feature branches (e.g., `feature/user-auth`).

### Commit Messages
Follow conventional commit format:
- `feat:` New features (e.g., `feat(DYN-4): add create-faq component`)
- `fix:` Bug fixes (e.g., `fix(CI): correct path to Database.sql`)
- `docs:` Documentation changes
- `style:` Code style changes (linting)
- `test:` Test-related changes

## 🤖 CI/CD Pipeline

Our project uses GitHub Actions for continuous integration. The pipeline runs automatically on every push to `main`, `develop`, or any `feature/*` branch.

This pipeline is split into two parallel jobs (`backend-ci` and `frontend-ci`) and a final `create-artifact` job.

### Pipeline Stages

Our pipeline meets all 5 stages required by the course rubric[cite: 2138]:

1.  **Build:** Installs dependencies for both `backend` and `frontend` using `npm ci`. The `frontend-ci` job also runs `npm run build` to ensure the React app builds successfully[cite: 2798].
2.  **Test:** Runs the full automated test suite for both projects using `npm test`. This includes **Unit, Integration, and System tests** as required[cite: 2695, 2800].
3.  **Coverage:** Runs `npm run coverage` to generate coverage reports. A quality gate is set to **fail the pipeline if coverage is below 75%**[cite: 2761, 2802].
4.  **Lint:** Scans both codebases for style errors using `npm run lint` (ESLint). Fails if errors are present[cite: 2807].
5.  **Security:** Scans both projects for vulnerabilities using `npm audit --audit-level=high`[cite: 2812].

### Deployment Artifact

After all `backend-ci` and `frontend-ci` jobs pass on the `main` or `develop` branches, the `create-artifact` job runs. This job creates a `deployment-package.zip` file that contains[cite: 2921]:
- The complete `backend` source code.
- The `frontend/src` code.
- The final `frontend/dist` build.
- All reports (coverage, lint, security).
- The `README.md` and `package.json` files.

## 🧪 Local Testing

You can run all CI checks locally from the root of each project.

### Backend Testing (from `backend/` folder)
```bash
# Run all tests (Unit, Integration, System)
npm test

# Run all tests with coverage report
npm test -- --coverage

# Run linter
npm run lint
Frontend Testing (from frontend/ folder)
Bash

# Run all tests
npm test

# Run all tests with coverage report
npm test -- --coverage

# Run linter
npm run lint