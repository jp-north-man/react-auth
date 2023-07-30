import React, { useState } from 'react';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    try {
        const response = await fetch('http://localhost:5000/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('サインアップに失敗した');
        }

        setEmail('');
        setPassword('');
        setError(null);  // サインアップが成功したら、既存のエラーをクリア

        // ログインページにリダイレクト
        window.location.href = '/login';
    } catch (error) {
        setError(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p>{error}</p>}
        <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
