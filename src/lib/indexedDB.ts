import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Page, PageTag, EditorJSContent } from '@/types/page';

interface CockpitDB extends DBSchema {
    pages: {
        key: string; // page ID
        value: Page;
        indexes: { 'by-slug': string };
    };
    tags: {
        key: string; // tag name
        value: PageTag;
    };
    settings: {
        key: string;
        value: any;
    };
}

const DB_NAME = 'cockpit-ds';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<CockpitDB> | null = null;

/**
 * Get or create IndexedDB instance
 */
export async function getDB(): Promise<IDBPDatabase<CockpitDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<CockpitDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Pages store
            if (!db.objectStoreNames.contains('pages')) {
                const pageStore = db.createObjectStore('pages', { keyPath: 'id' });
                pageStore.createIndex('by-slug', 'slug', { unique: false });
            }

            // Tags store
            if (!db.objectStoreNames.contains('tags')) {
                db.createObjectStore('tags', { keyPath: 'name' });
            }

            // Settings store
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings');
            }
        },
    });

    return dbInstance;
}

/**
 * IndexedDB operations
 */
export const db = {
    // Pages
    async getPages(): Promise<Page[]> {
        const database = await getDB();
        return database.getAll('pages');
    },

    async getPage(id: string): Promise<Page | undefined> {
        const database = await getDB();
        return database.get('pages', id);
    },

    async savePage(page: Page): Promise<string> {
        const database = await getDB();
        return database.put('pages', page);
    },

    async deletePage(id: string): Promise<void> {
        const database = await getDB();
        return database.delete('pages', id);
    },

    async getPageBySlug(slug: string): Promise<Page | undefined> {
        const database = await getDB();
        const index = database.transaction('pages').store.index('by-slug');
        const pages = await index.getAll(slug);
        return pages[0];
    },

    // Tags
    async getTags(): Promise<PageTag[]> {
        const database = await getDB();
        return database.getAll('tags');
    },

    async saveTag(tag: PageTag): Promise<string> {
        const database = await getDB();
        return database.put('tags', tag);
    },

    async deleteTag(name: string): Promise<void> {
        const database = await getDB();
        return database.delete('tags', name);
    },

    // Settings
    async getSetting<T = any>(key: string): Promise<T | undefined> {
        const database = await getDB();
        return database.get('settings', key);
    },

    async setSetting<T = any>(key: string, value: T): Promise<string> {
        const database = await getDB();
        return database.put('settings', value, key);
    },

    async deleteSetting(key: string): Promise<void> {
        const database = await getDB();
        return database.delete('settings', key);
    },

    // Bulk operations
    async clear(): Promise<void> {
        const database = await getDB();
        const tx = database.transaction(['pages', 'tags', 'settings'], 'readwrite');
        await Promise.all([
            tx.objectStore('pages').clear(),
            tx.objectStore('tags').clear(),
            tx.objectStore('settings').clear(),
        ]);
        await tx.done;
    },

    async exportData(): Promise<{ pages: Page[], tags: PageTag[], settings: Record<string, any> }> {
        const database = await getDB();
        const pages = await database.getAll('pages');
        const tags = await database.getAll('tags');

        const settingsStore = database.transaction('settings').store;
        const settingsKeys = await settingsStore.getAllKeys();
        const settingsValues = await settingsStore.getAll();
        const settings: Record<string, any> = {};
        settingsKeys.forEach((key, i) => {
            settings[key as string] = settingsValues[i];
        });

        return { pages, tags, settings };
    },

    async importData(data: { pages: Page[], tags: PageTag[], settings: Record<string, any> }): Promise<void> {
        const database = await getDB();
        const tx = database.transaction(['pages', 'tags', 'settings'], 'readwrite');

        // Import pages
        for (const page of data.pages) {
            await tx.objectStore('pages').put(page);
        }

        // Import tags
        for (const tag of data.tags) {
            await tx.objectStore('tags').put(tag);
        }

        // Import settings
        for (const [key, value] of Object.entries(data.settings)) {
            await tx.objectStore('settings').put(value, key);
        }

        await tx.done;
    }
};
