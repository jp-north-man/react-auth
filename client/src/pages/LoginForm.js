import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthProvider';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('ログインに失敗しました。');
      }

      const data = await response.json();
      setTimeout(() => {
        login(data.token, data.user);
      }, 1000);
      setError(null);
    } catch (error) {
        setError(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
