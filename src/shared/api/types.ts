export type GreenApiCredentials = {
  idInstance: string;
  apiTokenInstance: string;
}

export type SendMessageResponse = {
  idMessage: string;
}

export type ReceiveNotificationResponse = {
  receiptId: number;
  body: {
    typeWebhook?: string;
    instanceData?: {
      idInstance?: number,
      wid?: string
      typeInstance?: string
    },
    timestamp?: number;
    idMessage?: string;
    senderData?: {
      chatId?: string;
      sender?: string;
      senderName?: string;
      senderContactName?: string;
    };
    messageData?: {
      typeMessage?: string;
      textMessageData?: {
        textMessage?: string;
      };
    };
  };
}

export type GreenApiError = {
  code?: string;
  message?: string;
  status?: string;
}

export type IncomingTextMessage = {
  id: string;
  chatId: string;
  text: string;
}
