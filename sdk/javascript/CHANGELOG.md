# @flagix/js-sdk

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
