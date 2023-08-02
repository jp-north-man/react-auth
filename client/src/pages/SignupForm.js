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
    <div className='flex justify-center my-24'>
      <div className='w-96'>
        アカウント登録
        <form onSubmit={handleSubmit}>
          <div class="mb-6">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="name@flowbite.com" required value={email} onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              required value={password} onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
        <a href='/login'>アカウントをお持ちの方</a>
      </div>
    </div>
  );
};

export default SignupForm;
