# @flagix/js-sdk

## 1.4.0

### Minor Changes

- f452756: migrated internal tracking and evaluation endpoints to a generic /api/sync path. This change is to improve the SDK reliability by bypassing aggressive tracking filters in browser privacy extensions and ad-blockers

## 1.3.1

### Patch Changes

- 818fc23: Fixed an issue where evaluation and event tracking requests were being blocked by certain browser privacy extensions and ad-blockers. Replaced navigator.sendBeacon with fetch + keepalive to improve the delivery reliability

## 1.3.0

### Minor Changes

- 4e879d8: Improved SDK stability and lifecycle management. Added identify method for explicit user identity switching, fixed race conditions during initialization and SSE setup, and ensured feature flags gracefully fallback to 'off' variations when disabled. Fixed potential memory leaks in React hooks and added support for runtime API key changes.

### Patch Changes

- Updated dependencies [4e879d8]
  - @flagix/evaluation-core@1.2.0

## 1.2.0

### Minor Changes

- 70d02db: feat: implement reactive context synchronization

  - Added 'context' prop to FlagixProvider for automatic SDK syncing.
  - Updated setContext to trigger real-time updates for all flag listeners.
  - Improved FlagixProvider stability to prevent unnecessary re-initializations.

## 1.1.0

### Minor Changes

- ab7f12d: initial release

### Patch Changes

- Updated dependencies [ab7f12d]
  - @flagix/evaluation-core@1.1.0
