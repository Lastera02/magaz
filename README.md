# Magaz Starter

Стартовый проект магазина с базовыми функциями:

- регистрация пользователя;
- логин пользователя;
- выдача JWT токена;
- проверка доступа к защищенному маршруту `/api/me`.

## Запуск

```bash
npm install
npm start
```

Откройте в браузере: `http://localhost:3000`.

## API

### `POST /api/register`

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### `POST /api/login`

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### `GET /api/me`

Заголовок:

```text
Authorization: Bearer <jwt-token>
```

## Важно

Текущее хранилище пользователей in-memory (массив в `src/server.js`). Для production нужно подключить БД и переместить `JWT_SECRET` в переменные окружения.
