import { createEffect, createEvent, createStore } from "effector";
import { interval, or } from "patronum";
import type { ChatCredentials, ChatMessage, ReceivePayload, MessageResponse, SendPayload } from "./types";

export const $credentials = createStore<ChatCredentials | null>(null)
export const setIdInstance = createEvent<string>()
export const setApiTokenInstance = createEvent<string>()

export const $phone = createStore<string>('')
export const setPhone = createEvent<string>()
export const $chatId = createStore<string>('')

export const $messageDraft = createStore<string>('')
export const setMessageDraft = createEvent<string>()

export const $messages = createStore<ChatMessage[]>([])

export const $sendError = createStore<string>('')
export const $pollError = createStore<string>('')

export const credentialsSubmitted = createEvent()
export const phoneSubmitted = createEvent()
export const messageSubmitted = createEvent()

export const changeChatClicked = createEvent()
export const logoutClicked = createEvent()

export const pollingStarted = createEvent()
export const pollingStopped = createEvent()

export const sendMessageFx = createEffect<SendPayload, MessageResponse, Error>()
export const receiveFx = createEffect<ReceivePayload, MessageResponse | null, Error>()

export const polling = interval({
    timeout: 800,
    start: pollingStarted,
    stop: pollingStopped,
});

export const $sending = sendMessageFx.pending
export const $busy = or(sendMessageFx.pending, receiveFx.pending)