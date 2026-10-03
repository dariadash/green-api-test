import axios from 'axios';
import {
  type GreenApiCredentials,
  type GreenApiError,
  type IncomingTextMessage,
  type ReceiveNotificationResponse,
  type SendMessageResponse,
} from './types';
import { greenApiClient } from './client';

const RECEIVE_TIMEOUT_SEC = 5

const isGreenApiError = (data: unknown): data is GreenApiError => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    (data as GreenApiError).status === 'error'
  )
}

const instanceBase = (creds: GreenApiCredentials) => `/waInstance${creds.idInstance}`

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (isGreenApiError(data)) return data.message ?? fallback
    if (error.response) {
      return `${fallback} (${error.response.status}): ${JSON.stringify(data)}`
    }
    return error.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}

export const sendMessage = async (creds: GreenApiCredentials, chatId: string, message: string) => {
  const { data } = await greenApiClient.post<SendMessageResponse>(
    `${instanceBase(creds)}/sendMessage/${creds.apiTokenInstance}`,
    { chatId, message }
  )

  if (isGreenApiError(data)) {
    throw new Error(data.message ?? 'sendMessage error')
  }
  if (!data?.idMessage) {
    throw new Error(`Unexpected sendMessage response: ${JSON.stringify(data)}`)
  }

  return data.idMessage
}

export const receiveNotification = async (creds: GreenApiCredentials, receiveTimeout = RECEIVE_TIMEOUT_SEC) => {
  const { data } = await greenApiClient.get<ReceiveNotificationResponse | null>(
    `${instanceBase(creds)}/receiveNotification/${creds.apiTokenInstance}`, {
    params: { receiveTimeout }
  })

  if (data === null || typeof data !== 'object' || typeof data.receiptId !== 'number') return null
  if (isGreenApiError(data)) {
    throw new Error(data.message ?? 'receiveNotification error')
  }

  return { receiptId: data.receiptId, body: data.body }
}

export const deleteNotification = async (creds: GreenApiCredentials, receiptId: number) => {
  await greenApiClient.delete(
    `${instanceBase(creds)}/deleteNotification/${creds.apiTokenInstance}/${receiptId}`
  )
}

const extractIncomingText = (body: ReceiveNotificationResponse['body']): IncomingTextMessage | null => {
  if (typeof body !== 'object' || body === null) return null

  if (body.typeWebhook !== 'incomingMessageReceived') return null

  const text = body.messageData?.textMessageData?.textMessage ?? ''
  const senderChatId = body.senderData?.chatId ?? body.senderData?.sender ?? ''
  if (!text || !senderChatId) return null

  return {
    id: body.idMessage,
    chatId: senderChatId,
    text,
  }
}

export const pollOnce = async (creds: GreenApiCredentials, chatId: string, receiveTimeout = RECEIVE_TIMEOUT_SEC) => {
  const notif = await receiveNotification(creds, receiveTimeout)
  if (!notif) return null
  try {
    const incoming = extractIncomingText(notif.body)
    if (incoming && incoming.chatId === chatId) {
      return { id: incoming.id, text: incoming.text }
    }
    return null
  } finally {
    await deleteNotification(creds, notif.receiptId)
  }
}
