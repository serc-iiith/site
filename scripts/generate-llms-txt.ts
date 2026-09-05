import fs from 'fs';
import path from 'path';

// Define TS types matching our data structure
interface BlogPost {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
}

interface NewsEvent {
  slug: string;
  name: string;
  summary?: string;
  startTime: string;
}

interface Person {
  name: string;
  title: string;
  slug: string;
}

interface Project {
  title: string;
  description?: string;
}

interface Paper {
  title: string;
  authors: string[] | string;
  year: string;
  url?: string;
}

const dataDir = path.join(__dirname, '../public/data');
const outputFile = path.join(__dirname, '../public/llms.txt');

try {
  const blogs: BlogPost[] = JSON.parse(fs.readFileSync(path.join(dataDir, 'blogs.json'), 'utf8'));
  const news: NewsEvent[] = JSON.parse(fs.readFileSync(path.join(dataDir, 'news.json'), 'utf8'));
  const peopleData: Record<string, Person[]> = JSON.parse(fs.readFileSync(path.join(dataDir, 'people.json'), 'utf8'));
  const projects: Project[] = JSON.parse(fs.readFileSync(path.join(dataDir, 'projects.json'), 'utf8'));
  const papers: Paper[] = JSON.parse(fs.readFileSync(path.join(dataDir, 'papers.json'), 'utf8'));
  
  let content = `# Software Engineering Research Center (SERC), IIIT Hyderabad\n\n`;
  content += `This is the directory of resources for the Software Engineering Research Center (SERC) at the International Institute of Information Technology, Hyderabad. SERC focuses on building human-centered, intelligent, reliable, and sustainable software systems.\n\n`;
  
  content += `## Primary Routes\n`;
  content += `- [About Us](https://serc.iiit.ac.in/about-us): Mission, vision, and key research commitments of SERC.\n`;
  content += `- [People](https://serc.iiit.ac.in/people): Faculty members, PhD scholars, research students, and alumni.\n`;
  content += `- [Research & Publications](https://serc.iiit.ac.in/research): Academic publications in conferences and journals.\n`;
  content += `- [Projects](https://serc.iiit.ac.in/projects): Ongoing and past software engineering research projects.\n`;
  content += `- [News & Events](https://serc.iiit.ac.in/news): Announcements, thesis defenses, workshops, and admissions open updates.\n`;
  content += `- [Blog](https://serc.iiit.ac.in/blog): Research insights, student experience stories, and technical posts.\n`;
  content += `- [Contact Us](https://serc.iiit.ac.in/contact): Physical address, email, and coordinates.\n\n`;

  content += `## Research Areas\n`;
  content += `- Formal Methods & Program Analysis\n`;
  content += `- Human-Computer Interaction (HCI) & Design\n`;
  content += `- Software Engineering for AI & Machine Learning\n`;
  content += `- Self-Adaptive & Sustainable Software Systems\n`;
  content += `- Internet of Things (IoT) & Smart Cities\n`;
  content += `- Gamification & Software Engineering Education\n\n`;

  content += `## Faculty & Key Members\n`;
  for (const [category, people] of Object.entries(peopleData)) {
    if (category === 'Faculty' || category === 'PhD Students' || category === 'PhD Scholars') {
      content += `### ${category}\n`;
      people.forEach(p => {
        content += `- [${p.name}](https://serc.iiit.ac.in/people/${p.slug}): ${p.title}\n`;
      });
      content += `\n`;
    }
  }

  content += `## Projects Showcase\n`;
  projects.forEach(p => {
    content += `- **${p.title}**: ${p.description || ''}\n`;
  });
  content += `\n`;

  content += `## Recent Publications (Top 25)\n`;
  // Sort papers by year descending
  const sortedPapers = [...papers]
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
    .slice(0, 25);
  sortedPapers.forEach(p => {
    const authorsList = Array.isArray(p.authors) ? p.authors.join(', ') : p.authors;
    content += `- **${p.title}** (${p.year}) - ${authorsList}. [Resource](${p.url || 'https://serc.iiit.ac.in/research'})\n`;
  });
  content += `\n`;

  content += `## Latest Blog Posts\n`;
  blogs.forEach(b => {
    content += `- [${b.title}](https://serc.iiit.ac.in/blog/${b.slug}): ${b.excerpt || ''} (${b.date})\n`;
  });
  content += `\n`;

  content += `## News & Events (Top 10)\n`;
  // Sort news by date descending
  const sortedNews = [...news]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 10);
  sortedNews.forEach(n => {
    content += `- [${n.name}](https://serc.iiit.ac.in/news/${n.slug}): ${n.summary || ''} (${new Date(n.startTime).toLocaleDateString()})\n`;
  });
  content += `\n`;

  fs.writeFileSync(outputFile, content, 'utf8');
  console.log('Successfully generated public/llms.txt');
} catch (err) {
  console.error('Error generating llms.txt:', err);
  process.exit(1);
}
