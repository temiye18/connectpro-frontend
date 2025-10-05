# ConnectPro Frontend

A modern, real-time video conferencing web application built with Next.js 15, React 19, and TypeScript.

## 🚀 Features

- **Instant Meetings**: Start video meetings with one click
- **Guest Join**: Join meetings without creating an account
- **Real-time Video & Audio**: High-quality video conferencing with WebRTC
- **Meeting Chat**: In-meeting text chat for seamless communication
- **Participant Management**: View and manage meeting participants
- **Screen Sharing**: Share your screen with other participants
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Mode UI**: Modern dark-themed interface for comfortable viewing

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.5.4](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.1.0](https://react.dev/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **State Management**:
  - [TanStack Query v5](https://tanstack.com/query/latest) - Server state
  - [Zustand](https://zustand-demo.pmnd.rs/) - Client state
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Real-time**: [Socket.IO Client](https://socket.io/)
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react)

## 📋 Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd connectpro-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
connectpro-frontend/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                  # Authentication route group
│   │   ├── signin/              # Sign in page
│   │   └── layout.tsx           # Auth layout
│   ├── dashboard/               # Dashboard pages
│   ├── join/                    # Join meeting page
│   ├── guest-join/              # Guest join page
│   ├── meeting/[id]/            # Meeting room (dynamic route)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── src/
│   ├── components/              # Reusable components
│   │   ├── layout/             # Layout components
│   │   ├── meeting/            # Meeting-related components
│   │   ├── providers/          # Context providers
│   │   └── ui/                 # UI components
│   ├── constants/              # Constants and config
│   ├── hooks/                  # Custom React hooks
│   │   ├── queries/           # TanStack Query hooks
│   │   └── mutations/         # TanStack Mutation hooks
│   ├── lib/                    # Utilities and libraries
│   ├── services/               # API service functions
│   └── store/                  # Zustand stores
├── public/                      # Static assets
├── .env.local                   # Environment variables (create this)
├── package.json
└── tsconfig.json
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
```

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL | `http://localhost:5000` |

## 🎨 Key Features & Pages

### Landing Page (`/`)
- Hero section with branding
- "Sign In" and "Start Meeting as Guest" CTAs

### Sign In (`/signin`)
- Email and password authentication
- Form validation
- Redirect to dashboard on success

### Dashboard (`/dashboard`)
- Start instant meetings
- Join existing meetings with code
- View recent meetings
- User profile and notifications

### Join Meeting (`/join`)
- Enter meeting code
- Display name input
- Video/audio preview
- Camera and microphone controls

### Guest Join (`/guest-join`)
- Join without authentication
- Create new meeting as guest
- Quick settings for camera/microphone

### Meeting Room (`/meeting/[id]`)
- Real-time video grid (2x2, 3x3, 4x4 auto-layout)
- Participant sidebar
- In-meeting chat
- Meeting controls (mute, video, share, reactions)
- Recording indicator
- Connection quality indicator

## 🔐 Authentication Flow

1. User signs in via `/signin`
2. JWT token stored client-side
3. Protected routes check authentication
4. Token sent with API requests via Authorization header
5. Guest users can join without authentication

## 📊 State Management

The application uses a hybrid state management approach:

### Server State - TanStack Query v5
- **Queries**: Data fetching with automatic caching and refetching
- **Mutations**: Data updates (login, register, create meeting)
- **Query Keys**: Centralized hierarchical key structure
- **DevTools**: Available in development mode

### Client State - Zustand
- **Auth Store** (`src/store/authStore.ts`):
  - User authentication state
  - JWT token management
  - Persisted to localStorage
- **UI Store** (`src/store/uiStore.ts`):
  - Sidebar, chat, and participants panel visibility
  - UI preferences and toggles

### Architecture
```
├── TanStack Query → Server state (API data, caching)
├── Zustand → Client state (auth, UI preferences)
└── useState → Local component state
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Testing stack:
- Jest for test runner
- React Testing Library for component testing
- jsdom for DOM environment

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean
- Railway

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Related Projects

- [ConnectPro Backend](https://github.com/temiye18/connectpro-backend) - Node.js/Express backend API

## 📧 Support

For support, email akinyemitemiye18@gmail.com or open an issue on GitHub.

