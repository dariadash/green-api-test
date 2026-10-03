import { useState } from 'react';
import { useUnit } from 'effector-react';

import { Button } from '../../../shared/ui';
import { $credentials, credentialsSubmitted, setApiTokenInstance, setIdInstance } from '../model/private';


export const CredentialsForm = () => {
  const credentials = useUnit($credentials)

  const [error, setError] = useState('')

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!credentials.idInstance.trim() || !credentials.apiTokenInstance.trim()) {
      setError('Введите idInstance и apiTokenInstance')
      return
    }
    setError('')
    credentialsSubmitted()
  }

  return (
    <div className="chat-card">
      <h1 className="chat-title">Вход в Green-API</h1>
      <p className="chat-subtitle">
        Введите учетные данные инстанса из личного кабинета
      </p>
      <form onSubmit={handleSubmit} className="chat-form">
        <label className="chat-field">
          <span>idInstance</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="1101000001"
            value={credentials?.idInstance ?? ''}
            onChange={(e) => setIdInstance(e.target.value)}
          />
        </label>
        <label className="chat-field">
          <span>apiTokenInstance</span>
          <input
            type="password"
            autoComplete="off"
            placeholder="ваш apiTokenInstance"
            value={credentials?.apiTokenInstance ?? ''}
            onChange={(e) => setApiTokenInstance(e.target.value)}
          />
        </label>
        {error && <div className="chat-error">{error}</div>}
        <Button type="submit">Продолжить</Button>
      </form>
    </div>
  );
}
