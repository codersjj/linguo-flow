# LinguoFlow

A premium English speaking course platform designed for structured learning with progress tracking, spaced repetition, and comprehensive analytics.

## 📋 Overview

LinguoFlow is a full-stack web application that provides a curated English learning experience through video, audio, and text-based lessons organized by proficiency levels. The platform includes user authentication, progress tracking, daily streak calculations, and an admin panel for content management.

## ✨ Core Features

### Learning Platform
- **Structured Curriculum**: Three-tier course organization (Intermediate → Advanced → Movies & TV)
- **Multiple Content Types**: Support for audio, video, mixed media, and text-based lessons
- **Progress Tracking**: Automatic completion tracking with spaced repetition logic
- **Daily Streak System**: Current streak, longest streak, and total active days tracking
- **Lesson Review**: Built-in transcript/notes viewer with toggle visibility
- **Full-Text Search**: Fuzzy search across lesson titles, descriptions, and transcripts using Fuse.js

### User Management
- **Email/Password Authentication**: Secure sign-up and sign-in with email verification
- **Guest Mode**: Browse lessons without account creation (data not persisted)
- **Session Management**: Better Auth integration with email OTP verification
- **Password Reset**: OTP-based password recovery flow
- **User Dashboard**: Personalized view with progress metrics and learning statistics

### Progress Analytics
- **Learning Activity Chart**: Visual bar chart showing completed lessons and review counts per stage
- **Stats Dashboard**: Total lessons, completed count, and total reviews aggregation
- **Study Activity Logging**: Automatic tracking of complete/review actions with timestamps
- **Streak Calculations**: Current streak, longest historical streak, and total active days

### Admin Panel
- **Lesson Management**: Create, read, update, and delete lessons
- **File Upload**: Built-in media and thumbnail file upload with UUID naming
- **Form Validation**: Zod-based schema validation for lesson data
- **Admin Authorization**: Role-based access control with email verification

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 with React 19.2.0
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: Lucide React icons, custom Button components
- **State Management**: React Context API (StoreContext)
- **Search**: Fuse.js for fuzzy full-text search
- **Charts**: Recharts for data visualization
- **Form Handling**: React Server Components with useActionState

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Database Adapter**: Prisma PG adapter
- **Authentication**: Better Auth with Email OTP plugin
- **Email Service**: Resend for transactional emails
- **Validation**: Zod schema validation
- **File Upload**: Node.js fs module for server-side file operations

### DevOps & Build
- **Package Manager**: npm
- **Build Tool**: Next.js with TypeScript
- **Linting**: ESLint with Next.js core-web-vitals config
- **Testing**: Vitest + React Testing Library
- **Environment**: Dotenv for configuration management

## 🏗 Architecture

### Project Structure

```
LinguoFlow/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel (protected routes)
│   │   ├── [id]/edit/           # Lesson edit page
│   │   ├── create/              # Lesson creation page
│   │   ├── layout.tsx           # Admin layout with role check
│   │   └── page.tsx             # Lessons management dashboard
│   ├── api/
│   │   ├── auth/[...all]/       # Better Auth API routes
│   │   └── seed/                # Database seeding endpoint
│   ├── auth/
│   │   ├── forgot-password/     # Password recovery page
│   │   └── page.tsx             # Auth form (sign-in/sign-up)
│   ├── lesson/[id]/             # Individual lesson player
│   ├── stage/[stage]/           # Stage view (all lessons in a stage)
│   ├── page.tsx                 # Main dashboard
│   ├── layout.tsx               # Root layout with session/progress loading
│   └── globals.css              # Global Tailwind styles
│
├── components/
│   ├── AuthForm.tsx             # Sign-in/Sign-up/Verification forms
│   ├── ClientLayout.tsx         # Client-side wrapper with providers
│   ├── DashboardClient.tsx      # Main dashboard view
│   ├── DeleteLessonButton.tsx   # Lesson deletion UI
│   ├── LessonClientWrapper.tsx  # Lesson player container
│   ├── LessonForm.tsx           # Admin lesson creation/edit form
│   ├── Navbar.tsx               # Navigation bar with search
│   ├── ProgressChart.tsx        # Learning activity bar chart
│   ├── SearchModal.tsx          # Full-text lesson search modal
│   ├── StageViewClient.tsx      # Stage lessons list view
│   ├── ui/
│   │   ├── Button.tsx           # Reusable button component
│   │   └── SubmitButton.tsx     # Form submit button with loading state
│   └── __tests__/
│       └── Button.test.tsx      # Unit test example
│
├── actions/
│   ├── admin.ts                 # Server actions: createLesson, updateLesson, deleteLesson
│   ├── auth.ts                  # Server actions: enableGuestAccess, logout, clearGuestMode
│   ├── progress.ts              # Server actions: markLessonComplete, undoLessonComplete
│   └── upload.ts                # Server action: uploadFile
│
├── context/
│   └── StoreContext.tsx         # Global React Context for app state
│
├── lib/
│   ├── auth.ts                  # Better Auth server configuration
│   ├── auth-client.ts           # Better Auth client initialization
│   ├── db.ts                    # Mock database layer (legacy)
│   ├── prisma.ts                # Prisma client initialization
│   ├── session.ts               # Session management utilities
│   ├── sortLessons.ts           # Lesson sorting algorithm
│   └── utils.ts                 # Utility functions (cn helper)
│
├── constants/
│   └── lessons.ts               # Mock lesson data and stage labels
│
├── types/
│   └── index.ts                 # TypeScript interfaces and types
│
├── services/
│   └── geminiService.ts         # Google Gemini AI integration (demo)
│
├── prisma/
│   ├── schema.prisma            # Database schema (User, Lesson, Progress, etc.)
│   └── seed.ts                  # Database seeding script
│
├── scripts/
│   ├── run-migration.ts         # Database migration runner
│   └── update-admin-password.ts # Admin password update script
│
├── docs/
│   └── ADMIN_SETUP.md           # Admin access configuration guide
│
├── public/
│   └── [SVG icons and assets]
│
├── .gitignore
├── middleware.ts                 # Next.js middleware (auth redirect)
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies and scripts
├── eslint.config.mjs            # ESLint rules
└── vitest.config.ts             # Vitest configuration
```

### Data Flow

```
┌─────────────────────────────────────────┐
│         User Browser/Client             │
└────────────────┬────────────────────────┘
                 │
         ┌──────▼──────┐
         │ Next.js App │
         └──────┬──────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
 Pages      Components   Server Actions
 (SSR)      (CSR/SSR)    (RPC)
    │            │            │
    └────────────┼────────────┘
                 │
         ┌──────▼──────────┐
         │ Prisma ORM      │
         └──────┬──────────┘
                 │
         ┌──────▼──────────┐
         │ PostgreSQL DB   │
         └─────────────────┘
```

### Authentication Flow

```
User Registration
    │
    ├─► Email/Password Sign-up
    │
    ├─► Better Auth generates OTP
    │
    ├─► Resend sends verification email
    │
    ├─► User enters OTP
    │
    └─► Email verified → Authenticated Session Created

User Login
    │
    ├─► Email/Password verification
    │
    ├─► If not verified → Auto-send OTP flow
    │
    └─► Session cookie set (better-auth.session_token)

Guest Mode
    │
    └─► Set guest-mode=true cookie → Data stored in-memory only
```

## 📊 Database Schema

### Core Tables

**User**
- id (UUID, primary key)
- email (unique string)
- emailVerified (boolean)
- name (string)
- password (hashed string)
- createdAt, updatedAt (timestamps)

**Lesson**
- id (UUID, primary key)
- title, description (string)
- stage (enum: intermediate | advanced | movies)
- type (enum: audio | video | mixed | text)
- duration, thumbnail, mediaUrl (string)
- transcript, textContent (text)

**Progress**
- id (auto-increment, primary key)
- userId, lessonId (foreign keys)
- isCompleted (boolean)
- lastReviewedDate (timestamp)
- reviewCount (integer)
- unique constraint: (userId, lessonId)

**StudyActivity**
- id (UUID, primary key)
- userId, lessonId (foreign keys)
- activityType (COMPLETE | REVIEW)
- createdAt (timestamp)
- indexes: (userId, createdAt)

**Session, Account, Verification**
- Better Auth managed tables for authentication

## 🚀 Key Features Implementation

### Spaced Repetition Logic
- Tracks daily reviews per lesson
- Increments review count only once per day
- Maintains last reviewed date
- Calculates current and longest streaks from StudyActivity logs
- Prevents duplicate reviews within 24-hour period

### Progress Synchronization
- Server-side: Database-backed progress for authenticated users
- Client-side: In-memory progress for guests via React Context
- Optimistic updates for instant UI feedback
- Server confirmation with fallback revert on error

### Search Implementation
- Fuse.js fuzzy matching on titles (70% weight), descriptions (50%), and transcripts (30%)
- Configurable threshold for match sensitivity
- Real-time search with debouncing
- Results sorted by relevance score

### Streak Calculation
- Current streak: Days since last activity (continuous chain)
- Longest streak: Historical maximum consecutive days
- Total active days: Count of unique study dates
- Calculated from StudyActivity table on server load

## 🔐 Security & Auth

### Session Management
- Better Auth: Industry-standard authentication library
- HTTP-only cookies: `better-auth.session_token` (development), `__Secure-better-auth.session_token` (production)
- Legacy support: Checks for old JWT `session` cookie
- Guest mode: Temporary in-memory session via `guest-mode` cookie

### Password Security
- Bcryptjs hashing (10 salt rounds)
- Minimum 6 character requirement
- OTP-based password reset (10-minute expiry)

### Authorization
- Admin routes protected: Email check in `app/admin/layout.tsx`
- Middleware protection: Redirects unauthenticated users to `/auth`
- Server action validation: Checks session before data mutations

### Email Verification
- OTP sent via Resend email service
- 600-second (10-minute) expiry
- Prevents account access until verified
- Auto-verification OTP on failed login

## 🎯 Main User Workflows

### Learning Workflow
1. User navigates to dashboard
2. Views progress across 3 course stages
3. Clicks lesson to open player
4. Watches video/audio or reads text content
5. Views transcript/notes alongside media
6. Marks lesson as complete
7. System records completion + increments streak

### Admin Workflow
1. Admin logs in with verified email
2. Navigates to `/admin` dashboard
3. Views all lessons in table format
4. Creates new lesson with form validation
5. Uploads media files (auto-generated UUIDs)
6. Edits existing lesson details
7. Deletes lesson (cascades to progress records)

### Search Workflow
1. User presses Cmd+K or clicks search bar
2. Enters search query
3. Fuse.js performs fuzzy match across lessons
4. Results displayed with relevance sorting
5. Clicking result navigates to lesson

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Resend API key (for emails)
- Environment variables configured

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/linguoflow

# Authentication
ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com

# Email Service
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@linguoflow.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation Steps
```bash
# Clone repository
git clone <repo-url>
cd linguoflow

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data
npm run seed

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Watch mode
npm run test -- --watch
```

## 📈 Performance Optimizations

- **Image Optimization**: Picsum.photos placeholder URLs (replaceable with optimized CDN)
- **Server-Side Rendering**: Initial page loads with cached data
- **Incremental Static Regeneration**: Lesson pages cached with revalidation
- **Client-Side Caching**: React Context prevents refetching progress
- **Database Indexing**: StudyActivity (userId, createdAt) index for streak queries
- **Code Splitting**: Automatic via Next.js

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode Ready**: CSS variables configured in globals.css
- **Keyboard Shortcuts**: Cmd+K for search (cross-platform)
- **Optimistic Updates**: Instant feedback on actions
- **Loading States**: Button spinners and disabled states during actions
- **Error Boundaries**: Graceful error handling with user alerts
- **Accessibility**: Semantic HTML, ARIA labels, focus states

## 🚀 Deployment

The application is optimized for Vercel deployment:

```bash
# Build for production
npm run build

# Start production server
npm start
```

**Deployment Checklist**
- Environment variables configured in Vercel dashboard
- PostgreSQL database provisioned (e.g., Neon, Railway, AWS RDS)
- Resend account set up with verified email domain
- Admin email configured

## 📝 API Routes

### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `POST /api/auth/email-otp/send` - Send OTP
- `POST /api/auth/email-otp/verify` - Verify OTP

### Data
- `GET /api/seed` - Database seeding (development only)

### Server Actions (RPC)
- `createLesson()` - Create lesson (admin)
- `updateLesson()` - Update lesson (admin)
- `deleteLesson()` - Delete lesson (admin, cascades progress)
- `markLessonComplete()` - Mark lesson done
- `undoLessonComplete()` - Undo completion
- `uploadFile()` - Upload media file

## 🔄 State Management

### Global State (React Context)
```typescript
interface StoreContextType {
  user: User | null;
  progress: Record<string, UserProgress> | null;
  streak: number;
  longestStreak: number;
  totalActiveDays: number;
  lessons: Lesson[];
  isLoading: boolean;
  isLoggingOut: boolean;
  // Methods...
}
```

### Local Component State
- Form input states (email, password, OTP)
- UI toggles (transcript visibility, menu open/close)
- Loading/pending states during async operations

## 🐛 Known Limitations

- AI explanation service (Gemini) not fully integrated into UI
- Admin password update script requires manual execution
- Mock lesson data uses placeholder video URLs
- Guest mode data lost on browser close
- No offline-first support

## 🔮 Future Enhancements

- AI-powered vocabulary extraction
- Pronunciation feedback using Web Speech API
- Social features (leaderboards, study groups)
- Mobile app (React Native)
- Advanced analytics dashboard
- Adaptive difficulty based on performance
- Spaced repetition algorithm customization
- Lesson recommendations via ML

## 📄 License

Private project. See repository for details.

## 👥 Admin Setup

For detailed admin configuration, see [ADMIN_SETUP.md](./docs/ADMIN_SETUP.md)

Key points:
- Set `ADMIN_EMAIL` environment variable
- Set `NEXT_PUBLIC_ADMIN_EMAIL` to same value
- Admin button appears in navbar for verified admins
- Protected routes redirect non-admins to home

## 🤝 Contributing

(Guidelines for contributors, if applicable)

## 📞 Support

For issues or questions, please refer to project documentation or contact the development team.

---

**Last Updated**: November 2025
**Version**: 0.1.0