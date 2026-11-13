# Deploy Zero

Zero builds to a static GitHub Pages site. The local admin and its filesystem/Git API are not part of the deployment.

## Before the first push

Use Node 22 (`.nvmrc`) and install the locked dependencies:

```sh
npm ci
npm run check
npm audit
```

`check` requires clean lint, passing tests, preserved source-content hashes, a successful build, and a verified public artifact. The artifact check confirms published routes, asset prefixes, and absence of admin code, drafts, credentials files, and archives. The dependency override for the lint parser selects patched minimatch 11 instead of its vulnerable transitive version.

Create an empty GitHub repository for Zero, or use an existing empty remote. Connect the actual URL from that repository, then push:

```sh
git remote add origin https://github.com/YOUR-ACCOUNT/Zero.git
git push -u origin main
```

No remote is assumed or created by the local build. Do not initialize the remote with a separate README or license when pushing this existing history.

## Enable GitHub Pages

In the repository, open **Settings → Pages → Build and deployment** and select **GitHub Actions** as the source. If the first run happens before Pages is enabled, enable it and rerun the workflow.

The workflow validates pull requests and pushes to `main`. Only successful `main` builds deploy, using the `github-pages` environment and GitHub's workflow token. No personal token or Git credentials are needed in the website.

For a repository named Zero, the workflow builds with `/Zero/` as the asset prefix. The expected URL is `https://YOUR-ACCOUNT.github.io/Zero/`. A user site or a `public/CNAME` file switches the build to `/`. Configure custom-domain DNS and the repository Pages settings separately before using a custom domain.

For a local repository-path preview:

```powershell
$env:ZERO_BASE_PATH='/Zero/'
npm run build
npm run preview
```

Open the preview URL with `/Zero/` appended. Remove the override before returning to local root development:

```powershell
Remove-Item Env:ZERO_BASE_PATH
```

## Published behavior

- Notes and project routes have static entry files, including the old `/learn/...` bookmark aliases.
- Echo's `/pages/echo/...` legal URLs remain direct entry points into its Software project reader.
- An unknown route gets the public not-found view through `404.html`.
- The build copies only registered content files. Saved/public content is public even when unlisted; use local drafts for unpublished work.
- Markdown formatting is sanitized consistently in public reading, local previews, static pages, and print exports.
- Retired Cascade, LogBook, and Crucible template content has been deleted from the checkout.

After deployment, open the homepage, a direct Notes URL, a Software project, and `/pages/echo/privacy-policy`. Refresh each direct route and verify that its assets load from the correct prefix. Confirm `/create` and `/__zero/state` do not expose an editor or API.

References: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Vite static deployment](https://vite.dev/guide/static-deploy).
