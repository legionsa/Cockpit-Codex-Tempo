import { db } from './indexedDB';
import { hashPassword } from './crypto';
import { Page, PageTag } from '@/types/page';

const STORAGE_KEYS = {
    PAGES: 'pages',
    TAGS: 'tags',
    SITE_CONFIG: 'siteConfig',
    AUTH: 'isAuthenticated',
    ADMIN_USERNAME: 'admin_username',
    ADMIN_PASSWORD: 'admin_password'
} as const;

/**
 * Migrate data from localStorage to IndexedDB
 * This is a one-time migration that happens on first load
 */
export async function migrateFromLocalStorage(): Promise<void> {
    // Check if migration has already been done
    const migrated = await db.getSetting<boolean>('migration_completed');
    if (migrated) {
        console.log('Migration already completed');
        return;
    }

    console.log('Starting migration from localStorage to IndexedDB...');

    try {
        // Migrate pages
        const pagesJSON = localStorage.getItem(STORAGE_KEYS.PAGES);
        if (pagesJSON) {
            const pages: Page[] = JSON.parse(pagesJSON);

            // Migrate passwords to hashes
            for (const page of pages) {
                if (page.password && !page.passwordHash) {
                    console.log(`Hashing password for page: ${page.title}`);
                    page.passwordHash = await hashPassword(page.password);
                    delete page.password; // Remove plain text
                }
                await db.savePage(page);
            }
            console.log(`Migrated ${pages.length} pages`);
        }

        // Migrate tags
        const tagsJSON = localStorage.getItem(STORAGE_KEYS.TAGS);
        if (tagsJSON) {
            const tags: PageTag[] = JSON.parse(tagsJSON);
            for (const tag of tags) {
                await db.saveTag(tag);
            }
            console.log(`Migrated ${tags.length} tags`);
        }

        // Migrate site config
        const siteConfig = localStorage.getItem(STORAGE_KEYS.SITE_CONFIG);
        if (siteConfig) {
            await db.setSetting('siteConfig', JSON.parse(siteConfig));
            console.log('Migrated site config');
        }

        // Migrate admin credentials (hash if needed)
        const adminUsername = localStorage.getItem(STORAGE_KEYS.ADMIN_USERNAME);
        const adminPassword = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);

        if (adminUsername) {
            await db.setSetting('admin_username', adminUsername);
            console.log('Migrated admin username');
        }

        if (adminPassword) {
            console.log('Hashing admin password...');
            const adminPasswordHash = await hashPassword(adminPassword);
            await db.setSetting('admin_password_hash', adminPasswordHash);
            console.log('Migrated and hashed admin password');
        }

        // Mark migration as complete
        await db.setSetting('migration_completed', true);
        await db.setSetting('migration_date', Date.now());

        console.log('✅ Migration completed successfully!');
        console.log('Note: localStorage data has NOT been deleted for safety. You can clear it manually if desired.');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

/**
 * Export data to JSON for backup
 */
export async function exportToJSON(): Promise<string> {
    const data = await db.exportData();
    return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON backup
 */
export async function importFromJSON(jsonString: string): Promise<void> {
    const data = JSON.parse(jsonString);
    await db.importData(data);
    console.log('✅ Data imported successfully!');
}

/**
 * Clear all IndexedDB data (use with caution!)
 */
export async function clearAllData(): Promise<void> {
    if (confirm('⚠️ This will delete ALL data. Are you sure?')) {
        await db.clear();
        await db.setSetting('migration_completed', false);
        console.log('✅ All data cleared');
    }
}
