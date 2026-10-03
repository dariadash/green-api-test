import { useEffect } from 'react';
import { useUnit } from 'effector-react';

import { Button } from '../../../shared/ui';
import {
  $chatId,
  $messageDraft,
  $messages,
  $phone,
  $pollError,
  $sendError,
  $sending,
  changeChatClicked,
  logoutClicked,
  messageSubmitted,
  pollingStarted,
  pollingStopped,
  setMessageDraft,
} from '../model/private';

export const ChatWindow = () => {
  const [messages, chatId, phone, sending, sendError, pollError, draft] = useUnit([
    $messages,
    $chatId,
    $phone,
    $sending,
    $sendError,
    $pollError,
    $messageDraft
  ])

  useEffect(() => {
    pollingStarted()
    return () => pollingStopped()
  }, [])

  const handleSend = (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!draft.trim() || sending) return
    messageSubmitted()
  }

  return (
    <div className="chat-window">
      <header className="chat-header">
        <div>
          <div className="chat-peer">+{phone}</div>
          <div className="chat-sub">{chatId}</div>
        </div>
        <div className="chat-header-actions">
          <button className="chat-link" onClick={() => changeChatClicked()}>
            Сменить чат
          </button>
          <button className="chat-link" onClick={() => logoutClicked()}>
            Выйти
          </button>
        </div>
      </header>

      {pollError && <div className="chat-notice">{pollError}</div>}

      <div className="chat-list">
        {messages.length === 0 && (
          <div className="chat-empty">
            Сообщений пока нет. Напишите первым — ответ получателя из
            мессенджера появится здесь.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble ${m.fromMe ? 'out' : 'in'}`}>
            <div className="chat-text">{m.text}</div>
            <div className="chat-time">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {sendError && <div className="chat-error">{sendError}</div>}

      <form onSubmit={handleSend} className="chat-inputbar">
        <div className="chat-inputbar-wrapper">
          <input
            type="text"
            placeholder="Введите сообщение..."
            value={draft}
            onChange={(e) => setMessageDraft(e.target.value)}
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !draft.trim()}>
            {sending ? '...' : <span className="chat-btn-icon" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
