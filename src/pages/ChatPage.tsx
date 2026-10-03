import { useUnit } from 'effector-react';
import { ChatWindow, CredentialsForm, PhoneForm, $step } from '../features/chat';
import '../shared/ui/chat.css';

export const ChatPage = () => {
  const step = useUnit($step)

  return (
    <div className="chat-page">
      {step === 'credentials' && <CredentialsForm />}

      {step === 'phone' && <PhoneForm />}

      {step === 'chat' && <ChatWindow />}
    </div>
  );
}
