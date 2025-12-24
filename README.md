# smartLearning - AI-Powered Learning Platform (Production-Ready MVP)

-----

## Project Description

This project is a professional-grade AI-powered learning platform that allows users to select learning topics (by category and subcategory), receive customized lessons via OpenAI, and track their learning history. The application is built with a focus on security, scalability, and type safety, featuring a full TypeScript stack and robust architecture.

The **Admin Dashboard** provides comprehensive management capabilities, including user monitoring and full prompt history with advanced filtering and pagination.

-----

## 🚀 Tech Stack

The project is fully standardized on **TypeScript** across both the frontend and backend to ensure end-to-end type safety.

*   **Languages**: TypeScript (Full Stack)
*   **Frontend**: React 18, React Router 7, Bootstrap 5, React Context API (State Management)
*   **Backend**: Node.js, Express 5, Mongoose, Winston (Logging), Express-Validator
*   **Database**: MongoDB
*   **Security**: JWT Authentication, bcryptjs, Express Rate Limit, DOMPurify
*   **Testing**: Jest, ts-jest
*   **AI**: OpenAI API (GPT-3.5 Turbo)

-----

## 🔒 Security & Robustness

We have implemented industry-standard security practices to ensure the platform is production-ready:

*   **Input Validation & Sanitization**: All user inputs are validated using `express-validator` and sanitized with `isomorphic-dompurify` to prevent XSS and injection attacks.
*   **Rate Limiting**: Protection against brute-force attacks and API abuse using `express-rate-limit`.
*   **Structured Logging**: Comprehensive activity and error tracking using **Winston**. Logs are organized into `logs/error.log` and `logs/combined.log`.
*   **Error Boundaries**: React Error Boundaries are implemented to catch and handle UI crashes gracefully.
*   **Centralized Auth**: Session management is handled via a centralized React Context, ensuring secure state persistence and consistent user permissions.

-----

## 🧪 Testing

The core business logic and AI integration are protected by a comprehensive unit test suite.

### Running Tests
To run the backend tests, navigate to the `server` directory and run:

```bash
npm test
```

Tests are implemented using **Jest** and include mocks for the OpenAI API and database middlewares.

-----

## 📜 Useful Scripts

| Command | Directory | Description |
| :--- | :--- | :--- |
| `npm run dev` | `server` | Starts the backend development server with hot-reload. |
| `npm test` | `server` | Runs the Jest unit test suite. |
| `npm run build` | `server` | Compiles TypeScript source code to `/dist`. |
| `npm start` | `client` | Launches the React frontend in development mode. |
| `npm run build` | `client` | Creates an optimized production build of the frontend. |

-----

## 🛠️ Prerequisites

*   **Node.js**: Version 18 or higher
*   **npm**: Version 9 or higher
*   **MongoDB**: Local installation or MongoDB Atlas URI

-----

## 💡 Installation and Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/elisheva1280/smartLearning
    cd miniMVPproject
    ```

2.  **Server Setup**:
    ```bash
    cd server
    npm install
    # Create .env based on .env.example
    cp .env.example .env
    ```
    Configure your `MONGODB_URI`, `JWT_SECRET`, and `OPENAI_API_KEY` in the `.env` file.

3.  **Client Setup**:
    ```bash
    cd ../client
    npm install
    # Create .env based on .env.example
    cp .env.example .env
    ```
    Ensure `REACT_APP_API_BASE_URL` points to your backend (default: `http://localhost:3001`).

-----

## 🗺️ API Endpoints (Backend)

*   `POST /api/users/register`: Registers a new user with password complexity requirements.
*   `POST /api/users/login`: Authenticates user and returns JWT.
*   `GET /api/prompts`: Retrieves learning history (Filtered by user ID for regular users, all for Admins).
*   `POST /api/openai`: Generates AI response (Rate-limited).
*   `GET /api/categories`: Retrieves all learning categories.
*   `GET /api/subcategories/category/:id`: Retrieves subcategories.

-----

## 📂 Architecture

### Global State Management
The frontend uses the **React Context API** (`AuthContext`) to manage user sessions and authentication tokens. This ensures that:
*   State is persistent across navigation.
*   Authentication headers are automatically applied to API requests.
*   UI components react instantly to permission changes.

### Modular Backend
The backend follows a Controller-Service-Route pattern:
*   `middleware/`: Security, validation, and authentication logic.
*   `controllers/`: Request handling and response coordination.
*   `models/`: Schema definitions using Mongoose.
*   `utils/logger.ts`: Centralized Winston logging configuration.

-----

## 🤝 Credits

This project was developed by **Elisheva Cohen**.

