
import { 
  Users, 
  Trophy, 
  AlertTriangle, 
  Target, 
  Cpu, 
  Heart, 
  Zap, 
  Globe, 
  Server, 
  Code,
  Camera
} from 'lucide-react';
import { SectionContent } from './types';

export const SECTIONS: SectionContent[] = [
  {
    id: 'identity',
    title: 'Who We Are',
    subtitle: 'Directorate Identity & Scale',
    icon: Globe,
    description: 'We are the technological backbone of the organization, delivering scalable, resilient, and secure software solutions across the globe.',
    kpis: [
      { label: 'Developers', value: '139.5' },
      { label: 'Agile Teams', value: '21' },
      { label: 'Men / Women', value: '80.5 / 59' },
      { label: '5 Networks', value: 'Global, Shmura, TSN, Azure, Labs' },
      { label: 'Common Languages', value: 'Java, React, C++, C#, Python, Node' }
    ],
    tags: ['React', 'Node.js', 'Go', 'AWS', 'Kubernetes', 'Python/AI', 'Microservices', 'DevOps', 'Azure'],
    bullets: [
      { title: 'Mission', description: 'To accelerate business velocity through engineering excellence.' }
    ],
    projects: [
      'Arig', 'DITA', 'Serbia', 'EMK', 'KTP', 'BAA', 'WES', 'Nora', 'Pulse', 
      'C2SJOC', 'ZAYAD', 'MARS', 'Tarazan', 'Sheldon', 'Autonumy', 'Voss', 'FDC', 'Shield'
    ]
  },
  {
    id: 'success',
    title: 'Key Successes',
    subtitle: 'Deliveries & Impact',
    icon: Trophy,
    description: 'This year marked a turning point in our delivery capability. We shipped major refactors and launched two greenfield products.',
    kpis: [
      { label: 'Annual Commits', value: '30,000', trend: '+15% vs last year', positive: true },
      { label: 'Releases', value: '450+', trend: '+20%', positive: true },
      { label: 'Most Commits / Dev', value: 'Dominion', positive: true }
    ],
    bullets: [
      { title: 'Project "Titan" Launch', description: 'Delivered the new unified customer portal 2 weeks ahead of schedule.' },
      { title: 'Legacy Migration', description: 'Successfully retired the 10-year-old monolith, moving 100% to microservices.' },
      { title: 'Performance', description: 'Optimized database queries resulting in a 40% cost reduction in cloud spend.' }
    ]
  },
  {
    id: 'challenges',
    title: 'Challenges',
    subtitle: 'Lessons Learned',
    icon: AlertTriangle,
    description: '"Ideas are cheap, delivery is everything." Our greatest hurdle remains bridging the gap between concept and consistent execution.',
    bullets: [
      { 
        title: 'Deployment Strategy', 
        description: 'Navigating the complexity of On-Premises air-gapped systems versus dynamic Cloud infrastructures requires precision.',
        lesson: 'Standardization',
        lessonColor: 'text-cyber-400' 
      },
      { 
        title: 'Quality Assurance', 
        description: 'We are enforcing strict KPIs, automated unit testing, and rigorous code reviews to catch issues early.',
        lesson: 'Responsibility',
        lessonColor: 'text-gold-400' 
      },
      { 
        title: 'AI Transformation', 
        description: 'We must not just observe but actively participate in the technological transformation sweeping the world.',
        lesson: 'Innovation & Progress',
        lessonColor: 'text-purple-400' 
      }
    ],
    tags: ['Standardization', 'Responsibility', 'Innovation'],
    illustration: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'focus',
    title: 'Focus Next Year',
    subtitle: 'Strategic Directions',
    icon: Target,
    description: 'Moving forward, we are refining our structure, mindset, and toolset to unlock higher velocity and impact.',
    bullets: [
      { 
        title: 'Strategic Domain Alignment', 
        description: 'Rearranging our groups to align knowledge domains in the right way to better serve our projects and eliminate silos.' 
      },
      { 
        title: 'Product-First Mindset', 
        description: 'Thinking in a fierce **Product** way. Understanding what is core and what isn\'t to drive true **Product**ivity.',
        lesson: 'Core Value',
        lessonColor: 'text-cyber-400'
      },
      { 
        title: 'Unified Routines', 
        description: 'Adjusting and standardizing the same base routines across the entire group to create a consistent engineering heartbeat.' 
      },
      { 
        title: 'AI Everywhere', 
        description: 'AI for everyone, everywhere. Empowering every developer and project with intelligence to revolutionize our workflow.' 
      }
    ],
    tags: ['Alignment', 'Product', 'Routines', 'AI'],
    illustration: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'innovation',
    title: 'Innovation & AI',
    subtitle: 'Future Tech & Pilots',
    icon: Cpu,
    description: 'We stopped talking about AI and started building with it.',
    kpis: [
      { label: 'Copilot Adoption', value: '85%' },
      { label: 'Code Gen Speed', value: '+30%' },
      { label: 'Patents Filed', value: '2' }
    ],
    bullets: [
      { title: 'Development with AI', description: 'Almost everyone adopted AI tools like Copilot or Cursor and using local or global models.' },
      { title: 'Border Project', description: 'Mars and Shield were the first to adopt new AI capabilities in the project (also operational features).' },
      { title: 'AI for Fun', description: 'We did movies, pictures, demos, and invented more using the revolution AI did for us.' }
    ]
  },
  {
    id: 'people',
    title: 'People & Culture',
    subtitle: 'The Heart of Engineering',
    icon: Users,
    description: 'Code is written by people. We invested heavily in upskilling, mental health, and creating a culture of ownership.',
    kpis: [
      { label: 'Promotions', value: '12' },
      { label: 'Retention', value: '94%' },
      { label: 'eNPS', value: '62' }
    ],
    bullets: [
      { title: 'Tech Talks', description: 'Hosted 24 internal "Lunch & Learn" sessions covering everything from Rust to Soft Skills.' },
      { title: 'Hackathon', description: 'Our annual 48-hour hackathon resulted in 3 ideas making it to the product roadmap.' },
      { title: 'Hybrid Model', description: 'Solidified our "Remote-First, Office-Optional" policy.' }
    ]
  },
  {
    id: 'closing',
    title: 'Closing',
    subtitle: 'A Message from the Director',
    icon: Heart,
    description: 'Thank you.',
    bullets: [
      { title: 'Gratitude', description: 'To every developer, QA, product manager, and designer who pushed a commit this year: you are the engine of this company.' },
      { title: 'The Future', description: 'The software landscape is changing faster than ever. Stay curious, stay humble, and keep building.' }
    ],
    tags: ['Thank You', 'Onwards', '2025'],
    illustration: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'gallery',
    title: 'Memories',
    subtitle: 'Captured by You',
    icon: Camera,
    description: 'A collection of moments uploaded by our team during this presentation.',
    galleryImages: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=500', // Team working
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=500', // Conference
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=500', // Coding
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=500', // Handshake
    ]
  }
];

export const INNOVATION_QUOTES = [
  "Innovation distinguishes between a leader and a follower.",
  "The best way to predict the future is to invent it.",
  "Technology is best when it brings people together.",
  "Talk is cheap. Show me the code.",
  "Programs must be written for people to read, and only incidentally for machines to execute.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Truth can only be found in one place: the code.",
  "Simplicity is the ultimate sophistication.",
  "Java is to JavaScript what car is to Carpet.",
  "Code never lies, comments sometimes do.",
  "Computers are fast; developers keep them slow.",
  "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
  "If debugging is the process of removing software bugs, then programming must be the process of putting them in.",
  "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
  "The function of good software is to make the complex appear to be simple.",
  "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.",
  "Before software can be reusable it first has to be usable.",
  "Optimism is an occupational hazard of programming: feedback is the treatment.",
  "It’s not that we use technology, we live technology.",
  "The advance of technology is based on making it fit in so that you don't really even notice it.",
  "Any sufficiently advanced technology is indistinguishable from magic.",
  "The science of today is the technology of tomorrow.",
  "Technology is a useful servant but a dangerous master.",
  "We are changing the world with technology.",
  "The future is still so much bigger than the past.",
  "Innovation is the ability to see change as an opportunity - not a threat.",
  "Innovation comes from creating environments where ideas can connect.",
  "There's a way to do it better - find it.",
  "Learning and innovation go hand in hand.",
  "Creativity is thinking up new things. Innovation is doing new things.",
  "The only way to discover the limits of the possible is to go beyond them into the impossible.",
  "Logic will get you from A to B. Imagination will take you everywhere.",
  "Do not go where the path may lead, go instead where there is no path and leave a trail.",
  "Everything you can imagine is real.",
  "Stay hungry, stay foolish.",
  "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do great work.",
  "Quality means doing it right when no one is looking.",
  "Management is doing things right; leadership is doing the right things.",
  "Productivity is being able to do things that you were never able to do before.",
  "Don't watch the clock; do what it does. Keep going.",
  "Success is walking from failure to failure with no loss of enthusiasm.",
  "The secret of getting ahead is getting started.",
  "What we think, we become.",
  "Opportunities don't happen, you create them.",
  "It always seems impossible until it's done.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "Software is eating the world.",
  "Get busy living or get busy dying.",
  "The purpose of our lives is to be happy.",
  "Deleted code is debugged code.",
  "Software undergoes beta testing shortly before it’s released. Beta is Latin for ‘still doesn’t work’."
];
