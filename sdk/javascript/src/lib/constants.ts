export const REMOVE_TRAILING_SLASH = /\/$/;

export type FlagUpdateType =
  | "FLAG_CREATED"
  | "FLAG_UPDATED"
  | "FLAG_DELETED"
  | "FLAG_METADATA_UPDATED"
  | "FLAG_STATE_TOGGLED"
  | "RULE_UPDATED"
  | "RULE_DELETED";

export const EVENT_TO_LISTEN = "flag-update";
export const FLAGIX_API_URL = "https://api.flagix.com";
