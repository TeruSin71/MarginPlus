# MarginPlus

A Next.js application for Profitability Management with SAP Fiori-inspired UX, Role-Based Access Control (RBAC), and Advanced Workflow Automation.

## Setup & Installation

**Note: This project was scaffolded in Offline Mode.**

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
    *Ensure you have an active internet connection.*

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features

### Group 1: Core
-   **Role-Based Access Control (RBAC)**: Switch roles via the Command Bar.
-   **T-Code Navigation**: Use the Command Field to navigate (ZPL01-ZPL04).
-   **Field Level Security**: Finance owned vs Sales owned fields.
-   **Claude AI Aesthetics**: Dark mode, clean variables in `globals.css`.

### Group 2: Workflow & Automation
-   **Progress Tracker**: Visual bar in `ZPL01` with "Save" interlock.
-   **Automated Workflow**: Status transitions (Draft -> PO -> Purchasing -> Sales).
-   **Email Simulation**: Console logs and alerts with Deep Links.
-   **Scenario Cloning**: "Save As New Scenario" in `ZPL02`.

### Group 3: User Administration & Security
-   **ZPL_ADMIN (User Management)**:
    -   Accessible only to **Admin** users.
    -   Manage User Profiles and **Allowed T-Codes**.
-   **Security Intercept**:
    -   Blocks navigation if `mustChangePassword: true`.
    -   "Generate Temp Password" functionality for Admins.
-   **Cross-Platform Styling**:
    -   Custom Scrollbars & System Fonts.

### Group 4: Final Assessment & AI
-   **Advanced Sales Security**:
    -   COGS/Margin fields are **strictly hidden** from Sales users.
    -   Finance/Purchasing can see cost data (Read-only).
-   **AI Market Analysis**:
    -   Mock "Gemini Analysis" tool for Sales.
    -   Provides Competitor Pricing logic (Safe: No internal costs revealed).
-   **Deployment Safety**:
    -   `env.local` is git-ignored.
    -   Secrets are protected.

## Deployment

### Vercel
1.  Push this repository to GitHub.
2.  Import the project into Vercel.
3.  Vercel will detect Next.js. Deploy.

### GitHub Safe-Guards
-   `env.local` is git-ignored.
-   Sensitive files are excluded via `.gitignore`.
