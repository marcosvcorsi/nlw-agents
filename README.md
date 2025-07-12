# NLW Agents

A real-time audio recording and AI-powered question-answering application built with React, Fastify, and PostgreSQL with vector search capabilities.

## 🏗️ Project Structure

This monorepo contains two main projects:

- **`web/`** - React frontend application
- **`server/`** - Fastify backend API server

## 🚀 Features

### Web Application

- **Room Management**: Create and manage audio recording rooms
- **Real-time Audio Recording**: Record audio directly in the browser
- **Audio Playback**: Listen to recorded audio files
- **Modern UI**: Built with React 19, Tailwind CSS, and Radix UI components
- **Type Safety**: Full TypeScript support with Zod validation

### Server Application

- **RESTful API**: Fastify-based API with automatic request/response validation
- **Database Integration**: PostgreSQL with Drizzle ORM and vector search
- **AI Integration**: Google Gemini AI for question answering
- **Audio Processing**: Handle audio file uploads and processing
- **CORS Support**: Configured for cross-origin requests

## 🛠️ Tech Stack

### Frontend (Web)

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons

### Backend (Server)

- **Fastify** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **pgvector** - Vector search extension
- **Google Gemini AI** - AI question answering
- **Zod** - Schema validation
- **Docker** - Containerization

## 📋 Prerequisites

- **Node.js** (v22 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **Google Gemini API Key**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nlw-agents
```

### 2. Set Up the Database

Navigate to the server directory and start the PostgreSQL database with vector support:

```bash
cd server
docker-compose up -d
```

This will start a PostgreSQL instance with pgvector extension on port 5435.

### 3. Set Up Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env  # if example exists, or create manually
```

Add the following environment variables:

```env
PORT=3333
DATABASE_URL=postgresql://docker:docker@localhost:5435/agents
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Install Dependencies

Install dependencies for both projects:

```bash
# Install server dependencies
cd server
npm install

# Install web dependencies
cd ../web
npm install
```

### 5. Set Up the Database Schema

Run database migrations and seed data:

```bash
cd server
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 6. Start the Development Servers

#### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3333`

#### Start the Frontend Application

```bash
cd web
npm run dev
```

The web application will start on `http://localhost:5173`

## 📚 API Endpoints

### Rooms

- `GET /rooms` - Get all rooms
- `POST /rooms` - Create a new room
- `GET /rooms/:id/questions` - Get questions for a specific room

### Questions

- `POST /questions` - Create a new question

### Audio

- `POST /upload-audio` - Upload audio file

### Health

- `GET /health` - Health check endpoint

## 🗄️ Database Schema

The application uses the following main entities:

- **Rooms**: Audio recording sessions
- **Questions**: AI-generated questions from audio content
- **Audio Chunks**: Processed audio segments for vector search

## 🐳 Docker Support

The server includes Docker configuration for easy deployment:

```bash
cd server
docker-compose up -d
```

## 📝 Available Scripts

### Server Scripts

- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data

### Web Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting

## 🔧 Development

### Code Quality

Both projects use:

- **Biome** - Code formatting and linting
- **TypeScript** - Type checking
- **Zod** - Runtime type validation

### Project Structure

#### Web Application Structure

```
web/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route components
│   ├── lib/           # Utility libraries
│   ├── utils/         # Helper functions
│   └── app.tsx        # Main application component
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

#### Server Application Structure

```
server/
├── src/
│   ├── routes/        # API route handlers
│   ├── services/      # Business logic
│   ├── database/      # Database schemas and migrations
│   ├── env.ts         # Environment configuration
│   └── server.ts      # Server entry point
├── docker/            # Docker configuration
└── package.json       # Dependencies and scripts
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License and is publicly available.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information about your problem
3. Include steps to reproduce the issue and any error messages
