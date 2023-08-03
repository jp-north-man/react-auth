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
