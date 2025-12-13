export type UpdateVariationsPayload = {
  variations: {
    name: string;
    value: boolean | string | number;
    type: string;
    id?: string;
  }[];
  projectId: string;
};
