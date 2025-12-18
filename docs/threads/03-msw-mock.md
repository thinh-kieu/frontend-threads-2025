---
nav: Threads
order: 3
---

# MSW Mocking Strategy

## Goal

This has been a long-standing obsession of mine: I want to run a project end-to-end, understand requirements, and validate UX without standing up a full backend stack, databases, or supporting infrastructure. The mock layer needs to be solid enough for daily development and onboarding.

> Key idea: ship a client-only mock server that behaves like real endpoints.

## Why MSW

For the project I worked on this year, I deliberately invested time (including personal time) to design a durable mocking mechanism. [MSW (Mock Service Worker)](https://mswjs.io/) was the tool I chose.

MSW is a client-agnostic API mocking library. It intercepts outbound HTTP requests (fetch, axios, etc.) and responds as if a real backend handled them. Mocks are reusable across frameworks, tools, and environments.

## How it works

- Run the app in `mock` mode (optional).
- Boot a mock server inside the client.
- Route requests to local handlers that return realistic payloads.

## Project setup

### 1) Enable mock mode

In that project, I added a `dev:mock` script. When it runs, the environment switches to `mock`, and the mock bootstrap is executed.

```jsx|pure
// main.tsx
if (import.meta.env.MODE === 'mock') {
  const { setupApiMocks } = await import('./mocks/apiMocks');
  const { setupSocketMocks } = await import('./mocks/socketMocks');

  await setupApiMocks();
  setupSocketMocks();
}
```

### 2) Start the MSW worker

```jsx|pure
// apiMocks.tsx
export const setupApiMocks = async () => {
  const { setupWorker } = await import('msw/browser');
  const { authHandlers } = await import('@src/app/auth/apis/mocks');

  await setupWorker(...authHandlers).start({
    onUnhandledRequest: 'bypass',
  });
};
```

## Example handler

```jsx|pure
export const loginHandler = http.post<any, LoginRequest, LoginResponse>(
  '/auth/api/login',
  async ({ request }) => {
    const { username, password } = await request.json();

    return HttpResponse.json({
      userId: 'user-123',
      username,
      accessToken: await generateAccessToken(),
      refreshToken: await generateRefreshToken(),
      expiresIn: 100000,
      role: 'user',
    });
  },
);
```

## Coverage and collaboration

In that project, I mocked most APIs, including complex flows like video streaming. Over time, as teammates reviewed the codebase, they also started contributing their own handlers. The mock layer became a shared, actively used part of the workflow.

## Strengths and trade-offs

**Strengths**

- Frontend flows remain unchanged.
- Integration focuses on validating real responses rather than rewriting UI logic.
- Useful when frontend and backend are developed by different engineers.

**Trade-offs**

- Mocks must be updated when backend endpoints or response shapes change.
- Coverage is usually near-complete, not a perfect mirror of every edge case. Personally, when APIs are already available, or when an API requires complicated logic (queue management, progress across multiple processes), I often just use the real backend because it is faster and less annoying.

## Demo

```jsx
import React, { useEffect, useState } from 'react';
import { Login } from 'ft2025/app/auth';
import { setupApiMocks } from 'ft2025/mocks/api-mocks';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    setupApiMocks().then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  if (!ready) return null;

  return <Login />;
}
```
