import { createStore } from "effector";
import type { ChatStep } from "./types";

export const $step = createStore<ChatStep>('credentials')