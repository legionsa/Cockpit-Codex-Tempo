export interface EditorJSBlock {
  id?: string;
  type: string;
  data: any;
}

export interface EditorJSContent {
  time: number;
  blocks: EditorJSBlock[];
  version: string;
}

export type PageLayout = 
  | 'default'           // Standard doc page with sidebar
  | 'full-width'        // Full width content, no sidebar
  | 'landing'           // Hero section + card grid (like Atlassian home)
  | 'component'         // Component showcase with examples
  | 'article'           // Blog/article style with narrow content
  | 'grid'              // Card grid layout for category pages

export interface HeroConfig {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: 'light' | 'dark';
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export interface CardItem {
  title: string;
  description: string;
  icon?: string;
  link: string;
  image?: string;
}

export interface LayoutConfig {
  showBreadcrumbs?: boolean;
  showOnThisPage?: boolean;
  showTitle?: boolean;
  showSummary?: boolean;
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full';
  hero?: HeroConfig;
  cards?: CardItem[];
  sidebarPosition?: 'left' | 'right' | 'none';
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  order: number;
  tags: string[];
  summary: string;
  contentType: 'editorjs';
  content: EditorJSContent;
  status: 'Draft' | 'Published' | 'Archived';
  version: string;
  lastUpdated: string;
  password?: string;
  layout?: PageLayout;
  layoutConfig?: LayoutConfig;
  icon?: string; // Icon for navigation/cards
}

export interface PageTreeNode extends Page {
  children: PageTreeNode[];
  depth: number;
}

export interface Redirect {
  from: string;
  to: string;
}

export interface SiteConfig {
  siteName: string;
  logo: string;
  favicon: string;
  themeMode: 'light' | 'dark' | 'system';
}

export interface User {
  username: string;
  passwordHash: string;
  email: string;
  role: 'admin' | 'editor';
}