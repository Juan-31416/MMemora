import { app } from 'electron';
import * as fs from 'fs/promises';
import * as path from 'path';



const LEGACY_APP_NAME = 'MindMapper';
const CURRENT_APP_NAME = 'MMemora';
const MIGRATION_MARKER = '.migrated';



export function resolveUserDataPaths() {
    const base = app.getPath('appData');
    return {
        legacyPath: path.join(base, LEGACY_APP_NAME),
        currentPath: path.join(base, CURRENT_APP_NAME),
    };
}

async function pathExists(target:string): Promise<boolean> {
    try {
        await fs.access(target);
        return true;
    } catch {
        return false;
    }
}



/**
 * Migrates legacy userData from `MindMapper` to `MMemora` (Phase 1 rebrand).
 */
export async function migrateLegacyUserData(): Promise<void> {
    const { legacyPath, currentPath } = resolveUserDataPaths();

    const legacyExists = await pathExists(legacyPath);
    if (!legacyExists){
        return;
    }

    const markerPath = path.join(currentPath, MIGRATION_MARKER);
    if (await pathExists(markerPath)) {
        return;
    }

    try {
        await fs.mkdir(currentPath, { recursive: true });
        await fs.cp(legacyPath, currentPath, {
            recursive: true,
            force: false,
            errorOnExist: false,
        });
        await fs.writeFile(
            markerPath,
            JSON.stringify({
                migratedAt: new Date().toISOString(),
                fromApp: LEGACY_APP_NAME,
                toApp: CURRENT_APP_NAME,
            }),
            'utf-8'
        );
        console.log(`[migration] userData migrated: ${legacyPath} -> ${currentPath}`);
    } catch (error) {
        console.error('[migration] Failed to migrate legacy userData:', error);
    }
}