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

export interface TabData {
  label: string;
  content: EditorJSContent;
}

export interface PageTab {
  id: string;
  label: string;
  content: EditorJSContent;
}

export interface PropDefinition {
  name: string;
  type: string;
  defaultValue?: string;
  required: boolean;
  description: string;
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  description?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  order: number;
  tags: string[];
  pageTags?: string[]; // For status tags like Beta, Deprecated
  summary: string;
  icon?: string; // Lucide icon name

  // View mode: how content is displayed
  viewMode?: 'default' | 'tabbed';
  contentType?: 'component' | 'page';

  // Content for default mode
  content: EditorJSContent;

  // Tabs for tabbed mode
  tabs?: PageTab[];

  // Legacy fields (deprecated, will be removed)
  // Layout configuration
  // Layout configuration
  layout?: 'default' | 'atlassian' | 'landing' | 'cardGrid' | 'fullWidth' | 'article' | 'component' | 'iconGallery';

  // Display options for granular control
  displayOptions?: {
    showBreadcrumbs: boolean;
    showTitle: boolean;
    showSummary: boolean;
    showOnThisPage: boolean;
    contentWidth: 'default' | 'wide' | 'full';
  };

  hero?: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    textColor?: 'light' | 'dark';
    primaryCta?: { text: string; link: string };
    secondaryCta?: { text: string; link: string };
  };

  navigationCards?: {
    title: string;
    description: string;
    link: string;
    icon?: string;
  }[];

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };

  icons?: any[];
  componentData?: {
    props?: PropDefinition[];
    examples?: CodeExample[];
    livePreview?: boolean;
    importPath?: string;
  };

  status: 'Draft' | 'Published' | 'Archived';
  version: string;
  lastUpdated: string;
  password?: string; // Legacy - plain text (deprecated)
  passwordHash?: string; // PBKDF2 or bcrypt hashed password
  passwordProtected?: boolean; // Whether page requires password
  passwordHint?: string; // Optional hint for password

  // Role-based access control
  visibility?: 'public' | 'authenticated' | 'role-restricted'; // Default: 'public'
  requiredRole?: 'admin' | 'editor' | 'viewer'; // Required role if visibility is 'role-restricted'
}

export interface PageTag {
  label: string;
  color: string;
  description: string;
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
  role: 'admin' | 'editor' | 'viewer'; // Extended with viewer role
}

export interface CustomIcon {
  id: string;
  name: string;
  svg: string;
  tags: string[];
  category: string;
  reactCode?: string;
  figmaLink?: string;
  size?: number;
  createdAt: number;
}