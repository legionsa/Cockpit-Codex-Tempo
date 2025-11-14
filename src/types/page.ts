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
  password?: string; // Optional password protection
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