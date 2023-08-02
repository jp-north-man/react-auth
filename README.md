# auth memo
reactとexpressを使った認証機能のメモです。(自分用)   

express, backend/index.js   
```
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const port = 5000;

const users = [];

app.get('/auth', (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) throw new Error('未認証');
  
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) throw new Error('無効なトークン');
        res.json({ token: token, user: { id: user.id, email: user.email } });
      });
    } catch (error) {
      res.status(401).send(error.message);
    }
  });
  

app.post('/signup', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { id: uuidv4(), email: req.body.email, password: hashedPassword };
    users.push(user);
    console.log(users);
    res.status(201).json({ message: 'ユーザーが正常に作成されました' });
});


app.post('/login', async (req, res) => {
    const user = users.find(user => user.email === req.body.email);
    if (user == null) {
        return res.status(400).send('ユーザーが見つからない');
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            console.log('emailとpasswordは正しい')
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.cookie('token', token, { httpOnly: true });
            res.json({ token: token, user: { id: user.id, email: user.email } });
        } else {
            res.send('認証失敗');
        }
    } catch {
        res.status(500).send();
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'ログアウト成功' });
});


app.get('/', (req, res) => {
    console.log('hello');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;

```

client/src/AuthProvider.js
```
import React, { createContext, useState } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({isLoggedIn: false, user: null, token: null});

  const login = (token, user) => {
    setAuth({isLoggedIn: true, user, token});
    console.log(auth);
  };

  const logout = () => {
    setAuth({isLoggedIn: false, user: null, token: null});
    console.log(auth);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
};


```

使用例

```
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthProvider';
import { useNavigate  } from 'react-router-dom';

const LoginForm = () => {
  const Navigate  = useNavigate ();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { auth, login } = useContext(AuthContext);

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
      console.log(data.token, data.user)
      login(data.token, data.user);
      console.log(auth);
      setError(null);
      Navigate('/');
    } catch (error) {
        setError(error.message);
    }
  }

  return (
    <div className='flex justify-center my-24'>
      <div className='w-96'>
        ログイン
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
              required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
              <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
            </div>
            <label for="remember" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">利用規約など</label>
          </div>
          {error && <p>{error}</p>}
          <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
        <a href='/signup'>アカウントをお持ちでない方</a>
      </div>
    </div>
        
  );
};

export default LoginForm;

```
```
import React, { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const Navigate = useNavigate();
  console.log('Header rendering', auth);

  const handleLoginClick = async () => {
    console.log('handleLoginClick', auth); 
    if (auth.isLoggedIn) {
      try {
        const response = await fetch('http://localhost:5000/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('ログアウトに失敗しました。');
        }

        logout();
      } catch (error) {
        console.error(error.message);
      }
    } else {
      Navigate('/login');
    }
  };

  const handleSignUpClick = () => {
    Navigate('/signup');
  };

  const mypageClick = () => {
    Navigate('/mypage');
  };

  return (
    <header className="bg-white bg-opacity-50 text-black h-14 px-4 border-b border-gray-200 flex items-center justify-between">
      <h1>Header</h1>
      <div>
        {auth.isLoggedIn && (
          <button onClick={mypageClick} className="px-4 py-2 rounded bg-pink-500 text-white mr-2">
            マイページ
          </button>
        )}
        {!auth.isLoggedIn && (
          <button onClick={handleSignUpClick} className="px-4 py-2 rounded bg-green-500 text-white mr-2">
            サインイン
          </button>
        )}
        <button onClick={handleLoginClick} className="px-4 py-2 rounded bg-blue-500 text-white">
          {auth.isLoggedIn ? "ログアウト" : "ログイン"}
        </button>
      </div>
      
    </header>
  );
};

```