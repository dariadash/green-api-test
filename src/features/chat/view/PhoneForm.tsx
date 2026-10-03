import { useState } from 'react';
import { useUnit } from 'effector-react';

import { Button } from '../../../shared/ui';
import { $phone, logoutClicked, phoneSubmitted, setPhone } from '../model/private';


export const PhoneForm = () => {
  const phone = useUnit($phone)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      setError('Введите корректный номер телефона (минимум 10 цифр)')
      return
    }
    setError('')
    phoneSubmitted()
  }

  return (
    <div className="chat-card">
      <h1 className="chat-title">Новый чат</h1>
      <p className="chat-subtitle">
        Введите номер телефона получателя в международном формате, например
        79876543210
      </p>
      <form onSubmit={handleSubmit} className="chat-form">
        <label className="chat-field">
          <span>Номер телефона</span>
          <input
            type="tel"
            autoComplete="off"
            placeholder="79876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        {error && <div className="chat-error">{error}</div>}
        <Button type="submit">Открыть чат</Button>
        <Button type="button" variant="ghost" onClick={() => logoutClicked()}>
          Сменить учетные данные
        </Button>
      </form>
    </div>
  );
}
