import { sample } from "effector";
import {
    $busy,
    $chatId,
    $credentials,
    $messageDraft,
    $messages,
    $phone,
    $pollError,
    $sendError,
    $sending,
    logoutClicked,
    messageSubmitted,
    phoneSubmitted,
    polling,
    pollingStopped,
    receiveFx,
    sendMessageFx,
    setApiTokenInstance,
    setIdInstance,
    setMessageDraft,
    setPhone
} from "./private";
import type { ReceivePayload, SendPayload } from "./types";
import { getApiErrorMessage, pollOnce, sendMessage, type GreenApiCredentials } from "../../../shared/api";


$credentials
    .on(setIdInstance, (s, id) => ({ ...s, idInstance: id }))
    .on(setApiTokenInstance, (s, api) => ({ ...s, apiTokenInstance: api }))
    .reset(logoutClicked)

$phone
    .on(setPhone, (_, phone) => phone)
    .reset(logoutClicked)

$chatId
    .on($phone.updates, (_, phone) => {
        const digits = phone.replace(/\D/g, '')
        return `${digits}@c.us`
    })
    .reset(logoutClicked)

$messageDraft
    .on(setMessageDraft, (_, m) => m)
    .reset(sendMessageFx.done)

$messages
    .on(sendMessageFx.doneData, (list, { id, text }) => [
        ...list,
        { id, text, fromMe: true, timestamp: Date.now() },
    ])
    .on(receiveFx.doneData, (list, incoming) => {
        if (!incoming) return list
        if (list.some((m) => m.id === incoming.id)) return list
        return [...list, { ...incoming, fromMe: false, timestamp: Date.now() }]
    })
    .reset(phoneSubmitted, logoutClicked)

$sendError
    .on(sendMessageFx.failData, (_, error) => error.message)
    .reset(messageSubmitted, phoneSubmitted, logoutClicked)

$pollError
    .on(receiveFx.failData, (_, error) => error.message)
    .on(receiveFx.done, () => '')
    .reset(pollingStopped, phoneSubmitted, logoutClicked)


sample({
    clock: messageSubmitted,
    source: { creds: $credentials, chatId: $chatId, sending: $sending, text: $messageDraft },
    filter: ({ creds, chatId, sending, text }) =>
        Boolean(creds) && Boolean(chatId) && !sending && text.trim().length > 0,
    fn: ({ creds, chatId, text }): SendPayload => ({
        creds: creds as GreenApiCredentials,
        chatId,
        text: text.trim(),
    }),
    target: sendMessageFx,
})

sendMessageFx.use(async ({ creds, chatId, text }) => {
    try {
        const id = await sendMessage(creds, chatId, text)
        return { id, text }
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Не удалось отправить сообщение'), {
            cause: error,
        })
    }
})


sample({
    clock: polling.tick,
    source: { creds: $credentials, chatId: $chatId, busy: $busy },
    filter: ({ creds, chatId, busy }) => Boolean(creds) && Boolean(chatId) && !busy,
    fn: ({ creds, chatId }): ReceivePayload => ({
        creds: creds as GreenApiCredentials,
        chatId,
    }),
    target: receiveFx,
})

receiveFx.use(async ({ creds, chatId }) => {
    try {
        return await pollOnce(creds, chatId, 5)
    } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Ошибка получения сообщений'), {
            cause: error,
        })
    }
})