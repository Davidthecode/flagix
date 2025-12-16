import EventEmitter from "eventemitter3";
import { EVENT_TO_LISTEN } from "@/lib/constants";

export type FlagixEvents = {
  "flag-update": (flagKey: string) => void;
};

export const FLAG_UPDATE_EVENT = EVENT_TO_LISTEN;

export class FlagixEventEmitter extends EventEmitter<FlagixEvents> {}
