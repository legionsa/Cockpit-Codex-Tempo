import { Page, PageTreeNode } from '@/types/page';

// Mock data storage - in production this would be replaced with actual backend
const STORAGE_KEYS = {
  PAGES: 'cds_pages',
  REDIRECTS: 'cds_redirects',
  CONFIG: 'cds_config',
  USERS: 'cds_users',
  AUTH_TOKEN: 'cds_auth_token',
  AUTH_TOKEN_EXPIRY: 'cds_auth_token_expiry',
  TAGS: 'cds_tags',
};

const INITIAL_TAGS = [
  { label: "Beta", color: "#4f46e5", description: "Still experimental" },
  { label: "Deprecated", color: "#b91c1c", description: "Use successor component" },
  { label: "Caution", color: "#f59e0b", description: "Requires special access" }
];

// Initialize with sample data
const INITIAL_PAGES: Page[] = [
  {
    id: 'home',
    title: 'Home',
    slug: 'home',
    parentId: null,
    order: 0,
    tags: ['home'],
    summary: 'Welcome to Cockpit Design System',

    content: {
      time: Date.now(),
      blocks: [
        {
          type: 'header',
          data: { text: 'Cockpit Design System', level: 1 }
        },
        {
          type: 'paragraph',
          data: { text: 'A comprehensive design system for building consistent, accessible user interfaces.' }
        }
      ],
      version: '2.29.0'
    },
    status: 'Published',
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'foundations',
    title: 'Foundations',
    slug: 'foundations',
    parentId: null,
    order: 1,
    tags: ['foundations'],
    summary: 'Core design principles and tokens',

    content: {
      time: Date.now(),
      blocks: [
        {
          type: 'header',
          data: { text: 'Foundations', level: 1 }
        },
        {
          type: 'paragraph',
          data: { text: 'The building blocks of our design system.' }
        }
      ],
      version: '2.29.0'
    },
    status: 'Published',
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'foundations-color',
    title: 'Color',
    slug: 'color',
    parentId: 'foundations',
    order: 0,
    tags: ['color', 'tokens'],
    summary: 'Color palette and semantic tokens',

    content: {
      time: Date.now(),
      blocks: [
        {
          type: 'header',
          data: { text: 'Color System', level: 1 }
        },
        {
          type: 'paragraph',
          data: { text: 'Our color system is built on semantic tokens that adapt to light and dark themes.' }
        }
      ],
      version: '2.29.0'
    },
    status: 'Published',
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'components',
    title: 'Components',
    slug: 'components',
    parentId: null,
    order: 2,
    tags: ['components'],
    summary: 'UI component library',

    content: {
      time: Date.now(),
      blocks: [
        {
          type: 'header',
          data: { text: 'Components', level: 1 }
        },
        {
          type: 'paragraph',
          data: { text: 'Reusable UI components built with React and Tailwind CSS.' }
        }
      ],
      version: '2.29.0'
    },
    status: 'Published',
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'components-button',
    title: 'Button',
    slug: 'button',
    parentId: 'components',
    order: 0,
    tags: ['component', 'interactive'],
    pageTags: ['Stable'],
    summary: 'A versatile button component with multiple variants and sizes',
    viewMode: 'tabbed',
    content: {
      time: Date.now(),
      blocks: [],
      version: '2.29.0'
    },
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        content: {
          time: Date.now(),
          blocks: [
            {
              type: 'header',
              data: { text: 'Button Component', level: 1 }
            },
            {
              type: 'paragraph',
              data: { text: 'The Button component is a fundamental building block for user interactions. It supports multiple variants, sizes, and states to fit various use cases throughout your application.' }
            },
            {
              type: 'header',
              data: { text: 'When to use', level: 2 }
            },
            {
              type: 'list',
              data: {
                style: 'unordered',
                items: [
                  'Primary actions (submit forms, confirm dialogs)',
                  'Secondary actions (cancel, go back)',
                  'Navigation (links styled as buttons)',
                  'Destructive actions (delete, remove)'
                ]
              }
            }
          ],
          version: '2.29.0'
        }
      },
      {
        id: 'props',
        label: 'Props',
        content: {
          time: Date.now(),
          blocks: [
            {
              type: 'header',
              data: { text: 'Component API', level: 2 }
            },
            {
              type: 'paragraph',
              data: { text: 'Props and configuration options for this component.' }
            },
            {
              type: 'componentProps',
              data: {
                props: [
                  {
                    name: 'variant',
                    type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
                    defaultValue: '"default"',
                    required: false,
                    description: 'The visual style variant of the button'
                  },
                  {
                    name: 'size',
                    type: '"default" | "sm" | "lg" | "icon"',
                    defaultValue: '"default"',
                    required: false,
                    description: 'The size of the button'
                  },
                  {
                    name: 'disabled',
                    type: 'boolean',
                    defaultValue: 'false',
                    required: false,
                    description: 'Whether the button is disabled'
                  },
                  {
                    name: 'onClick',
                    type: '() => void',
                    required: false,
                    description: 'Click handler function'
                  }
                ]
              }
            }
          ],
          version: '2.29.0'
        }
      },
      {
        id: 'examples',
        label: 'Examples',
        content: {
          time: Date.now(),
          blocks: [
            {
              type: 'header',
              data: { text: 'Code Examples', level: 2 }
            },
            {
              type: 'paragraph',
              data: { text: 'Learn how to use this component with practical examples.' }
            },
            {
              type: 'codeExample',
              data: {
                importPath: "import { Button } from '@/components/ui/button';",
                examples: [
                  {
                    title: 'Basic Usage',
                    language: 'tsx',
                    code: `<Button>Click me</Button>`,
                    description: 'A simple button with default styling'
                  },
                  {
                    title: 'Variants',
                    language: 'tsx',
                    code: `<div className="flex gap-2">
  <Button variant="default">Default</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
</div>`,
                    description: 'Different visual variants for various contexts'
                  },
                  {
                    title: 'Sizes',
                    language: 'tsx',
                    code: `<div className="flex items-center gap-2">
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
</div>`,
                    description: 'Available size options'
                  },
                  {
                    title: 'With Icons',
                    language: 'tsx',
                    code: `import { Mail } from 'lucide-react';

<Button>
  <Mail className="mr-2 h-4 w-4" />
  Send Email
</Button>`,
                    description: 'Buttons with icons for better visual communication'
                  }
                ]
              }
            }
          ],
          version: '2.29.0'
        }
      }
    ],
    status: 'Published',
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  }
];

export const storage = {
  // Pages
  getPages(): Page[] {
    const stored = localStorage.getItem(STORAGE_KEYS.PAGES);
    if (!stored) {
      this.setPages(INITIAL_PAGES);
      return INITIAL_PAGES;
    }
    return JSON.parse(stored);
  },

  setPages(pages: Page[]): void {
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
  },

  getPageById(id: string): Page | undefined {
    return this.getPages().find(p => p.id === id);
  },

  getPageBySlugPath(slugPath: string[]): Page | undefined {
    const pages = this.getPages();
    let currentParentId: string | null = null;
    let page: Page | undefined;

    for (const slug of slugPath) {
      page = pages.find(p => p.slug === slug && p.parentId === currentParentId);
      if (!page) return undefined;
      currentParentId = page.id;
    }

    return page;
  },

  savePage(page: Page): void {
    const pages = this.getPages();
    const index = pages.findIndex(p => p.id === page.id);
    if (index >= 0) {
      pages[index] = page;
    } else {
      pages.push(page);
    }
    this.setPages(pages);
  },

  deletePage(id: string): void {
    const pages = this.getPages();
    // Recursively delete children
    const deleteRecursive = (pageId: string) => {
      const children = pages.filter(p => p.parentId === pageId);
      children.forEach(child => deleteRecursive(child.id));
    };
    deleteRecursive(id);
    const filtered = pages.filter(p => p.id !== id && p.parentId !== id);
    this.setPages(filtered);
  },

  getChildPages(parentId: string | null): Page[] {
    return this.getPages().filter(p => p.parentId === parentId);
  },

  getPageDepth(pageId: string): number {
    const breadcrumbs = this.getBreadcrumbs(pageId);
    return breadcrumbs.length - 1;
  },

  // Build tree structure
  buildPageTree(): PageTreeNode[] {
    const pages = this.getPages();
    const pageMap = new Map<string, PageTreeNode>();

    // Initialize all pages as tree nodes
    pages.forEach(page => {
      pageMap.set(page.id, { ...page, children: [], depth: 0 });
    });

    // Build parent-child relationships
    const rootNodes: PageTreeNode[] = [];

    pages.forEach(page => {
      const node = pageMap.get(page.id)!;

      if (page.parentId === null) {
        rootNodes.push(node);
      } else {
        const parent = pageMap.get(page.parentId);
        if (parent) {
          node.depth = parent.depth + 1;
          parent.children.push(node);
        }
      }
    });

    // Sort by order
    const sortNodes = (nodes: PageTreeNode[]) => {
      nodes.sort((a, b) => a.order - b.order);
      nodes.forEach(node => sortNodes(node.children));
    };

    sortNodes(rootNodes);
    return rootNodes;
  },

  // Get breadcrumb path
  getBreadcrumbs(pageId: string): Page[] {
    const pages = this.getPages();
    const breadcrumbs: Page[] = [];
    let currentId: string | null = pageId;

    while (currentId) {
      const page = pages.find(p => p.id === currentId);
      if (!page) break;
      breadcrumbs.unshift(page);
      currentId = page.parentId;
    }

    return breadcrumbs;
  },

  // Redirects
  getRedirects(): Record<string, string> {
    const stored = localStorage.getItem(STORAGE_KEYS.REDIRECTS);
    return stored ? JSON.parse(stored) : {};
  },

  setRedirects(redirects: Record<string, string>): void {
    localStorage.setItem(STORAGE_KEYS.REDIRECTS, JSON.stringify(redirects));
  },

  // Config
  getConfig() {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return stored ? JSON.parse(stored) : {
      siteName: 'Cockpit Design System',
      logo: '',
      favicon: '',
      themeMode: 'system'
    };
  },

  setConfig(config: any): void {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },

  // Auth
  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  getAuthTokenExpiry(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN_EXPIRY);
  },

  setAuthToken(token: string, expiry: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN_EXPIRY, expiry);
  },

  clearAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN_EXPIRY);
  },

  // Tags
  getTags(): any[] {
    const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
    if (!stored) {
      this.setTags(INITIAL_TAGS);
      return INITIAL_TAGS;
    }
    return JSON.parse(stored);
  },

  setTags(tags: any[]): void {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  saveTag(tag: any): void {
    const tags = this.getTags();
    const index = tags.findIndex((t: any) => t.label === tag.label);
    if (index >= 0) {
      tags[index] = tag;
    } else {
      tags.push(tag);
    }
    this.setTags(tags);
  },

  deleteTag(label: string): void {
    const tags = this.getTags().filter((t: any) => t.label !== label);
    this.setTags(tags);
  }
};