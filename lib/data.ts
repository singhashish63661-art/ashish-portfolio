import { Mail, Phone, Linkedin, Github, Instagram } from "lucide-react";

export const RESUME_FILE = "/Ashish_Singh_Resume.pdf";

/** Portfolio filters — work type, not job title (no “designer” labels) */
export type PortfolioTab = "Dashboards" | "Websites";

export type Project = {
  slug: string;
  title: string;
  tech: string;
  desc: string;
  link?: string;
  category: string;
  /** Filter tab for portfolio section */
  portfolioTab: PortfolioTab;
  stack: string[];
  problem: string;
  solution: string;
  impact: string[];
  /** Your role on the project (case study) */
  myRole: string;
  /** Case study hero + OG — file in `public/project-covers/` */
  coverImage: string;
};

export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
};

export const PERSONAL_INFO = {
  name: "Ashish Singh",
  title: "Operations Manager",
  subtitle: "Helping teams ship dashboards, internal tools, and client websites faster",
  email: "singhashish63661@gmail.com",
  phone: "+91 7206617045",
  location: "Trackor Technology Pvt Ltd, Sector 33, Gurugram, Haryana, India",
  /** Embedded map (Contact section). Query-based Google Maps embed — no API key. Update if you relocate. */
  map: {
    embedUrl:
      "https://www.google.com/maps?q=Trackor+Technology+Pvt+Ltd+Sector+33+Gurugram+Haryana+India&output=embed&z=13&hl=en",
    openUrl:
      "https://www.google.com/maps/search/?api=1&query=Trackor+Technology+Pvt+Ltd+Sector+33+Gurugram+Haryana+India",
  },
  /** Short line for the hero — keep brief; full story lives in `about` */
  heroIntro:
    "I work with operations teams and growing businesses to build practical web solutions, automate reporting, and improve delivery speed without adding process overhead.",
  about:
    "I am a problem solver at heart, working at the intersection of technology, operations, and innovation. I enjoy building solutions from scratch, optimizing processes, and turning ideas into real-world products. My goal is to create systems that are not only efficient but also scalable and user-focused.",
  /** Shown in About — add or reorder rows anytime */
  personalDetails: [
    { label: "Date of birth", value: "31-10-2004" },
    { label: "Blood group", value: "O+" },
    { label: "Location", value: "Sector 33, Gurugram, Haryana, India" },
  ] as const,
  /** Trust badge copy next to personal details (About) */
  profileVerification: {
    label: "Verified",
    hint: "Matches resume & credentials",
  } as const,
  /** Right column image in “Who I Am” — replace `public/who-i-am-workspace.png` with your own photo anytime */
  aboutPhoto: "/who-i-am-workspace.png",
  socials: [
    { name: "LinkedIn", icon: Linkedin, link: "https://www.linkedin.com/in/ashish-rajput-b45579242/" },
    { name: "GitHub", icon: Github, link: "https://github.com/singhashish63661-art" },
    { name: "Email", icon: Mail, link: "mailto:singhashish63661@gmail.com" },
    { name: "Instagram", icon: Instagram, link: "https://www.instagram.com/aashish_rajput.001/?igsh=eHhtOHhla3V3eDdr&utm_source=qr" },
    { name: "WhatsApp", icon: Phone, link: "https://wa.me/917206617045" }
  ],
};

export const EXPERIENCE = [
  {
    company: "Trackor Technology Pvt Ltd",
    logo: "/company-logos/trackor-logo.png",
    role: "Operations Manager",
    period: "25 Apr 2025 – Present",
    desc: [
      "Managing day-to-day operations and coordinating teams for smooth service delivery.",
      "Driving process improvements, reporting discipline, and faster issue resolution across operations."
    ]
  },
  {
    company: "SSRC Logistics Pvt Ltd",
    logo: "/company-logos/ssrc-badge.png",
    role: "Research & Development Specialist",
    period: "Oct 2025 – 16 Apr 2026",
    desc: [
      "Working on new developments on a daily basis for the App and Internal Software.",
      "Optimizing operational workflows to make the working path easier and more efficient for the company."
    ]
  },
  {
    company: "MashEye InfoTech Pvt. Ltd",
    logo: "/company-logos/masheye-badge.png",
    role: "Operations Manager",
    period: "Aug 2024 – Sep 2025",
    desc: [
      "Directed end-to-end daily operations, coordinating cross-functional teams.",
      "Introduced lean practices and automation tools reducing manual errors.",
      "Implemented ERP/CRM systems (Client portal & APP) to enhance reporting accuracy.",
      "Developed data-driven inventory management systems reducing carry costs.",
      "Managed vendor relationships and negotiated favorable contracts."
    ]
  }
];

export const EDUCATION = [
  {
    degree: "B.Tech in Computer Science Engineering",
    school: "Maharshi Dayanand University",
    year: "2025 – Present"
  },
  {
    degree: "Diploma in Computer Science Engineering",
    school: "Haryana State Board of Technical Education",
    year: "2021 – 2024"
  },
  {
    degree: "12th Grade (HBSE)",
    school: "Haryana Board of School Education",
    year: "2021"
  }
];

export const SKILLS = [
  { category: "Technical", items: ["SQL", "HTML/CSS/JS", "Node.js", "React", "MongoDB", "Data Analysis"] },
  { category: "Tools", items: ["Power BI", "Looker Studio", "n8n", "Google Sheets", "MS Office"] },
  { category: "Operations", items: ["Team Supervision","Safety Training", "Key Account Management", "CRM/ERP","Research & Development"] },
];

export const PROJECTS: Project[] = [
  {
    slug: "accidental-data-monitoring-dashboard",
    title: "Accidental Data Monitoring Dashboard",
    tech: "Gurugram | Feb 2025",
    desc: "Built a real-time dashboard to monitor and analyze vehicle accident data. Reduced manual reporting effort by about 70% while streamlining tracking for 100+ incidents per month. Improved decision-making speed and field coordination.",
    link: "https://fleetguard-beta.vercel.app/",
    coverImage: "/project-covers/accidental-data-monitoring-dashboard.png",
    category: "Analytics Dashboard",
    portfolioTab: "Dashboards",
    stack: ["React", "Dashboard UI", "Data Visualization", "Operational Reporting"],
    problem: "Accident tracking and reporting were mostly manual, causing delays and inconsistent reporting quality.",
    solution: "Built a real-time dashboard for incident monitoring, trend visibility, and faster operational coordination.",
    impact: [
      "Reduced manual reporting effort by 70%",
      "Improved coordination for 100+ incidents monthly",
      "Enabled faster, data-backed field decisions",
    ],
    myRole: "End-to-end build of the React dashboard, data views, and reporting flows for operations.",
  },
  {
    slug: "field-operation-monitoring-dashboard",
    title: "Field Operation Monitoring Dashboard",
    tech: "Gurugram | May 2025",
    desc: "Built a dynamic dashboard to automate field reporting and provide real-time operational insights. Cut reporting turnaround from hours to minutes while improving KPI visibility for daily reviews.",
    coverImage: "/project-covers/field-operation-monitoring-dashboard.jpg",
    category: "Operations Dashboard",
    portfolioTab: "Dashboards",
    stack: ["React", "KPI Tracking", "Automated Reporting", "Performance Analytics"],
    problem: "Field performance tracking lacked centralized insights and consumed time through repetitive manual reporting.",
    solution: "Created an automated operations dashboard with live metrics and streamlined reporting workflows.",
    impact: [
      "Reduced manual reporting time from hours to minutes",
      "Improved daily KPI visibility for field supervisors",
      "Increased reporting consistency and data accuracy across teams",
    ],
    myRole: "Owned the dashboard implementation, KPI views, and automation of recurring operational reports.",
  },
  {
    slug: "personal-portfolio-react",
    title: "Personal portfolio (Next.js)",
    tech: "Kundaim Industrial Area, Goa | Apr 2026",
    desc: "Modern, responsive portfolio built with Next.js and TypeScript to present projects, experience, and contact in one fast site.",
    link: "https://ashish-portfolio-gamma-five.vercel.app/",
    coverImage: "/project-covers/personal-portfolio-react.jpg",
    category: "Web Experience",
    portfolioTab: "Websites",
    stack: ["Next.js", "TypeScript", "Responsive UI", "Framer Motion"],
    problem: "Needed a fast, professional site to present work, credibility, and outcomes in one place.",
    solution: "Built a structured portfolio with clear sections, responsive layout, and lightweight interactions.",
    impact: [
      "Improved personal brand presentation",
      "Made projects easy to review by recruiters and clients",
      "Delivered a responsive experience across devices",
    ],
    myRole: "Sole developer: Next.js structure, section content, styling, analytics, and deployment.",
  },
  {
    slug: "nectra-building-website",
    title: "Nectra Building Website",
    tech: "Greater Noida | Nov 2025",
    desc: "Built a responsive marketing site for Nectra Building System with clearer service pages and stronger inquiry paths, helping visitors reach the right offering faster.",
    link: "https://nectraa.netlify.app",
    coverImage: "/project-covers/nectra-building-website.jpg",
    category: "Business Website",
    portfolioTab: "Websites",
    stack: ["Frontend development", "Responsive layout", "Content structure"],
    problem: "Business needed a stronger online identity and a clear way to communicate services to clients.",
    solution: "Delivered a responsive company website with service-focused content and polished visual presentation.",
    impact: [
      "Improved digital credibility with a professional web presence",
      "Made service information easier to discover and compare",
      "Reduced friction in contact and inquiry journeys",
    ],
    myRole: "Frontend build: responsive pages, service content, and deployment to production.",
  },
  {
    slug: "ssrc-logistics-website",
    title: "SSRC Logistics Website",
    tech: "Transportation & Logistics Website",
    desc: "Developed a static site for SSRC Logistics Pvt. Ltd. to present services, operations, and contact information clearly.",
    link: "https://ssrc.co",
    coverImage: "/project-covers/ssrc-logistics-website.png",
    category: "Corporate Website",
    portfolioTab: "Websites",
    stack: ["Static Web", "Service pages", "Responsive layout"],
    problem: "Company required a stable and clear web presence to communicate logistics capabilities.",
    solution: "Built a focused business website highlighting services, operations, and trust signals.",
    impact: [
      "Established a stronger brand footprint online",
      "Simplified service communication for customers",
      "Created a maintainable web presence",
    ],
    myRole: "Developed the static company site: structure, copy layout, and hosting setup.",
  },
  {
    slug: "concept-core-website",
    title: "Concept Core Website",
    tech: "Gurugram | 2025",
    desc: "Developed a fast, responsive website for Concept Core with clear service-led messaging and lightweight pages optimized for mobile visitors.",
    link: "https://concept-core.netlify.app/",
    coverImage: "/project-covers/concept-core-website.jpg",
    category: "Startup Website",
    portfolioTab: "Websites",
    stack: ["Responsive UI", "Performance-first Frontend", "Service-led Layouts"],
    problem: "Startup needed a professional website to present offerings clearly and improve trust with potential clients.",
    solution: "Built a lightweight site focused on clear copy, simple structure, and fast performance.",
    impact: [
      "Improved first impression and trust for potential clients",
      "Clarified offerings with cleaner service architecture",
      "Delivered a fast and responsive experience across devices",
    ],
    myRole: "Built the marketing site: responsive UI, performance-focused static delivery, and launch.",
  },
];

export type Certification = {
  title: string;
  issuer: string;
  /** Optional year or range shown on the card */
  year?: string;
};

/** Certifications & courses — shown in the Certifications section */
export const CERTIFICATIONS: Certification[] = [
  { title: "Google Analytics Certification", issuer: "Great Learning", year: "2024" },
  { title: "Data Structures & Algorithms", issuer: "Great Learning", year: "2024" },
  { title: "AI Awareness Certification", issuer: "AI For ALL", year: "2026" },
  { title: "AI Appreciation Certification", issuer: "AI For ALL", year: "2026" },
];

/** Hero credibility strip — keep numbers aligned with real data */
export const SITE_HIGHLIGHTS = [
  { label: "Projects in portfolio", value: String(PROJECTS.length) },
  { label: "Years in operations & delivery", value: "3+" },
  { label: "Certifications", value: String(CERTIFICATIONS.length) },
] as const;

/** @deprecated Use CERTIFICATIONS — kept for any legacy imports */
export const ACHIEVEMENTS = CERTIFICATIONS;

/**
 * Optional reference quotes for future use (e.g. a testimonials section).
 * Replace with approved names and wording before publishing as endorsements.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "sumit kumar choudhary.",
    role: "Operations Manager",
    company: "SSRC Logistics Pvt Ltd",
    quote:
      "Ashish brings structured thinking to day-to-day operations and turns messy workflows into something teams can actually run.",
  },
  {
    name: "Vikash Goutam.",
    role: "Operations Manager",
    company: "MashEye InfoTech Pvt. Ltd.",
    quote:
      "The dashboards and reporting work cut manual follow-ups and gave us a clearer picture of field performance much faster.",
  },
  {
    name: "Vikram M.",
    role: "Project stakeholder",
    company: "Client delivery",
    quote:
      "Clear communication, steady execution, and delivery we could hand off without second-guessing the details.",
  },
];
