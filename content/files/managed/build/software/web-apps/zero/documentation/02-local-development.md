# Zero — Local development

## Local development

Run these commands from the project repository. Commands listed here were inspected, not executed as part of writing this page.

~~~sh
npm ci
npm run dev
# In a separate terminal:
npm run admin
# Verification:
npm test
npm run verify:content
npm run build
~~~

## Project notes

The public development site uses port 5173; the separate admin uses 5175 and binds to localhost. Continue reading belongs to each section. Legal and support documents use /pages/{app}/{name}. Drafts and local tooling are ignored by Git. Publishing requires an origin remote in addition to the local repository and identity.

## Documentation sources

Prepared from the local repository README, package manifests, and the listed source folders on 13 November 2026.

Package version in this checkout: **0.1.0**. This is a source snapshot, not a statement about the latest public release.

The repository is local. README.md and ARCHITECTURE.md describe the app and content workflow.
