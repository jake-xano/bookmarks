# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static bookmarks page designed for GitHub Pages. No build step — just HTML + a markdown data file.

## Architecture

- **index.html** — Self-contained page with inline CSS and JS. Fetches `bookmarks.md` at runtime, parses it into categories, and renders a dark-themed grid of favicon cards.
- **bookmarks.md** — Data file defining all bookmarks. Categories are `## Headings`, bookmarks are markdown links (`- [Name](url)`). Optional `icon:URL` suffix on a line overrides the default favicon.

## Bookmark Format

```markdown
## Category Name

- [Site Name](https://example.com)
- [Site Name](https://example.com) icon:https://custom-icon-url.png
```

Default icons are pulled from Google's favicon API. The `icon:` suffix overrides this with a custom URL.

## Development

Open `index.html` in a browser. Because it uses `fetch()` to load `bookmarks.md`, you need to serve files over HTTP (not `file://`):

```
npx serve .
# or
python3 -m http.server
```

## Deployment

Push to a GitHub repo with GitHub Pages enabled (serve from root of `main` branch). No build or CI needed.
