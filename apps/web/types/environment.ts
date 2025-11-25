export interface BaseEnvironment {
  name: string;
  apiKey: string;
}

export interface FullEnvironment extends BaseEnvironment {
  id: string;
  isDefault: boolean;
  createdAt: string;
  lastSeenAt: string | null;
}
