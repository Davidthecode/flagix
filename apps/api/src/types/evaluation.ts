export type EvaluationEvent = {
  projectId: string;
  environmentId: string;
  flagKey: string;
  distinctId: string;
  variationName: string | null;
  variationValue: unknown;
  variationType: string | null;
  evaluationContextJson: string;
  evaluatedAt: string;
};

export type CustomEvent = {
  projectId: string;
  environmentId: string;
  eventName: string;
  distinctId: string;
  propertiesJson: string;
  timestamp: string;
};

export type QueueItem = EvaluationEvent | CustomEvent;
