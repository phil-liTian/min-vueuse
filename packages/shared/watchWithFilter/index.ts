import { WatchOptions } from "vue";
import { ConfigableEventFilter } from "../utils/filters";

export interface WatchWithFilterOptions<Immediate> extends WatchOptions<Immediate>, ConfigableEventFilter {}

