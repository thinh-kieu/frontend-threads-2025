---
sidebar_position: 1
---

# Frontend Threads

Welcome to the learning notebook for all things frontend. Threads are written in Markdown/MDX and can embed live, editable React code blocks so you can try ideas as you read.

## Repo layout

- `docs/`: Every thread lives here. Use `.md` or `.mdx` so you can mix prose with components.
- `static/`: Drop images, GIFs, or videos here and reference them with absolute paths such as `/img/docusaurus.png`.
- `src/theme/ReactLiveScope`: Provides the default scope for live playgrounds (React, `useState`, `useEffect`).
- `Live React Playground`: A short example showing how to author editable examples.

## Getting started

1. Install dependencies: `npm install`
2. Start the docs site: `npm start`
3. Open http://localhost:3000 to iterate on threads and live playgrounds.

## Adding your own thread

Create a new file in `docs/`, add frontmatter for ordering, and write in MDX. Use the `live` code fence to embed editable examples; see [Live React Playground](./live-react-playground) for a working snippet.
