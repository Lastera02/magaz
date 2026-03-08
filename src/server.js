const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const users = [];

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Невалидный токен' });
  }
}

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Пароль должен быть не короче 6 символов' });
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(409).json({ message: 'Пользователь уже существует' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, passwordHash };
  users.push(user);

  return res.status(201).json({ message: 'Регистрация успешна' });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Неверный email или пароль' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Неверный email или пароль' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '2h'
  });

  return res.json({ token });
});

app.get('/api/me', authMiddleware, (req, res) => {
  return res.json({
    message: 'Доступ к защищенному маршруту получен',
    user: req.user
  });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});
