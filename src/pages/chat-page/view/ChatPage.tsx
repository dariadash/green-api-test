import { useUnit } from 'effector-react';
import { ChatWindow, CredentialsForm, PhoneForm } from '../../../features/chat';
import { $step } from '../model/private';
import '../../../shared/ui/chat.css';

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
