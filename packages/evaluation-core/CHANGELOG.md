# @flagix/evaluation-core

## 1.5.0

### Minor Changes

- f696cb9: \*Simplified SDK initialization by making apiBaseUrl internal

  - Added support for \_\_internal_baseUrl for local development.

  - Updated event endpoints to /sync to improve reliability.

## 1.2.0

### Minor Changes

- 4e879d8: Improved SDK stability and lifecycle management. Added identify method for explicit user identity switching, fixed race conditions during initialization and SSE setup, and ensured feature flags gracefully fallback to 'off' variations when disabled. Fixed potential memory leaks in React hooks and added support for runtime API key changes.

## 1.1.0

### Minor Changes

- ab7f12d: initial release
