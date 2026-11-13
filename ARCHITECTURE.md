# Zero

Zero has a monochrome home with three animated columns: Notes, Hardware builds, and Software projects. Legal and support documents belong to their Software project; existing public URLs remain available without a separate Pages directory.

- `/notes`: the shared section landing and original reading layout, retaining subject groups, search, reading progress, outline, quizzes, navigation, and downloads. Old Lattice branding and welcome cards are removed.
- `/build/hardware` and `/build/software`: use the same landing and reader as Notes. Software groups the ten workspace projects and Echo by type, each with at least three documentation pages. Only Hardware retains a sample project. The standalone Pages reader and UI have been removed. Build collections use `buildType` to select their destination; existing collections default to hardware.
- `/pages/echo/{name}`: stable public URLs that open the same Echo project reader and its Legal information sidebar group. Each document's `publicPath` overrides its navigation-derived URL. Known URLs also receive static HTML entry files during the build.
- Admin is a separate local Vite application on port 5175, enabled only with `--mode admin`. The public application on port 5173 has no admin links, route, or API.

The content manager has separate Notes, Hardware builds, and Software projects tabs. Build menus are filtered by `buildType`; legacy build menus default to hardware. New topic groups record their destination so empty groups stay in the correct tab. Drafts retain the selected destination.

`content/catalog.json` is the content registry. `content/navigation.json` records topic-group, menu, nested-section, and document order in the repository. The original source Markdown remains byte-preserved under `content/files/{source}`.

New imports are stored under `content/files/managed/{kind}/{topic-group}/{menu}/{sidebar-path}/NN-name.md`. Reordering managed documents updates their number prefixes without changing the Markdown bytes or public URL. Images remain usable when sections are moved. Original migrated files retain their source paths and use the explicit navigation order.

The shared reader uses the catalog through `src/content-adapter.ts`, including direct public legal URLs. A sidebar group's `publicApp` supplies the app name for future legal imports; replacements retain a document's existing public URL. A collection's optional `websiteUrl` supplies its live-site header button and is editable in local menu settings. `src/zero/section.ts` defines section identities; `accents.css` applies accents over monochrome surfaces. Markdown parsing and rendering are shared with the local import preview.

Drafts live in ignored `.zero/drafts`. The admin stages navigation edits and dropped files in memory until Save. Save validates and writes the selected structure and files to the Zero checkout. Publish performs a separate Git commit and push, using local Git authentication. It requires an initial Git commit and origin remote; importing does not.

Public content under `public/zero-content` is generated only from files registered in the catalog. Symlinks are rejected. The reader is loaded separately from the homepage and prefetched during section entry. HTML sanitization is shared by the public renderer, admin preview, static entry generation, and print exports. The build does not include the admin application or its filesystem/Git API. The original Lattice, Crucible, and LogBook repositories remain migration inputs.

`shared/public-routes.mjs` enumerates published routes and bookmark aliases. Build preparation generates their static HTML entries, and `scripts/verify-build.mjs` verifies route coverage, the deployment prefix, and exclusion of local-only code and files. `npm run check` is the local and CI release gate.

Cascade, LogBook, and obsolete Crucible template documents have been deleted from Zero, including their archives and remaining retired source copies, at user request. Software topic groups have an explicit Software destination so they cannot appear under Hardware in the content manager.
