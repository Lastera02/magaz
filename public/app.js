const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const profileBtn = document.getElementById('profile-btn');
const logoutBtn = document.getElementById('logout-btn');
const result = document.getElementById('result');

const TOKEN_KEY = 'magaz_token';

function setResult(data) {
  result.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  setResult(data);
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok && data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
    setResult({ message: 'Успешный вход', token: data.token });
    return;
  }

  setResult(data);
});

profileBtn.addEventListener('click', async () => {
  const token = getToken();

  if (!token) {
    setResult('Сначала выполните вход.');
    return;
  }

  const response = await fetch('/api/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  setResult(data);
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem(TOKEN_KEY);
  setResult('Вы вышли из аккаунта.');
});
