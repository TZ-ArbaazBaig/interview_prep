# 🧠 The Vault AI (InterviewPrep) — Master Blueprint for Flutter Mobile Replication

This is the definitive technical blueprint containing **100% of the specifications, architecture details, schemas, field validations, UI design configurations, API contracts, and background logic** from the Vault AI project. Use this guide to build a fully feature-compatible Flutter mobile application that mirrors the design and logic of the web application.

---

## 📂 1. Directory Structure & File Map

Below is the complete map of files in the current full-stack repository. Your Flutter project must map these frontend pages to Flutter routes/screens and backend features to appropriate API client services:

```text
interview-prep-ai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DifficultyBadge.jsx      -> Difficulty tag UI helper (Easy, Medium, Hard)
│   │   │   ├── JobDescForm.jsx          -> Job description text field with validations
│   │   │   ├── LoadingSpinner.jsx       -> Spin indicators (Sizes: sm, md, lg)
│   │   │   ├── Navbar.jsx               -> Navigation header (Vault AI branding, History link, Clerk UserButton)
│   │   │   ├── ProgressBar.jsx          -> Question completion slider & percentage indicator
│   │   │   └── AppFooter (in App.jsx)   -> Global footer: policy links, copyright, Delete Account button & modal
│   │   │   └── QuestionCard.jsx         -> Display question with difficulty/category tags & hint expansion
│   │   ├── pages/
│   │   │   ├── Home.jsx                 -> Input JD form screen with ambient glows
│   │   │   ├── History.jsx              -> Paginated history cards with search, filters & progress bars
│   │   │   ├── Practice.jsx             -> List of generated questions grouped by tabs
│   │   │   ├── MockInterview.jsx        -> Sequential question practice console, input answer & AI score view
│   │   │   ├── Results.jsx              -> Completed exam summaries, scoring averages & question breakdown
│   │   │   ├── Chat.jsx                 -> RAG dossier chat console with auto-scroll & template chips
│   │   │   ├── SignInPage.jsx           -> Auth email/password input page & redirect OAuth options
│   │   │   ├── SignUpPage.jsx           -> Register page with live password validator & 6-digit confirmation
│   │   │   ├── PrivacyPolicy.jsx        -> Public privacy policy page (data collection, AI usage, deletion)
│   │   │   └── TermsAndConditions.jsx   -> Public terms & conditions page (service scope, disclaimers)
│   │   ├── hooks/
│   │   │   └── useApi.js                -> Axios/Fetch client integration with Clerk token generation
│   │   ├── utils/
│   │   │   └── api.js                   -> Core HTTP request constructor
│   │   ├── App.jsx                      -> Router config, Clerk protected routes, AppFooter with Delete Account
│   │   ├── index.css                    -> CSS utility configurations (glass-panels, buttons, webkit scrollbars)
│   │   └── main.jsx                     -> ClerkProvider initialization and theme customizations
├── server/
│   ├── db/
│   │   └── database.js                  -> Mongoose database initializer
│   ├── middleware/
│   │   ├── auth.js                      -> Clerk Token verification & `req.userId` extraction
│   │   └── errorHandler.js              -> Express global uncaught error payload generator (400 vs 500 handling)
│   ├── models/
│   │   ├── User.js                      -> User schema details (email, firstName, lastName, etc.)
│   │   ├── Session.js                   -> Session schema details (userId, jobTitle, jobDescription)
│   │   ├── Question.js                  -> Question schema details (category, difficulty, hint, order)
│   │   └── Evaluation.js                -> User answers, AI score, feedback & model suggestions
│   ├── routes/
│   │   ├── users.js                     -> Endpoints for syncing Clerk user + cascade account deletion
│   │   ├── sessions.js                  -> Endpoints for session actions (creates, lists, fetches session data)
│   │   ├── questions.js                 -> Endpoint for fetching questions of a session
│   │   ├── evaluate.js                  -> Endpoint for scoring user answers via AI
│   │   └── chat.js                      -> Endpoint for RAG dossier context-aware chatbot
│   ├── services/
│   │   ├── groq.js                      -> LLM model integration (Llama-3.3-70b-versatile) for questions & scores
│   │   ├── pinecone.js                  -> Keyword search, splitting text to paragraphs, indexing engine
│   │   └── rag.js                       -> RAG prompts and context assembly
│   └── index.js                         -> Express configuration, manual CORS middleware & port setups
```

---

## 🎨 2. Visual Theme & Styling Tokens

Your Flutter theme configuration should use the exact hex colors, custom typography weightings, and visual shapes specified below:

### 1. Hex Color Codes
*   **Backgrounds**:
    *   Primary Scaffold Background (`obsidian-950`): `#050505`
    *   Main Content Background / Navbar (`obsidian-900`): `#0A0A0A`
    *   Standard Card Background (`obsidian-800`): `#121212`
    *   Border Elements / Input Field Background (`obsidian-700`): `#1A1A1A`
    *   Hover Card / Sub-elements (`obsidian-600`): `#262626`
*   **Accents**:
    *   Primary Accent Violet (`violet-500`): `#8F00FF`
    *   Hover Violet / Secondary (`violet-600`): `#7A00DB`
    *   Light Glow Violet (`violet-400`): `#A855F7`
*   **Typography Silvers**:
    *   Muted Labels (`silver-400`): `#94A3B8`
    *   Inactive Paragraphs (`silver-300`): `#CBD5E1`
    *   Secondary Titles / Active Text (`silver-200`): `#E2E8F0`
    *   Primary Paragraphs (`silver-100`): `#F1F5F9`
    *   Bright Background Tint (`silver-50`): `#F8FAFC`
*   **Scoring & Evaluation Badges**:
    *   Strong (Score 8-10): `#34D399` (`emerald-400`)
    *   Average (Score 5-7): `#A855F7` (`violet-400`)
    *   Needs Work (Score 1-4): `#FB7185` (`rose-400`)

### 2. Fonts & Weighting
*   **Primary Sans Font**: `Inter` (used for standard body text, input fields, and lists).
*   **Display Font**: `Space Grotesk` (used for page titles, buttons, and scores).
*   **Monospace Font**: `JetBrains Mono` (used for tags, labels, dates, progress labels, and hints).
*   **Styling Modifiers**: Headers are tracked with `letter-spacing: -0.05em` and font-weight `900` (black). Badges and mono labels have `letter-spacing: 0.2em` or `0.3em` and font-weight `700` (bold) / uppercase.

### 3. Glow & Shadows
*   **Ambient Glows**: Created using a background layout containing a circular radial gradient with transparency (`rgba(143, 0, 255, 0.05)` to transparent) spread over $50\%$ screen dimensions.
*   **Card Shadow Glows**:
    *   Standard shadow (`violet-glow`): `BoxShadow` with color `rgba(143, 0, 255, 0.3)`, spread radius `-5`, blur radius `20`.
    *   Large shadow (`violet-glow-lg`): `BoxShadow` with color `rgba(143, 0, 255, 0.5)`, spread radius `-10`, blur radius `40`.

---

## 🗄️ 3. Database Model Definitions

These schema structures map user progress. Replicate these fields in SQLite, Hive, Isar, or your local Flutter database models:

### 1. User Model
*   `userId` (String, Required, Unique, Primary/Indexed Key): Synced Clerk identifier (`sub`).
*   `email` (String, Required): Registered user email address.
*   `firstName` (String, Optional): First name from oauth/form.
*   `lastName` (String, Optional): Last name from oauth/form.
*   `imageUrl` (String, Optional): User avatar url.
*   `createdAt` (Date, default `Date.now`): Profile creation date.
*   `lastLogin` (Date, default `Date.now`): Last synchronized login time.

### 2. Session Model
*   `_id` (ObjectId/String, Unique, Primary Key): Generated session ID.
*   `userId` (String, Required, Indexed): Links to the user who created it.
*   `jobTitle` (String, Required): Parsed job title (extracted from the first non-empty line of the job description input, capped at 100 characters).
*   `jobDescription` (String, Required): Full text input. Must be between 50 and 3000 characters.
*   `createdAt` (Date, default `Date.now`): Time of session initiation.

### 3. Question Model
*   `_id` (ObjectId/String, Unique, Primary Key): Generated question ID.
*   `sessionId` (ObjectId/String, Required, Foreign Key): Links to parent session.
*   `questionText` (String, Required): The question prompt generated by AI.
*   `difficulty` (String, Required): Enum constraints: `easy`, `medium`, `hard`.
*   `category` (String, Required): Enum constraints: `technical`, `behavioral`, `system-design`.
*   `hint` (String, Required): Single-sentence strategic tip.
*   `orderIndex` (Number, Required): 0-indexed positioning (0 to 9).

### 4. Evaluation Model
*   `_id` (ObjectId/String, Unique, Primary Key): Generated evaluation ID.
*   `questionId` (ObjectId/String, Required, Unique): Links to target Question.
*   `sessionId` (ObjectId/String, Required): Links to parent Session.
*   `userAnswer` (String, Required): Candidate typed response. Must be between 10 and 2000 characters.
*   `aiScore` (Number, Required): Integer value from 1 to 10.
*   `aiFeedback` (String, Required): 2-3 sentences of evaluation feedback.
*   `betterAnswer` (String, Required): Model answer written from a candidate's perspective scoring 9-10.
*   `createdAt` (Date, default `Date.now`): Time of response evaluation.

---

## 🔌 4. API Endpoints & Request/Response Contracts

Replicate these API requests using a network client (e.g., `Dio` or `Http` in Flutter).

### 1. HTTP Client Request Base Setup
*   **Headers**: Every endpoint inside `/api/*` requires an authorization header:
    ```http
    Authorization: Bearer <JWT_Token_From_Clerk>
    Content-Type: application/json
    ```

### 2. User Synchronization
*   **Endpoint**: `POST /api/users/sync`
*   **Request Body**:
    ```json
    {
      "email": "name@domain.com",
      "firstName": "John",
      "lastName": "Doe",
      "imageUrl": "https://img.clerk.com/..."
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "user": {
        "userId": "user_2aB...",
        "email": "name@domain.com",
        "firstName": "John",
        "lastName": "Doe",
        "imageUrl": "https://img.clerk.com/...",
        "_id": "6472f105...",
        "createdAt": "2026-06-17T12:00:00.000Z",
        "lastLogin": "2026-06-17T12:00:00.000Z"
      }
    }
    ```

### 2b. Delete User Account (Cascade Deletion)
*   **Endpoint**: `DELETE /api/users`
*   **Request Body**: None (user identity is inferred from the Bearer JWT token).
*   **Backend Cascade Logic**:
    1.  Verify `userId` from Clerk JWT token via auth middleware.
    2.  Query all `Session` documents where `userId` matches.
    3.  Collect all `sessionIds` from the matched sessions.
    4.  `Evaluation.deleteMany({ sessionId: { $in: sessionIds } })` — delete all evaluations.
    5.  `Question.deleteMany({ sessionId: { $in: sessionIds } })` — delete all questions.
    6.  `Session.deleteMany({ userId })` — delete all sessions.
    7.  `User.findOneAndDelete({ userId })` — delete the user profile document.
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "User account and all associated practice data have been permanently deleted."
    }
    ```
*   **Error Responses**:
    *   `401 Unauthorized`: `{ "error": "Unauthorized: No userId found in token" }`
    *   `500 Internal Server Error`: `{ "error": "Failed to delete account and data" }`
*   **Flutter Client-Side Flow** (after receiving 200 OK):
    1.  Call Clerk SDK `user.delete()` to delete the authentication profile (auto-invalidates session).
    2.  Navigate to the Sign-In screen.
    3.  Clear all local storage / secure storage tokens.

### 3. Generate Interview Session (JD Analysis)
*   **Endpoint**: `POST /api/sessions`
*   **Request Body**:
    ```json
    {
      "jobDescription": "Looking for a React developer with at least 3 years experience..."
    }
    ```
*   **Backend Validation Rules**:
    *   `if (!jobDescription || jobDescription.trim().length < 50)` $\rightarrow$ Returns HTTP **400 Bad Request** with `{ "error": "Job description too short. Please paste the full JD." }`
    *   `if (jobDescription.length > 3000)` $\rightarrow$ Returns HTTP **400 Bad Request** with `{ "error": "Job description too long. Keep it under 3000 characters." }`
*   **Response (201 Created)**:
    ```json
    {
      "sessionId": "6472f10b...",
      "jobTitle": "React Developer",
      "questions": [
        {
          "_id": "6472f10c...",
          "sessionId": "6472f10b...",
          "questionText": "What are the key performance optimizations in React 18?",
          "difficulty": "medium",
          "category": "technical",
          "hint": "Mention automatic batching, concurrent features, and useMemo usage.",
          "orderIndex": 0
        }
      ]
    }
    ```

### 4. Fetch All Sessions (History List)
*   **Endpoint**: `GET /api/sessions`
*   **Response (200 OK)**:
    ```json
    {
      "sessions": [
        {
          "_id": "6472f10b...",
          "userId": "user_2aB...",
          "jobTitle": "React Developer",
          "jobDescription": "Looking for a React developer...",
          "createdAt": "2026-06-17T12:00:00.000Z",
          "id": "6472f10b...",
          "job_title": "React Developer",
          "created_at": "2026-06-17T12:00:00.000Z",
          "questionCount": 10,
          "answeredCount": 3
        }
      ]
    }
    ```

### 5. Fetch Session Details (Individual Practice/Results Setup)
*   **Endpoint**: `GET /api/sessions/:sessionId`
*   **Response (200 OK)**:
    ```json
    {
      "session": {
        "id": "6472f10b...",
        "_id": "6472f10b...",
        "userId": "user_2aB...",
        "jobTitle": "React Developer",
        "job_title": "React Developer",
        "jobDescription": "Looking for a React developer...",
        "job_description": "Looking for a React developer...",
        "createdAt": "2026-06-17T12:00:00.000Z",
        "created_at": "2026-06-17T12:00:00.000Z"
      },
      "questions": [
        {
          "id": "6472f10c...",
          "_id": "6472f10c...",
          "sessionId": "6472f10b...",
          "question_text": "What are the key performance optimizations in React 18?",
          "questionText": "What are the key performance optimizations in React 18?",
          "difficulty": "medium",
          "category": "technical",
          "hint": "Mention automatic batching, concurrent features, and useMemo usage.",
          "order_index": 0,
          "orderIndex": 0,
          "ai_score": 8,
          "ai_feedback": "You answered well.",
          "better_answer": "In React 18, optimizations can...",
          "user_answer": "We use batching and React.memo..."
        }
      ]
    }
    ```

### 6. Fetch Session Progress Summary
*   **Endpoint**: `GET /api/sessions/:sessionId/progress`
*   **Response (200 OK)**:
    ```json
    {
      "total": 10,
      "answered": 3,
      "percentage": 30
    }
    ```

### 7. Evaluate User Answer
*   **Endpoint**: `POST /api/evaluate`
*   **Request Body**:
    ```json
    {
      "questionId": "6472f10c...",
      "userAnswer": "I used useMemo, useCallback and React.memo to prevent unnecessary component renders...",
      "questionText": "What are the key performance optimizations in React 18?"
    }
    ```
*   **Backend Validation Rules**:
    *   `if (!userAnswer || userAnswer.trim().length < 10)` $\rightarrow$ Returns HTTP **400 Bad Request** with `{ "error": "Answer too short. Please write at least a sentence." }`
    *   `if (userAnswer.length > 2000)` $\rightarrow$ Schema constraint. Keep entries under 2000 characters.
    *   Checks if the question has already been evaluated:
        If an `Evaluation` entry already exists for `questionId`, the server bypasses LLM call and returns:
        ```json
        {
          "score": 8,
          "feedback": "Cached feedback...",
          "betterAnswer": "Cached better answer...",
          "alreadyEvaluated": true
        }
        ```
*   **Response (200 OK)**:
    ```json
    {
      "score": 8,
      "feedback": "Strong explanation of rendering blockers. Make sure to cover Automatic Batching.",
      "betterAnswer": "To optimize performance, React 18 introduces Automatic Batching out of the box... Additionally, transitions via startTransition can prevent UI freezes..."
    }
    ```

### 8. Context-Aware Dossier Chat (RAG)
*   **Endpoint**: `POST /api/chat/:sessionId`
*   **Request Body**:
    ```json
    {
      "question": "What are the primary technical tools listed?"
    }
    ```
*   **Backend Validation Rules**:
    *   `if (!question || question.trim().length < 5)` $\rightarrow$ Returns HTTP **400 Bad Request** with `{ "error": "Question is too short. Please ask a specific question about the role." }`
    *   `if (question.length > 500)` $\rightarrow$ Returns HTTP **400 Bad Request** with `{ "error": "Question exceeds character limit. Please keep it concise." }`
*   **Response (200 OK)**:
    ```json
    {
      "question": "What are the primary technical tools listed?",
      "answer": "The core tools specified are React 18, Vite, and Tailwind CSS. The description also mentions AWS and Node.js for backend support.",
      "chunksUsed": 2
    }
    ```

---

## 💻 5. Frontend UI/UX Interactive Specs & Field Validation

Here are the functional layouts, validators, states, and logic to build in Flutter:

### 1. Sign-In Screen
*   **Email Field**:
    *   *Keyboard Type*: Email Address.
    *   *Real-time validation*: Checks if email contains `@`.
*   **Password Field**:
    *   *Obscured Text*: Yes (toggle visible with trailing Eye/EyeOff icons).
    *   *Validation*: Length must be $\ge 8$ characters.
*   **Actions**:
    *   Submit Button: Enabled only if email contains `@` and password $\ge 8$ characters. Shows a spinner loader during authentication.
    *   "Continue with Google" Button.
    *   Redirect link to Sign Up.

### 2. Sign-Up Screen
*   **First Name & Last Name Fields**:
    *   *Validation*: Must not be empty.
*   **Email Field**:
    *   *Validation*: Must contain `@`.
*   **Password Field**:
    *   *Obscured Text*: Yes (with toggle trailing icon).
    *   *Live Strength Checklist Grid*: Matches 5 criteria. As user types, change status icon of checkmark from grey `○` to green `✓`:
        1.  Length $\ge 10$ characters.
        2.  Contains an uppercase letter (`[A-Z]`).
        3.  Contains a lowercase letter (`[a-z]`).
        4.  Contains a number (`[0-9]`).
        5.  Contains a special symbol (`[!@#$%^&*(),.?":{}|<>]`).
*   **Verify State (6-Digit SMS/Email OTP Screen)**:
    *   Triggered after registration submit completes successfully.
    *   Displays target validation code text field.
    *   *Keyboard Type*: Number pad.
    *   *Input formatting*: Replaces non-digits, caps length at 6 characters. Display field features high letter-spacing tracking.
    *   *Validation*: Submit button enabled when exactly 6 digits are typed.
    *   *Execution Success*: Once verification is complete, automatically triggers user profile sync endpoint: `/users/sync` and redirects to Home.

### 3. Dashboard / Home Screen
*   **Branding & Styling**: Replicates `Vault AI` display text in top-left.
*   **Draft Job Description Text Area**:
    *   *Draft Caching*: Save text in local storage (e.g. Shared Preferences in Flutter) as user types. If app crashes or user leaves, restore cached text on re-entry.
    *   *Live character limit indicator*: Displays `X / 3000 Characters`. Changes color to red (`#FB7185`) if count exceeds 3000.
    *   *Submit Button*: Enabled only if character count $\ge 50$ and $\le 3000$. Action: Triggers `/sessions` creation, clears local storage cache, and navigates to the **Practice Screen**.

### 4. History Screen
*   **Search Input Field**:
    *   Filters list dynamically as user types (matching against `jobTitle` values, case-insensitive).
*   **Categories Tabs Filter Bar**:
    *   Option chips: **All**, **In-progress**, and **Completed**.
    *   *Filter Rules*:
        *   `all`: All history.
        *   `in-progress`: Answered questions count is $> 0$ and $< 10$.
        *   `completed`: Answered questions count is exactly equal to 10.
*   **Pagination / ListView**:
    *   Loads 5 items. If there are more, display pagination indicators at the bottom.
*   **Session Cards**:
    *   Clickable item. Displays job title, date created, and progress bar (`answeredCount / totalCount`).
    *   *Status Badges*:
        *   `New`: Answered count = 0 (Violet theme badge: background `#8F00FF` with $10\%$ opacity, border `#8F00FF` with $20\%$ opacity, text `#A855F7`).
        *   `In Progress`: Answered count $> 0$ and $< 10$ (Grey theme badge: background `#121212`, border `#1A1A1A`, text `#E2E8F0`).
        *   `Completed`: Answered count = 10 (Green theme badge: background `#34D399` with $5\%$ opacity, border `#34D399` with $20\%$ opacity, text `#34D399`).

### 5. Practice Screen
*   **Navigation Header**: Shows back chevron returning to Home/Terminal.
*   **Sorting Bar**: Chips representing categories (**All**, **Technical**, **Behavioral**, **System Design**). Tapping a category filters the visible card grid.
*   **Simulation Controls**:
    *   "Chat with Dossier" button.
    *   "Initialize Simulation" button.
*   **Interactive Question Cards Grid**:
    *   Each card renders Category type, Difficulty badge, and Question text.
    *   *Difficulty Badge Colors*:
        *   `Easy`: Text `#A855F7` (`violet-400`), border `#8F00FF` ($20\%$ opacity), background `#8F00FF` ($10\%$ opacity).
        *   `Medium`: Text `#E2E8F0` (`zinc-300`), border `#27272a` (`zinc-700`), background `#121212` (`zinc-800`).
        *   `Hard`: Text `#FB7185` (`rose-400`), border `#fb7185` ($20\%$ opacity), background `#fb7185` ($10\%$ opacity).
    *   *Strategic Hint Action*: Shows button: `Reveal Strategic Hint`. Tapping displays the hint container with a fade-in scale animation.

### 6. Mock Interview Screen
*   **Header**: Progress tracker line widget showing `Question X of 10`.
*   **Answering View (Unanswered State)**:
    *   Displays question details.
    *   Large multiline input text field. Needs scroll support for long answers.
    *   *Submit Button*: Enabled only if answer length $\ge 10$ characters. Shows "Analyzing..." state with a loading spinner while waiting for evaluation results.
    *   *Skip Button*: Skips current question, records a blank answer, increments the skipped question count, and immediately proceeds to next question.
*   **Evaluation View (Evaluated State)**:
    *   *AI Score Card*: Large container showing the evaluation score (e.g. `8`) with a sub-label `/ 10`. Card background and score text color match values (Emerald for $\ge 8$, Violet for $\ge 5$, Rose for $< 5$).
    *   *Feedback Card*: Renders evaluation feedback inside italicized styling blocks.
    *   *Model Answer Expanding Panel*: Accordion labeled "View Model Answer". Tapping expands a scrollable container displaying the detailed model answer.
    *   *Next Button*: Action button changes text to "Finish Session" if current index is 9, or "Next Question" for indices 0-8. Clears input text and evaluation state, loading the next question.

### 7. Results Screen
*   **Header Overview**:
    *   Average Score Circle: Large calculated mean value of scores (excluding skipped/null entries). Color is determined by score value (emerald, violet, or rose).
*   **Metrics Grid**:
    *   *Answered Questions Count*: Displays `X / 10`.
    *   *Strong Answers Count*: Displays number of evaluations with score $\ge 8$.
    *   *Needs Work Count*: Displays number of evaluations with score $< 5$.
*   **Detailed Breakdown Card List**:
    *   Lists all 10 questions sequentially.
    *   Questions that were answered display: Score (`Score: X / 10`) and AI Feedback. Also includes a "Retry" button.
    *   Questions that were skipped display: `"Skipped during session"`.
*   **Primary Action**: "Start New Practice" button at the bottom navigation bar.

### 8. Intelligence Chat Screen
*   **Header Context**: Displays back button returning to Practice page, page name ("Intelligence Chat"), and sub-label showing the active session's job title.
*   **Quick Templates Bar**: Horizontal scrolling chips containing predefined questions. Tapping a chip automatically submits that message.
*   **Chat Conversation Area**:
    *   User bubble: Right-aligned, violet background (`#8F00FF`), white text.
    *   Assistant bubble: Left-aligned, dark background (`#121212`), border (`#1A1A1A`), silver text.
    *   Assistant bubble footnote: If the query matched job description chunks, display a small mono label stating: `Sparkles icon + "Analyzed X segments of the dossier"`.
*   **Typing Indicator**: Shows three bouncing violet dots while waiting for the response.
*   **Auto-Scroll**: Automatically scrolls to the bottom of the list when new messages are added or the typing indicator is visible.
*   **Footer**: Form input with message text field and submit button. Button is enabled if input length $\ge 1$ (which is validated further in useApi to meet the minimum character constraint of $\ge 5$).

### 9. Privacy Policy Screen (Public Route)
*   **Route**: `/privacy` — accessible without login (Google Play requirement).
*   **Content Sections** (render as styled, scrollable content):
    1.  **Information We Collect**: Lists data types — authentication profile (Clerk), practice session logs, and job description text used for RAG analysis.
    2.  **How We Use Your Information**: AI-powered question generation, answer evaluation, and context-aware dossier chat.
    3.  **AI Processing Disclosure**: States that job descriptions and answers are processed by the Groq AI API (Llama 3.3 70B). Data is not stored permanently on third-party servers.
    4.  **Data Retention & Deletion**: Explains data is retained until the user deletes their account. Permanent deletion removes all sessions, questions, evaluations, and the user profile.
    5.  **How to Delete Your Data**: Instructs user to scroll to the footer and click "Delete Account" → confirm in the modal → all data is permanently erased.
    6.  **Contact Information**: App developer's email for privacy inquiries.
*   **Flutter Implementation**: Build as a `StatelessWidget` with styled `Text` / `RichText` blocks. Include a "Back" navigation button in the AppBar.

### 10. Terms & Conditions Screen (Public Route)
*   **Route**: `/terms` — accessible without login.
*   **Content Sections**:
    1.  **Acceptance of Terms**: Using the app constitutes acceptance.
    2.  **Description of Service**: AI-powered interview preparation platform.
    3.  **User Accounts**: Users are responsible for their credentials and content.
    4.  **AI-Generated Content Disclaimer**: Scores and feedback are AI-generated and should not be considered professional advice. Results may vary.
    5.  **Acceptable Use**: Users must not submit offensive, illegal, or harmful content.
    6.  **Intellectual Property**: App branding and design belong to Vault AI.
    7.  **Limitation of Liability**: App is provided "as-is". No guarantees of interview outcomes.
    8.  **Termination**: Right to suspend accounts violating terms.
    9.  **Changes to Terms**: Terms may be updated; continued use implies acceptance.
    10. **Contact Information**: App developer's email for terms inquiries.
*   **Flutter Implementation**: Same styled scrollable content layout as Privacy Policy.

### 11. Global Footer (Visible on All Authenticated Screens)
*   **Layout**: Appears at the bottom of every authenticated page, below main content.
*   **Footer Content (top to bottom)**:
    1.  **Policy Links Row**: `Privacy Policy` • `Terms & Conditions` — tapping navigates to the respective public route.
    2.  **Copyright Line**: `© {year} Vault AI. Built for developers by developers.`
    3.  **Delete Account Button** (below a subtle divider):
        *   *Appearance*: Subtle, low-opacity rose-colored text with a trash icon (`🗑️ Delete Account`). Intentionally muted to prevent accidental clicks.
        *   *Hover/Press state*: Text brightens to rose-400, faint rose border appears.
        *   *On Tap*: Opens the **Delete Account Confirmation Modal**.

### 12. Delete Account Confirmation Modal
*   **Trigger**: Tapping the "Delete Account" button in the footer.
*   **Modal Overlay**: Full-screen dark backdrop (`black/80%` opacity) with blur effect.
*   **Modal Content**:
    *   ⚠️ Warning icon (AlertTriangle) in a rose-tinted container.
    *   Title: `"DELETE ACCOUNT?"` in uppercase bold display font.
    *   Description: `"This will permanently delete your profile, all practice sessions, question history, evaluations, and scores. This action cannot be undone."`
    *   Error display area (shows API errors if deletion fails).
*   **Action Buttons**:
    *   `Cancel` — closes the modal, no action taken.
    *   `Delete Forever` — triggers the deletion flow:
        1.  Shows loading spinner while processing.
        2.  Calls `DELETE /api/users` to wipe MongoDB data.
        3.  Calls Clerk SDK `user.delete()` to remove the authentication profile.
        4.  Navigates to Sign-In screen.
        5.  Clears all local storage and secure storage.
*   **Flutter Implementation**: Use `showDialog()` or a custom modal overlay. Both buttons should be disabled while deletion is in progress.

---

## ⚙️ 6. Core Business Logic & AI Engines

Your mobile services must replicate or integrate with the following system engines:

### 1. Question Generation Rules (Groq Prompt)
*   The LLM model configured is `llama-3.3-70b-versatile` under JSON mode.
*   *Prompt Requirements*:
    *   Tailor exactly 10 questions to the input job description.
    *   Difficulty balance: exactly 3 easy, 4 medium, and 3 hard questions.
    *   Category balance: technical, behavioral, and system-design.
    *   Behavioral prompts must begin with: *"Tell me about a time..."*
    *   Return a structured JSON output with schema:
        ```json
        {
          "questions": [
            {
              "question": "question text",
              "difficulty": "easy/medium/hard",
              "category": "technical/behavioral/system-design",
              "hint": "one sentence hint"
            }
          ]
        }
        ```

### 2. Answer Evaluation Logic (Groq Prompt)
*   Evaluator LLM model is `llama-3.3-70b-versatile` with JSON output formatting enabled.
*   *Prompt Requirements*:
    *   Input: `questionText` + `userAnswer`.
    *   Scoring scale:
        *   `1-3`: Very poor, missing core concepts.
        *   `4-5`: Basic understanding but incomplete.
        *   `6-7`: Good answer with minor gaps.
        *   `8-9`: Strong, comprehensive answer.
        *   `10`: Exceptional, beyond expectations.
    *   Returns structured JSON output:
        ```json
        {
          "score": 8,
          "feedback": "2-3 sentences of feedback",
          "betterAnswer": "detailed model response written as a candidate response"
        }
        ```

### 3. RAG Intelligence Engine (Dossier Search)
*   **Mock Vector Database Logic**:
    To avoid complex vector dependency in local development, the backend implements an in-memory document store chunking the Job Description:
    1.  **Text Splitting**: Splits text into paragraphs using double newlines (`\n\n`), ignoring paragraphs shorter than 30 characters.
    2.  **Sentence Splitting**: If a paragraph is longer than 500 characters, it splits it into sentences using regex (`[^.!?]+[.!?]+`). Group sentences into chunks capped under 400 characters.
    3.  **Keyword Scoring Index**: Scores retrieved chunks against queries. Split query text into lowercase keywords (filtering out stop words shorter than 3 characters). Rank chunks based on frequency of query words.
    4.  **Retrieval**: Selects top 3 highest scoring chunks. If no matches are found, it falls back to returning the first 3 chunks of the job description.
    5.  **LLM Prompting**: Prompts LLM to answer the candidate's query using only the retrieved context chunks, limiting responses to a maximum of 3 sentences.

---

## 🛠️ 7. Flutter Mobile Project Setup Recommendations

To match this setup in Flutter, structure your codebase as follows:

```text
lib/
├── core/
│   ├── api/
│   │   ├── dio_client.dart       -> Configures base URL, interceptors, and Bearer token headers
│   │   └── api_endpoints.dart    -> String constants for routes (/sessions, /evaluate, etc.)
│   ├── theme/
│   │   └── app_theme.dart        -> Vault AI custom colors, Space Grotesk/Inter fonts, and styling tokens
│   └── utils/
│       └── local_storage.dart    -> Caches drafts and user settings using shared_preferences
├── features/
│   ├── auth/
│   │   ├── screens/              -> SignInScreen, SignUpScreen, OTPScreen
│   │   └── controller/           -> Auth state logic (Clerk token persistence)
│   ├── home/
│   │   ├── screens/              -> HomeScreen, HistoryScreen
│   │   └── controller/           -> Session management logic
│   ├── practice/
│   │   ├── screens/              -> PracticeScreen, MockInterviewScreen, ResultsScreen
│   │   └── controller/           -> Active questionnaire and scoring state
│   ├── chat/
│   │   ├── screens/              -> ChatScreen
│   │   └── controller/           -> RAG message history state
│   ├── settings/
│   │   ├── screens/              -> PrivacyPolicyScreen, TermsScreen
│   │   └── widgets/              -> DeleteAccountModal, PolicyContent
│   └── common/
│       └── widgets/              -> AppFooter (policy links + delete account button)
└── main.dart                     -> Core Router config (go_router) and Bloc/Provider setups
```

### Recommended Packages
1.  **State Management**: `flutter_bloc` or `flutter_riverpod` to separate API events from UI views.
2.  **API Requests**: `dio` (configured with an interceptor to append authorization header token automatically).
3.  **Storage**: `shared_preferences` (for drafting text cache) and `flutter_secure_storage` (for keeping Clerk tokens secure).
4.  **Animations**: `flutter_animate` (to quickly construct the ambient radial glow scales and expansion cards).
5.  **Icons**: `lucide_icons` (for exact visuals match).
6.  **Routing**: `go_router` (for deep linking and route guards matching `/practice/:sessionId` routes).
7.  **URL Launcher**: `url_launcher` (for opening email links in Privacy/Terms contact sections).
8.  **Clerk Flutter SDK**: `clerk_flutter` (for user authentication, profile management, and `user.delete()` in account deletion flow).
