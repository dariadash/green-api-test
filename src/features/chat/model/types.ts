import type { GreenApiCredentials } from "../../../shared/api";

export type ChatCredentials = {
  idInstance: string;
  apiTokenInstance: string;
}

export type ChatMessage = {
  id: string;
  text: string;
  fromMe: boolean;
  timestamp: number;
}

export type SendPayload = {
  creds: GreenApiCredentials;
  chatId: string;
  text: string;
}

export type ReceivePayload = {
  creds: GreenApiCredentials;
  chatId: string;
}

export type MessageResponse = {
  id: string;
  text: string
}