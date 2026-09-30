# ADR 008: Project Rebranding to MMemora & userData Migration Strategy (Issue #31)

**Date:** 2026-09-30
**Status:** Accepted / In Progress
**Issue:** [#31: Project Identity Rebrand (MindMapper → MMemora)](https://github.com/Juan-31416/MindMapper/issues/31)

## Context and Problem Statement

MindMapper is entering its final pre-release cycle (v0.4.0) before v1.0.0. As part of this cycle, the product is being renamed from **MindMapper** to **MMemora**. This is a purely identity-level change (package name, application id, product name, and user-facing branding); it does not alter the mind map data model, file formats, or feature set.

The rename introduces one significant risk: Electron resolves `app.getPath('userData')` from the application's identity (`name` in `package.json` / `productName` in the packaged app). Without explicit handling, renaming the product would silently cause the application to read/write from a brand-new, empty `userData` directory on next launch, orphaning any local preferences of existing installations.

Because MMemora remains local-first and privacy-first, the resolution must:

- Never transmit or touch anything outside the local filesystem.
- Never delete the legacy directory automatically.
- Be safe to run on every launch without user intervention.
- Not require the user to make any manual choice or migration step.

A secondary problem, found during the audit for this rebrand, is a duplicate registration of the `menu:setLabels` IPC handler in `src/main/main.ts`, which throws at runtime the second time it is registered. This is fixed as part of the same issue since it blocks a stable v0.4.0 baseline.

## Objectives

- Ship the application under the name **MMemora**, with a stable `appId` (`com.cardaniantech.mmemora`) and `productName` (`MMemora`).
- Guarantee that any existing local installation under the legacy identity (`MindMapper`) has its `userData` directory (preferences, and anything Chromium stores there — `Local Storage`, `IndexedDB`, etc.) migrated to the new location without user action.
- Guarantee the migration is idempotent and non-destructive.
- Remove the duplicate IPC handler registration bug.
- Update all user-facing hardcoded brand references (native menu, dialogs, translation resources).
- Introduce a base CI workflow to validate typechecking and build on every push/PR, independent from the existing tag-triggered release pipeline.
- Correct `ARCHITECTURE.md`, which incorrectly describes SQLite as the persistence layer; the actual persistence today is `localStorage` (via `SettingsService`) plus manually exported/imported `.mindmap.json` files.

## Decision

MMemora will explicitly pin its `userData` path via `app.setPath('userData', ...)` at the very start of the main process bootstrap, before `app.whenReady()` and before any subsystem can write to the default (identity-derived) path. A dedicated migration utility detects a legacy `MindMapper` directory and performs a one-time, additive copy into the new `MMemora` directory, marking completion with a `.migrated` marker file.

This decouples userData location from the app's display identity going forward, so any future rebranding event can reuse the same mechanism without new architectural work.

## Architecture

### Migration Flow

```text
app process bootstrap
        │
        ▼
Resolve paths BEFORE app.whenReady()
        │
        ├── legacyPath  = <appData>/MindMapper
        └── currentPath = <appData>/MMemora
        │
        ▼
app.setPath('userData', currentPath)
        │
        ▼
app.whenReady()
        │
        ▼
migrateLegacyUserData()
        │
        ├── legacyPath does not exist ─────────────► no-op (clean install)
        │
        ├── currentPath/.migrated exists ──────────► no-op (already migrated)
        │
        └── otherwise:
                │
                ├── mkdir currentPath (recursive)
                ├── fs.cp(legacyPath → currentPath, recursive, non-destructive)
                ├── write currentPath/.migrated (timestamp + source/target identity)
                │
                └── on error: log only, never throw, never delete legacyPath
        │
        ▼
createWindow() / createApplicationMenu() / IPC handlers registration
```

### Process Boundaries

The migration logic lives entirely in the **Main Process** (`src/main/migration/userDataMigration.ts`), since only Main has privileged filesystem access. The Renderer and Preload layers are unaffected — they continue to interact with persisted data exclusively through existing IPC channels and `localStorage`, unaware that a migration occurred.

### State Ownership

- **Main process**: owns `userData` path resolution and the one-time migration routine.
- **Renderer / SettingsService**: unaffected; continues to read/write `localStorage` under whatever `userData` path Main has already fixed before the renderer is created.
- **No Zustand or renderer state is involved** in this migration; it is a boot-time filesystem operation, not application state.

## Implementation

### 1. Package Identity (`package.json`)

```diff
- "name": "mindmapper",
- "version": "0.3.0",
+ "name": "mmemora",
+ "version": "0.4.0",
  ...
  "build": {
-   "appId": "com.mindmapper.app",
-   "productName": "MindMapper",
+   "appId": "com.cardaniantech.mmemora",
+   "productName": "MMemora",
```

### 2. Migration Utility

New file: `src/main/migration/userDataMigration.ts`.

Responsibilities:
- `resolveUserDataPaths()`: computes `legacyPath` and `currentPath` from `app.getPath('appData')`.
- `migrateLegacyUserData()`: performs the guarded, idempotent, non-destructive copy described above.

Guarantees enforced in code:
- **Idempotent**: guarded by a `.migrated` marker file inside `currentPath`, not just a directory-existence check (a partial `currentPath` from a previously interrupted migration must not be mistaken for a completed one).
- **Non-destructive**: uses `fs.cp` (copy), never `fs.rename` or deletion of `legacyPath`. The legacy directory is left untouched indefinitely.
- **Fail-safe**: any error during copy is logged (`console.error`) but never re-thrown, so the application always boots, even with a partially migrated or empty `currentPath`.

### 3. Main Process Bootstrap (`src/main/main.ts`)

```diff
+ import { migrateLegacyUserData, resolveUserDataPaths } from './migration/userDataMigration';
+
+ const { currentPath } = resolveUserDataPaths();
+ app.setPath('userData', currentPath);

- app.whenReady().then(() => {
+ app.whenReady().then(async () => {
+   await migrateLegacyUserData();
    createWindow();
    createApplicationMenu();
    ...
  });
```

### 4. Duplicate IPC Handler Bug Fix

Removed the first, untyped duplicate registration of `menu:setLabels`, keeping only the typed one using the shared `MenuLabels` contract:

```diff
- ipcMain.handle('menu:setLabels', (event, labels: any) => {
-   createApplicationMenu(labels);
- });
-
- // Handler to apply menu labels
  ipcMain.handle('menu:setLabels', (_event, labels: MenuLabels) => {
    createApplicationMenu(labels);
  });
```

### 5. Brand References

- Native menu "About" dialog title/message updated from `MindMapper` to `MMemora`.
- GitHub documentation link updated to `https://github.com/Juan-31416/MindMapper` (repository retains its original name at the user's discretion; product name and repository name are intentionally decoupled).
- `locales/es/translation.json` and `locales/en/translation.json`: the `about` key (and any other literal "MindMapper" occurrence) updated to "MMemora".

### 6. CI Base Workflow

New `.github/workflows/ci.yml`, triggered on `push`/`pull_request` to `main`/`develop`, running on a Windows/macOS/Linux matrix:
- Install dependencies.
- Typecheck `main`, `preload`, and `renderer` TypeScript projects independently (`tsc --noEmit`).
- Run the full `npm run build`.

This is intentionally separate from `.github/workflows/release.yml`, which remains tag-triggered and responsible only for packaging and publishing installers.

### 7. Documentation Correction

`ARCHITECTURE.md` incorrectly stated SQLite as the persistence layer ("single source of truth"). Corrected to reflect the actual mechanism: `localStorage` (via `SettingsService`) for preferences, and manually exported/imported `.mindmap.json` files for mind map data. A new **"Data Migration Strategy"** section documents the mechanism described in this ADR.

## Consequences

### Positive

- Existing users upgrading to v0.4.0 keep their local preferences and any Chromium-managed storage without any manual step.
- The `userData` path is no longer implicitly coupled to `productName`, eliminating this entire class of risk for any future rebrand.
- A latent runtime crash (duplicate IPC handler) is fixed as part of establishing a stable pre-1.0.0 baseline.
- CI now gates every push/PR, not only tagged releases.
- Documentation is now accurate regarding the real persistence mechanism.

### Negative / Trade-offs

- The legacy `MindMapper` directory is never cleaned up automatically; over time it becomes disk-space debt that must be addressed manually or in a future issue.
- `fs.cp` with `force: false` will skip files that already exist at the destination rather than overwrite them, which is correct for a first-time migration but means a manually corrupted `currentPath` prior to migration could result in a partially merged state. Considered acceptable given the marker-file idempotency guard.
- Repository name (`MindMapper` on GitHub) and product name (`MMemora`) remain decoupled unless manually renamed later, which is a minor but real source of confusion for new contributors.

## Alternatives Considered

### Rename `userData` In-Place (`fs.rename`)

Rejected: a rename is not atomic across filesystem boundaries (e.g. `userData` symlinked to another drive) and, if interrupted, can leave the legacy directory partially emptied with no safe recovery path. A copy is strictly safer for irreplaceable user data.

### Symlink Legacy Path to New Path

Rejected: not reliably supported without elevated privileges on Windows, breaking cross-platform consistency, which is a hard requirement for MMemora.

### Rely on Electron's Default `productName`-Derived Path Without Explicit `setPath`

Rejected: this is exactly the behavior causing the data-loss risk being solved. Explicit `app.setPath('userData', ...)` gives full, deterministic control independent of any future branding change.

## Verification Checklist

- [ ] `npm run build` succeeds with the new `package.json` identity.
- [ ] Packaged app installs and launches under the name `MMemora` on Windows/macOS/Linux.
- [ ] Fresh install (no legacy directory) boots directly into the `MMemora` userData path with no migration side effects.
- [ ] Simulated legacy install (`MindMapper` directory pre-populated) results in its contents being copied into `MMemora` on first launch.
- [ ] Second launch after migration does not re-copy or duplicate data (idempotency).
- [ ] Legacy `MindMapper` directory still exists and is untouched after migration.
- [ ] `menu:setLabels` IPC handler is registered exactly once; app does not crash on startup.
- [ ] Native "About" dialog and menu show "MMemora", not "MindMapper".
- [ ] `locales/es/translation.json` and `locales/en/translation.json` contain no leftover "MindMapper" strings.
- [ ] `ci.yml` passes typecheck and build on a clean checkout, on all three OS runners.
- [ ] `ARCHITECTURE.md` no longer references SQLite as the persistence layer and documents the migration strategy.

## Follow-up Work

- Decide, in a future issue, whether/when to prompt users to manually delete the legacy `MindMapper` directory once migration has been confirmed stable across a release cycle.
- Consider renaming the GitHub repository to `MMemora` to match the product identity (tracked separately, outside this issue's scope).
