# SERC Website

This is the official website for the Software Engineering Research Center (SERC) at IIIT-Hyderabad.

## 🚀 Features

- Modern, responsive design using Tailwind CSS
- Interactive UI components with Framer Motion animations
- SEO optimized with Next.js metadata
- Blog system with markdown support
- Dynamic people profiles
- Research publications database
- Projects showcase
- Events calendar and management
- Administrative interface for content management

## 📦 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/)
- **UI/UX**: Custom components, toast notifications via react-hot-toast

## 🛠️ Development

### Prerequisites

- Node.js 18+ or 20+ (recommended for Next.js 15)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/SERC-Website.git
   cd SERC-Website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Content Management

### Data Structure

All content is stored in JSON files in the `/public/data` directory:
- `blogs.json`: Blog posts
- `collaborators.json`: Industry and academic partners
- `events.json`: Upcoming and past events
- `papers.json`: Research publications
- `people.json`: Team members
- `projects.json`: Research projects

## 🚢 Deployment

### Static Site Generation

This website is configured for static site generation, making it deployable on any static hosting provider:

1. Build the website:
   ```bash
   npm run build
   ```

2. The static files will be generated in the `/out` directory, ready for deployment.

Use `npm run analyze` to analyze the bundle sizes.

# SERC Website Data Repository

This repository contains the data schemas and content for the Software Engineering Research Center (SERC) website. The following schemas define the structure of our data files.

## Data Schemas

### Papers Schema (`papers.json`)

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "authors": {
        "type": "array",
        "items": { "type": "string" }
      },
      "year": { "type": "string" },
      "title": { "type": "string" },
      "cite": { "type": "string" },
      "venue": { "type": "string" },
      "doi": { "type": "string" },
      "url": { "type": "string" }
    },
    "required": ["authors", "year", "title", "cite", "venue"]
  }
}
```

### Events Schema (`events.json`)

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "number" },
      "name": { "type": "string" },
      "description": { "type": "string" },
      "startTime": { "type": "string", "format": "date-time" },
      "endTime": { "type": "string", "format": "date-time" },
      "location": { "type": "string" },
      "year": { "type": "number" },
      "image": { "type": "string" },
      "presenters": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "required": ["id", "name", "description", "startTime", "endTime", "location", "year"]
  }
}
```

### Collaborators Schema (`collaborators.json`)

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "name": { "type": "string" },
      "logo": { "type": "string" },
      "website": { "type": "string" },
      "description": { "type": "string" },
      "category": { "type": "string", "enum": ["industry", "academic", "government"] }
    },
    "required": ["id", "name", "logo", "website", "description", "category"]
  }
}
```

### Blogs Schema (`blogs.json`)

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "number" },
      "title": { "type": "string" },
      "slug": { "type": "string" },
      "author": { "type": "string" },
      "role": { "type": "string" },
      "date": { "type": "string" },
      "readTime": { "type": "number" },
      "category": { "type": "string" },
      "coverImage": { "type": "string" },
      "excerpt": { "type": "string" },
      "content": { "type": "string" }
    },
    "required": ["id", "title", "slug", "author", "date", "readTime", "category", "excerpt", "content"]
  }
}
```

### Projects Schema (`projects.json`)

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "title": { "type": "string" },
      "slug": { "type": "string" },
      "excerpt": { "type": "string" },
      "description": { "type": "string" },
      "image": { "type": "string" },
      "startDate": { "type": "string" },
      "endDate": { "type": "string" },
      "status": { "type": "string", "enum": ["ongoing", "completed"] },
      "category": { "type": "string" },
      "collaborators": {
        "type": "array",
        "items": { "type": "string" }
      },
      "teamMembers": {
        "type": "array",
        "items": { "type": "string" }
      },
      "publications": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "required": ["id", "title", "slug", "description"]
  }
}
```

### People Schema (`people.json`)

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "name": { "type": "string" },
      "role": { "type": "string" },
      "category": { "type": "string" },
      "bio": { "type": "string" },
      "image": { "type": "string" },
      "email": { "type": "string" },
      "website": { "type": "string" },
      "socialMedia": {
        "type": "object",
        "properties": {
          "linkedin": { "type": "string" },
          "twitter": { "type": "string" },
          "github": { "type": "string" },
          "googleScholar": { "type": "string" }
        }
      },
      "interests": {
        "type": "array",
        "items": { "type": "string" }
      },
      "projects": {
        "type": "array",
        "items": { "type": "string" }
      }
    },
    "required": ["id", "name", "role", "category"]
  }
}
```

For more admin details, please refer to the [Admin Interface Documentation](admin.md).
