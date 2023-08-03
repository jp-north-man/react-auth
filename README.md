# auth memo (自分用)   
reactとexpressを使った認証機能です。   
ログイン状態でヘッダーの表示ボダンを変更します。   
   
## ユーザー登録   
ログイン前はサインインとログインボタンがあります。   
<img src="https://github.com/jp-north-man/react-auth/blob/main/client/public/1.png" width="350px" />   
   
   
ヘッダーのサインインボタンを押して、サインイン情報を入力してsubmitを押します。
<img src="https://github.com/jp-north-man/react-auth/blob/main/client/public/2.png" width="350px" />   
   
   
serverの/signupに入力内容POST        
```js
// client/src/pages/SignupForm.jsの一部 
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
    setError(null);
    window.location.href = '/login';
  } catch (error) {
    setError(error.message);
  }
}
```
   
    
clientからsignupのリクエストデータを受け取る。   
パスワードのbcryptハッシュ化と一意のIDを作り、仮でusers配列に保存します。(本来DBに登録)   
```js
// express, backend/index.jsの一部
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

app.post('/signup', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = { id: uuidv4(), email: req.body.email, password: hashedPassword };
  users.push(user);
  console.log(users);
  res.status(201).json({ message: 'ユーザーが正常に作成されました' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;
```
   
    
## ログイン   
サインイン後ヘッダーのログインボタンから/loginページへ   
<img src="https://github.com/jp-north-man/react-auth/blob/main/client/public/3.png" width="350px" />   
   
   
serverの/loginに入力内容POST   
serverで作成したtokenとuserデータをAuthContextのloginに入れます。   
```js
// client/src/pages/LoginForm.jsの一部   
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
    login(data.token, data.user);
    setError(null);
    Navigate('/');
  } catch (error) {
      setError(error.message);
  }
}
```
   
  
server側ではuser情報を検索、tokenを作成してcookieに保存します。    
tokenとuser情報をclientに返します。   
```js
// express, backend/index.jsの一部   
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
```
   

AuthContext   
```js
// client/src/AuthProvider.js   
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
   
   
App.jsで親コンポーネントとしてラップします。   
```js
// client/src/App.js   
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopPage from "./pages/TopPage"
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import {AuthProvider} from "./AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </Router>
    </AuthProvider>
    
  );
}

export default App;
```
   
  
## ログアウト   
ログイン後ヘッダーの表示されるボタンが切り替わります。   
<img src="https://github.com/jp-north-man/react-auth/blob/main/client/public/4.png" width="350px" />   
   
   
```js
// client/src/components/Header.jsの一部   
const { auth, logout } = useContext(AuthContext);
return (
  <header className="bg-white bg-opacity-50 text-black h-14 px-4 border-b border-gray-200 flex items-center justify-between">
    <h1>Header</h1>
    <div>
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
```
   

ログアウトボタンを押してログアウトします。   
isLoggedInがtrueならログアウト処理を行います。   
```js
// client/src/components/Header.jsの一部   
const { auth, logout } = useContext(AuthContext);
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
```
   

server側ではCookieをクリアして、メッセージをクライアントへ返します。  
```js
//  express, backend/index.jsの一部   
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'ログアウト成功' });
});
```
   

## 使用技術   
- フロントエンド   
  - react-router-dom
  - tailwind css
   
- バックエンド
  - Express
  - jsonwebtoken 
  - bcrypt
  - cookie-parser
  - uuid
  - cors