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
import React, { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({isLoggedIn: false, user: null, token: null});

  const login = (token, user) => {
    setAuth({isLoggedIn: true, user, token});
  };

  const logout = () => {
    setAuth({isLoggedIn: false, user: null, token: null});
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth', { credentials: 'include' });
        if (!response.ok) throw new Error('認証されてない');

        const data = await response.json();
        login(data.token, data.user);
      } catch (error) {
        console.error(error.message);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
};

```

使用例
```
import React, { useContext } from "react";
import { AuthContext } from "../AuthProvider";

const Header = () => {
  const { auth, logout } = useContext(AuthContext);

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
      window.location.href = '/login';
    }
  };

  const handleSignUpClick = () => {
    window.location.href = '/signup';
  };

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
};

export default Header;
```