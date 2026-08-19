export const navItems = [
  { label: "Home", href: "/" },
  { label: "My Life", href: "/life" },
  { label: "My WORKs", href: "/works" },
  { label: "My Thoughts", href: "/thoughts" },
  { label: "Friends of Ixrael", href: "/friends" },
  { label: "Dashboard", href: "/dashboard" },
] as const;

export const heroHighlights = [
  "Dynamic hero section",
  "Content-first publishing system",
  "Blue, black, and white visual language",
];

export const featuredPosts = [
  {
    title: "Streetwise coming",
    category: "My Life",
    excerpt:
      "A future stream for grounded observations, urban texture, and the stories that shape the walk.",
  },
  {
    title: "Nation State",
    category: "My Thoughts",
    excerpt:
      "A new thought lane for reflections on identity, governance, and the systems around us.",
  },
  {
    title: "Digitize Africa",
    category: "My WORKs",
    excerpt:
      "A work stream focused on digital transformation, visibility, and practical public impact.",
  },
] as const;

export const workProjects = [
  "Zion's Sake",
  "Digitize Africa",
  "Not Rocket Science",
  "Formalize Pidgin",
  "Citizens Participation Support",
] as const;

export const thoughtLanes = ["Philosophy", "Nation State", "Technology"] as const;

export const dashboardStats = [
  { label: "Daily reads", value: "18.4k", delta: "+12%" },
  { label: "Weekly reads", value: "92.1k", delta: "+21%" },
  { label: "Subscribers", value: "14.2k", delta: "+406" },
  { label: "Engagement", value: "7.8%", delta: "+1.4" },
] as const;

export const dashboardModules = [
  "Post editor with draft, publish, and schedule states",
  "Media library for photos, covers, and inline assets",
  "Comments, likes, shares, and moderation queue",
  "Analytics for reads, retention, and top-performing stories",
  "Subscriber capture and newsletter distribution",
] as const;