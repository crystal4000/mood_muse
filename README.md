# 🌌 MoodMuse

> _When words aren't enough._

Transform your emotions into personalized Spotify playlists and dreamy AI-generated art. MoodMuse creates beautiful, shareable moodboards that capture the depth of human feelings through music and visual storytelling.

<img width="1512" height="856" alt="Screenshot 2025-07-26 at 3 28 51 PM" src="https://github.com/user-attachments/assets/25c73095-baa9-4926-bdaf-448c6422f152" />
<img width="1508" height="857" alt="Screenshot 2025-07-26 at 3 28 42 PM" src="https://github.com/user-attachments/assets/eec742d6-8631-41b9-a2ec-b583558c9987" />
<img width="1512" height="858" alt="Screenshot 2025-07-26 at 3 28 22 PM" src="https://github.com/user-attachments/assets/194be193-3aaa-4786-b891-54eb8f338401" />

## ✨ Features

### 🎵 **AI-Powered Music Curation**

- Real-time Spotify API integration with track search and previews
- Context-aware playlist generation based on mood analysis
- 30-second track previews with play/pause functionality
- Direct Spotify integration with "Open in Spotify" links
- Smart fallback system for tracks not found on Spotify

### 🎨 **Contextual Visual Generation**

- DALL-E 3 powered image creation with 4 distinct artistic styles:
  - **Lifestyle Photography**: Aesthetic flat lays and real-world scenarios
  - **Nature Scenes**: Landscapes and environments that match the mood
  - **Interior Aesthetics**: Spaces and architectural details
  - **Fashion & Style**: Outfits and beauty shots that embody emotions
- Story-driven prompts that capture specific situations, not just abstract emotions
- Pinterest-style mood board aesthetic

### 💫 **Emotional Intelligence**

- GPT-4 powered mood analysis and poetic interpretation
- Contextually aware responses that understand relationship dynamics, situations, and scenarios
- Beautiful, empathetic captions that feel like your inner voice
- Nuanced understanding of complex emotional states

### 🔗 **Social Sharing & Persistence**

- Shareable moodboard links with unique aesthetic URLs (`moodmuse.app/board/dreamy-melody-42`)
- Supabase-powered database for persistent storage
- View count tracking and creation timestamps
- Download moodboards as JSON files
- Native mobile sharing integration with clipboard fallback

### 🎯 **User Experience**

- Responsive design optimized for mobile, tablet, and desktop
- Dark/light theme toggle with system preference detection
- Smooth animations and micro-interactions
- Toast notification system for user feedback
- Loading states with beautiful progress indicators
- Error handling with graceful fallbacks and retry options

## 🛠️ Tech Stack

### **Frontend Framework**

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - useState, useEffect, useContext for state management

### **AI & Machine Learning**

- **OpenAI GPT-4** - Mood analysis and poetic caption generation
- **DALL-E 3** - AI image generation with contextual prompts
- **Custom prompt engineering** - Story-driven visual narrative creation

### **Music Integration**

- **Spotify Web API** - Track search, metadata, and preview URLs
- **Client Credentials Flow** - Server-to-server authentication
- **Preview audio playback** - HTML5 audio with custom controls

### **Database & Backend**

- **Supabase** - PostgreSQL database with real-time features
- **Row Level Security** - Public read/write policies for moodboards
- **Serverless functions** - API routes for data processing

### **UI/UX Libraries**

- **Lucide React** - Beautiful, consistent icons
- **Custom toast system** - Native-feeling notifications
- **CSS animations** - Smooth transitions and hover effects

### **Development Tools**

- **ESLint** - Code linting and quality
- **Prettier** - Code formatting (optional)
- **Git** - Version control
- **Vercel** - Deployment and hosting

## 📦 Dependencies

### **Core Dependencies**

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0"
}
```

### **Styling & UI**

```json
{
  "tailwindcss": "^3.0.0",
  "lucide-react": "^0.263.1",
  "@tailwindcss/typography": "^0.5.0"
}
```

### **API Integrations**

```json
{
  "@supabase/supabase-js": "^2.38.0"
}
```

### **Development**

```json
{
  "eslint": "^8.0.0",
  "eslint-config-next": "^14.0.0",
  "@types/node": "^20.0.0",
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0"
}
```

## 🏗️ Project Structure

```
moodmuse/
├── src/
    ├── app/                         # Next.js App Router
    │   ├── board/[id]/              # Dynamic shared moodboard pages
    │   │   └── page.tsx             # Shared moodboard view
    │   ├── globals.css              # Global styles and Tailwind
    │   ├── layout.tsx               # Root layout with metadata
    │   └── page.tsx                 # Main application page
    ├── components/                  # Reusable React components
    # UI primitives
    │   ├── Toast.tsx                # Toast notification system
    # Homepage components
    │   ├── FeatureCard.tsx          # Feature showcase cards
    │   ├──  Landing.tsx             # Landing section component
    # Mood input components
    │   ├── MoodInputForm.tsx        # Mood input form
    # Moodboard results
    │   ├── MoodBoardResults.tsx     # Main results display
    │   ├── PlaylistTrack.tsx        # Individual track component
    │   ├── Header.tsx               # Application header
    │   ├── LoadingMoodboard.tsx     # Loading state component
    │   └── MockData.ts              # Fallback mock data
    ├── lib/                         # Utility libraries and services
    │   ├── openai.ts                # OpenAI API integration
    │   ├── spotify.ts               # Spotify API integration
    │   └── supabase.ts              # Supabase database service
    ├── types/                       # TypeScript type definitions
    │   └── index.ts                 # Shared interfaces and types
├── public/                      # Static assets
├── tailwind.config.ts           # Tailwind CSS configuration
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🔧 Installation & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/crystal4000/mood_muse.git
cd moodmuse
```

### **2. Install Dependencies**

```bash
npm install
# or
yarn install
```

### **3. Environment Variables**

Create a `.env` file in the root directory:

```bash
# OpenAI API (Required for AI features)
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key

# Spotify API (Required for music integration)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your-spotify-client-id
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# Supabase (Required for sharing features)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Base URL (for sharing functionality)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### **4. Database Setup (Supabase)**

Run this SQL in your Supabase SQL editor:

```sql
-- Create moodboards table
CREATE TABLE moodboards (
  id TEXT PRIMARY KEY,
  original_mood TEXT NOT NULL,
  poetic_caption TEXT NOT NULL,
  playlist JSONB NOT NULL,
  images JSONB NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE moodboards ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON moodboards
FOR SELECT USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" ON moodboards
FOR INSERT WITH CHECK (true);

-- Allow public update access for view count
CREATE POLICY "Allow public update access" ON moodboards
FOR UPDATE USING (true);
```

### **5. API Setup**

#### **OpenAI Setup:**

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add billing information (pay-per-use)
4. Add key to `.env.local`

#### **Spotify Setup:**

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app named "MoodMuse"
3. Set redirect URI: `https://localhost:3000/callback`
4. Copy Client ID and Client Secret to `.env`

#### **Supabase Setup:**

1. Create account at [Supabase](https://supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy URL and anon key to `.env`
5. Run the SQL schema above

### **6. Run Development Server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### **Vercel Deployment (Recommended)**

1. **Connect to Vercel:**

   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables:**
   In Vercel dashboard → Settings → Environment Variables, add all variables from `.env`

3. **Update Base URL:**

   ```bash
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

4. **Update Spotify Redirect URI:**
   Add your production URL to Spotify app settings:
   ```
   https://your-app.vercel.app/callback
   ```

### **Custom Domain Setup**

1. Add domain in Vercel dashboard
2. Update environment variables with new domain
3. Update Spotify app settings
4. Update Supabase URL configuration

## 🎨 Architecture Deep Dive

### **State Management**

- **React Context** for toast notifications
- **useState/useEffect** for component state
- **localStorage** for theme persistence
- **Supabase** for shared state persistence

### **API Integration Patterns**

- **Service Layer Pattern** - Separate files for each API
- **Error Boundary Pattern** - Graceful fallbacks for API failures
- **Loading State Pattern** - Beautiful loading indicators
- **Retry Pattern** - User-friendly error recovery

### **Image Generation Pipeline**

1. **Mood Analysis** - GPT-4 extracts context and emotion
2. **Prompt Generation** - Creates 4 style-specific prompts
3. **DALL-E Generation** - Parallel image creation
4. **Fallback Handling** - Unsplash images if generation fails
5. **Style Variation** - Lifestyle, Nature, Interior, Fashion

### **Music Discovery Algorithm**

1. **Contextual Analysis** - Understand situation behind emotion
2. **Multi-Stage Search** - Exact match → Fuzzy match → Mood search
3. **Preview Integration** - 30-second audio samples
4. **Spotify Linking** - Direct deep links to full tracks

### **Responsive Design Strategy**

- **Mobile-First** - Designed for touch interactions
- **Progressive Enhancement** - Features scale up with screen size
- **Icon-Only Mobile** - Clean button design on small screens
- **Content Reordering** - Optimal information hierarchy per device

## 🧪 Testing & Quality

### **Error Handling**

- API rate limiting and retry logic
- Graceful degradation when services fail
- User-friendly error messages
- Fallback content for all features

### **Performance Optimizations**

- Image lazy loading and optimization
- API request caching
- Minimal JavaScript bundle size
- Server-side rendering for shared pages

### **Accessibility**

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

## 🔮 Future Enhancements

### **Personalization**

- [ ] Mood history and analytics
- [ ] Personal mood patterns over time
- [ ] Suggested moods based on usage
- [ ] Custom mood templates

### **Social Features**

- [ ] Like/heart shared moodboards
- [ ] Trending moods
- [ ] Community mood challenges
- [ ] Mood of the day feature

### **Advanced AI**

- [ ] Emotion detection from photos
- [ ] Voice mood analysis
- [ ] Mood prediction based on patterns
- [ ] Collaborative AI mood sessions

### **Enhanced Sharing**

- [ ] Instagram Story integration
- [ ] Moodboard image export
- [ ] Collaborative moodboards
- [ ] Mood journaling features

## 🏆 Hackathon Criteria Alignment

### **Unmistakably Human** ✅

- Focuses on emotional depth and poetry
- Prioritizes feeling over optimization
- Creates genuine emotional connections

### **Philosophical Edge** ✅

- Explores AI's ability to understand human emotion
- Questions the limits of language vs. art
- "When words aren't enough" concept

### **Technical Craft** ✅

- Production-ready code with proper architecture
- Multiple API integrations working seamlessly
- Thoughtful UX and error handling

### **Community Impact** ✅

- Shareable, viral-ready content
- Helps people feel seen and understood
- Builds connections through emotion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and DALL-E 3 APIs
- **Spotify** for Web API and music data
- **Supabase** for database and authentication
- **Vercel** for seamless deployment
- **CS Girlies Global Hackathon** for the inspiration

## 📞 Support

For support, email amandawork2022@gmail.com or create an issue in this repository.

---

<div align="center">
  
**Built with 💜 by [Tania-Amanda]**
  
*"When words aren't enough."*

</div>
