---
"@flagix/js-sdk": minor
"@flagix/react": minor
---

feat: implement reactive context synchronization

- Added 'context' prop to FlagixProvider for automatic SDK syncing.
- Updated setContext to trigger real-time updates for all flag listeners.
- Improved FlagixProvider stability to prevent unnecessary re-initializations.
