import type { EventSourceInit } from "eventsource";

export type FlagStreamConnection = {
  onopen: ((this: FlagStreamConnection, ev: Event) => void) | null;
  onerror: ((this: FlagStreamConnection, ev: Event) => void) | null;
  addEventListener: (
    type: string,
    listener: (event: MessageEvent) => void
  ) => void;
  close: () => void;
};

export async function createEventSource(
  url: string,
  apiKey: string
): Promise<FlagStreamConnection | null> {
  if (typeof window !== "undefined" && "EventSource" in window) {
    return new EventSource(`${url}?apiKey=${apiKey}`) as FlagStreamConnection;
  }

  try {
    // Dynamic import to prevent bundlers from including it in client code
    const { EventSource: NodeEventSource } = await import("eventsource");

    return new NodeEventSource(url, {
      headers: { "X-Api-Key": apiKey },
    } as EventSourceInit) as FlagStreamConnection;
  } catch (error) {
    console.error("[Flagix SDK] SSE not supported in this environment.", error);
    return null;
  }
}
