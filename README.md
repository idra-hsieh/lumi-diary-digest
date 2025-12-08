# **Lumi Diary Digest**

Lumi Diary Digest is a modern personal journaling application built with **Next.js 16**.  
It integrates secure user authentication, an intuitive editing interface, and **AI-assisted analysis** using the **Google Gemini model** to provide users with deep self-reflection and emotional insights.

## **Project Overview**

This project aims to provide a private and intelligent diary platform.  
Users can write and manage daily entries and interact with an integrated AI interface to query past diary content.  
The system generates summaries, psychological insights, and reflection prompts based on the user’s historical records.

## **Core Features**

### **1. User Authentication & Authorization**
- Secure login, registration, and session management via **Supabase Auth**.

### **2. Diary Management System**
- Full CRUD support (Create, Read, Update, Delete) for diary entries.

### **3. AI Intelligent Analysis**
- Uses **Google Generative AI (Gemini 2.5 Flash)** for:
  - Summaries  
  - Psychological insights  
  - Reflection prompts  

### **4. Real-time Search**
- **Fuse.js** fuzzy search for fast retrieval of titles and content.

### **5. Modern Interface**
- Built with **Shadcn UI** and **Tailwind CSS 4**
- Responsive design, light/dark mode support

### **6. Database Integration**
- **Prisma ORM + PostgreSQL** for scalable data management

## **Technical Stack**

| Category | Technologies |
|---------|--------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database & ORM | PostgreSQL, Prisma |
| Backend Services & Auth | Supabase |
| Artificial Intelligence | Google Gemini AI SDK (`@google/genai`) |
| Styling & UI | Tailwind CSS 4, Shadcn UI (Radix UI), Lucide React |
| Utilities | Zod, Fuse.js, Sonner |


## **Prerequisites**

Ensure your environment includes:

- **Node.js v20+**
- npm or yarn
- A running **PostgreSQL** instance


## **Project Structure**
```bash
Copy code
actions/           # Server Actions for auth, diary CRUD, AI integration
app/               # Next.js App Router pages, layouts, styling
components/        # Reusable UI components (Shadcn + custom)
db/                # Prisma schema and client
hooks/             # Custom React hooks (e.g. useDiary)
lib/               # Utilities and constants
utils/supabase/    # Supabase client initialization
```

## **Commands**
- **npm run dev:**	Start dev server
- **npm run build:**	Build production app
- **npm run start:**	Run production build
- **npm run lint:**	Run ESLint
- **npm run migrate:**	Run database migrations

## **License**
MIT License