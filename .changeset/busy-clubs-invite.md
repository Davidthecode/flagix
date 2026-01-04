---
"@flagix/evaluation-core": minor
"@flagix/js-sdk": minor
"@flagix/react": minor
---

Improved SDK stability and lifecycle management. Added identify method for explicit user identity switching, fixed race conditions during initialization and SSE setup, and ensured feature flags gracefully fallback to 'off' variations when disabled. Fixed potential memory leaks in React hooks and added support for runtime API key changes.
